"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { getPrefs } from "@/lib/prefs";
import { buildShape, shapeNames, type ShapeName } from "@/lib/scene/shapes";
import { blitFrag, landscapeFrag, landscapeVert, moteFrag, moteVert, particleFrag, particleVert } from "@/lib/scene/shaders";
import { useExperience } from "@/context/Experience";

/**
 * The living background: a night (or dawn) landscape with a lake, and a
 * particle sculpture that re-forms into a new shape for each section.
 * Sections opt in with data-scene="tree|wave|knot|clusters|globe|plane"
 * and data-scene-side="left|right|center".
 *
 * Performance: the landscape renders at reduced resolution into a texture,
 * frame rate is measured every second and resolution and particle count step
 * down (and back up) to keep it smooth, and nothing renders while the scene is
 * covered or the tab is hidden. In the simple version it draws one still frame.
 */

type Side = "left" | "right" | "center";

const SHAPE_STYLE: Record<ShapeName, { scale: number; y: number; spin: number; tint: [number, number, number] }> = {
  tree: { scale: 0.8, y: -0.02, spin: 0.09, tint: [1, 1, 1] },
  wave: { scale: 0.9, y: 0.02, spin: 0.05, tint: [0.95, 1, 1.08] },
  knot: { scale: 0.9, y: 0.04, spin: 0.22, tint: [1.05, 0.95, 1.05] },
  clusters: { scale: 0.95, y: 0.04, spin: 0.1, tint: [0.94, 0.98, 1.1] },
  globe: { scale: 0.78, y: 0.05, spin: 0.14, tint: [1, 1, 1] },
  plane: { scale: 0.9, y: 0.08, spin: 0.04, tint: [1.08, 0.96, 1] },
};

const ROUTE_DEFAULT: [RegExp, ShapeName][] = [
  [/^\/$/, "tree"],
  [/^\/projects\/.+/, "knot"],
  [/^\/projects/, "clusters"],
  [/^\/about/, "globe"],
  [/^\/contact/, "plane"],
];
const routeShape = (path: string) => ROUTE_DEFAULT.find(([re]) => re.test(path))?.[1] ?? "tree";

const NIGHT = [
  [0.98, 0.88, 1.0],
  [0.78, 0.42, 1.0],
  [0.55, 0.28, 1.0],
  [1.0, 0.48, 0.86],
];
const DAWN = [
  [0.6, 0.26, 0.98],
  [0.78, 0.3, 0.86],
  [0.42, 0.18, 0.82],
  [0.98, 0.45, 0.75],
];

const TIERS = {
  high: { count: 8000, dprCap: 2, motes: 240, octaves: 5, size: 16 },
  low: { count: 3000, dprCap: 1.25, motes: 100, octaves: 3, size: 20 },
};
/** Steps the renderer moves through when frame rate drops. */
const STEPS = [1, 0.85, 0.7, 0.55];
const LANDSCAPE_RES = 0.75; // landscape pixels per CSS pixel, before stepping
const MORPH_MS = 1900;
const MAX_DELAY = 0.35;

function compile(gl: WebGL2RenderingContext, vs: string, fs: string) {
  const make = (type: number, src: string) => {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) ?? "shader");
    return shader;
  };
  const program = gl.createProgram()!;
  gl.attachShader(program, make(gl.VERTEX_SHADER, vs));
  gl.attachShader(program, make(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) ?? "link");
  return program;
}

/** Perspective projection written into `out` (column-major), so frames allocate nothing. */
function perspective(out: Float32Array, fovy: number, aspect: number, near: number, far: number) {
  const f = 1 / Math.tan(fovy / 2);
  const nf = 1 / (near - far);
  out.fill(0);
  out[0] = f / aspect;
  out[5] = f;
  out[10] = (far + near) * nf;
  out[11] = -1;
  out[14] = 2 * far * near * nf;
  return out;
}

/** translate(0,0,-dist) · rotX · rotY · scale, written into `out` (column-major). */
function viewMatrix(out: Float32Array, rx: number, ry: number, scale: number, dist: number) {
  const cx = Math.cos(rx), sx = Math.sin(rx), cy = Math.cos(ry), sy = Math.sin(ry);
  out[0] = cy * scale; out[1] = sx * sy * scale; out[2] = -cx * sy * scale; out[3] = 0;
  out[4] = 0; out[5] = cx * scale; out[6] = sx * scale; out[7] = 0;
  out[8] = sy * scale; out[9] = -sx * cy * scale; out[10] = cx * cy * scale; out[11] = 0;
  out[12] = 0; out[13] = 0; out[14] = -dist; out[15] = 1;
  return out;
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function SceneCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { quality, calm } = useExperience();
  const pathname = usePathname();
  const routeRef = useRef(pathname);

  useEffect(() => {
    routeRef.current = pathname;
    document.documentElement.style.setProperty("--scrim", pathname === "/" ? "0" : "1");
    window.dispatchEvent(new Event("scene:rescan"));
  }, [pathname]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const root = document.documentElement;
    const ready = () => window.dispatchEvent(new Event("scene:ready"));
    const gl = canvas.getContext("webgl2", { antialias: false, alpha: false, powerPreference: "high-performance" });
    if (!gl) {
      root.classList.add("no-webgl");
      ready();
      return;
    }

    const tier = TIERS[quality];
    let landscape: WebGLProgram, blit: WebGLProgram, particles: WebGLProgram, motesProgram: WebGLProgram;
    try {
      landscape = compile(gl, landscapeVert, landscapeFrag);
      blit = compile(gl, landscapeVert, blitFrag);
      particles = compile(gl, particleVert, particleFrag);
      motesProgram = compile(gl, moteVert, moteFrag);
    } catch (error) {
      console.warn("Scene disabled:", error);
      root.classList.add("no-webgl");
      ready();
      return;
    }

    const u = (program: WebGLProgram, name: string) => gl.getUniformLocation(program, name);
    const L = {
      res: u(landscape, "uRes"), time: u(landscape, "uTime"), theme: u(landscape, "uTheme"), mouse: u(landscape, "uMouse"),
      scroll: u(landscape, "uScroll"), octaves: u(landscape, "uOctaves"), tint: u(landscape, "uTint"),
    };
    const B = { tex: u(blit, "uTex"), res: u(blit, "uRes") };
    const P = {
      proj: u(particles, "uProj"), view: u(particles, "uView"), time: u(particles, "uTime"), size: u(particles, "uSize"),
      dpr: u(particles, "uDpr"), mouse: u(particles, "uMouse"), offset: u(particles, "uOffset"), aspect: u(particles, "uAspect"),
      theme: u(particles, "uTheme"), c: [0, 1, 2, 3].map((i) => u(particles, `uC${i}`)),
    };
    const M = { time: u(motesProgram, "uTime"), theme: u(motesProgram, "uTheme"), dpr: u(motesProgram, "uDpr") };

    // Particle state. Buffers are shuffled, so drawing the first N is an even subsample.
    const count = tier.count;
    const shapes = Object.fromEntries(shapeNames.map((n) => [n, buildShape(n, count)])) as Record<ShapeName, Float32Array>;
    const seeds = new Float32Array(count);
    const dirs = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const s = (Math.sin(i * 12.9898) * 43758.5453) % 1;
      seeds[i] = s < 0 ? s + 1 : s;
      const a = seeds[i] * Math.PI * 2;
      const b = Math.acos(2 * ((i * 0.618) % 1) - 1);
      dirs[i * 3] = Math.sin(b) * Math.cos(a);
      dirs[i * 3 + 1] = Math.sin(b) * Math.sin(a);
      dirs[i * 3 + 2] = Math.cos(b);
    }

    let shape: ShapeName = routeShape(routeRef.current);
    const current = new Float32Array(shapes[shape]);
    let from = new Float32Array(current);
    let to = shapes[shape];
    let morphStart = -1;
    let morphing = false;

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, current, gl.DYNAMIC_DRAW);
    const aPos = gl.getAttribLocation(particles, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);
    const seedBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, seedBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, seeds, gl.STATIC_DRAW);
    const aSeed = gl.getAttribLocation(particles, "aSeed");
    gl.enableVertexAttribArray(aSeed);
    gl.vertexAttribPointer(aSeed, 1, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);
    const emptyVao = gl.createVertexArray();

    // Offscreen target for the landscape
    const landTex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, landTex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const landFbo = gl.createFramebuffer();
    let landW = 1;
    let landH = 1;

    // Render-loop state (declared before anything can request a frame)
    let frame = 0;
    let firstFrame = true;

    // Live inputs
    let width = 1, height = 1, dpr = 1;
    let step = 0;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let scroll = 0, scrollTarget = 0;
    let theme = getPrefs().theme === "light" ? 1 : 0;
    const place = { x: 0.38, y: 0, scale: 1, tx: 0.38, ty: 0, tscale: 1 };
    const tint = [1, 1, 1];
    let side: Side = "right";
    const projMatrix = new Float32Array(16);
    const viewMat = new Float32Array(16);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, tier.dprCap) * STEPS[step];
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      landW = Math.max(1, Math.round(width * LANDSCAPE_RES * STEPS[step]));
      landH = Math.max(1, Math.round(height * LANDSCAPE_RES * STEPS[step]));
      gl.bindTexture(gl.TEXTURE_2D, landTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, landW, landH, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.bindFramebuffer(gl.FRAMEBUFFER, landFbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, landTex, 0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      canvas.dataset.step = String(step);
      updatePlacement();
      request();
    };

    const updatePlacement = () => {
      const narrow = width / height < 0.95;
      const style = SHAPE_STYLE[shape];
      place.tx = narrow ? 0 : side === "right" ? 0.4 : side === "left" ? -0.4 : 0;
      place.ty = narrow ? 0.42 + style.y : style.y;
      place.tscale = style.scale * (narrow ? 0.52 : 1);
      if (calm) {
        place.x = place.tx;
        place.y = place.ty;
        place.scale = place.tscale;
      }
    };

    const setShape = (next: ShapeName, nextSide: Side) => {
      side = nextSide;
      if (next !== shape) {
        shape = next;
        to = shapes[next];
        if (calm) {
          current.set(to);
          gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
          gl.bufferSubData(gl.ARRAY_BUFFER, 0, current);
        } else {
          from = new Float32Array(current);
          morphStart = -1;
          morphing = true;
        }
      }
      updatePlacement();
      request();
    };

    // Which section fills most of the screen? (Animated version only.)
    const visible = new Map<Element, number>();
    const io = new IntersectionObserver(
      (entries) => {
        if (calm) return;
        for (const e of entries) {
          if (e.isIntersecting) visible.set(e.target, e.intersectionRect.height);
          else visible.delete(e.target);
        }
        let best: HTMLElement | null = null;
        let most = 0;
        visible.forEach((h, el) => {
          if (h > most) {
            most = h;
            best = el as HTMLElement;
          }
        });
        const el = best as HTMLElement | null;
        if (el) setShape((el.dataset.scene as ShapeName) || shape, (el.dataset.sceneSide as Side) || "right");
      },
      { threshold: Array.from({ length: 21 }, (_, i) => i / 20) },
    );
    let rescanTimer = 0;
    const rescan = () => {
      io.disconnect();
      visible.clear();
      const found = document.querySelectorAll("[data-scene]");
      if (calm || found.length === 0) {
        const first = found[0] as HTMLElement | undefined;
        setShape(routeShape(routeRef.current), (first?.dataset.sceneSide as Side) || "right");
      }
      if (!calm) found.forEach((el) => io.observe(el));
    };
    const mo = new MutationObserver(() => {
      window.clearTimeout(rescanTimer);
      rescanTimer = window.setTimeout(rescan, 120);
    });
    const main = document.querySelector("main");
    if (main) mo.observe(main, { childList: true, subtree: true });
    window.addEventListener("scene:rescan", rescan);

    const onPointer = (e: PointerEvent) => {
      if (calm) return;
      mouse.tx = (e.clientX / width) * 2 - 1;
      mouse.ty = -((e.clientY / height) * 2 - 1);
      request();
    };
    const onScroll = () => {
      if (calm) return;
      const max = document.documentElement.scrollHeight - height;
      scrollTarget = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      request();
    };

    // Frame-rate monitor
    let frames = 0;
    let windowStart = performance.now();
    const warmupUntil = windowStart + 2500;
    let slowWindows = 0;
    let fastWindows = 0;
    let slowNotified = false;
    const adapt = (fps: number) => {
      if (fps < 45) {
        fastWindows = 0;
        slowWindows++;
        if (step < STEPS.length - 1) {
          step++;
          resize();
        } else if (fps < 24 && slowWindows >= 4 && !slowNotified) {
          slowNotified = true;
          window.dispatchEvent(new Event("scene:slow"));
        }
      } else if (fps > 56) {
        slowWindows = 0;
        fastWindows++;
        if (fastWindows >= 4 && step > 0) {
          step--;
          fastWindows = 0;
          resize();
        }
      } else {
        slowWindows = 0;
        fastWindows = 0;
      }
    };

    const start = performance.now();
    let lastNow = start;

    const paused = () =>
      document.hidden || (!firstFrame && (root.dataset.intro !== "seen" || root.classList.contains("is-locked")));

    const render = (now: number) => {
      frame = 0;
      const dt = Math.min(64, now - lastNow);
      lastNow = now;
      const k = calm ? 1 : 1 - Math.pow(0.001, dt / 1000);
      const time = calm ? 12 : (now - start) / 1000;

      const targetTheme = getPrefs().theme === "light" ? 1 : 0;
      theme = calm ? targetTheme : lerp(theme, targetTheme, Math.min(1, dt / 160));
      mouse.x = lerp(mouse.x, mouse.tx, k * 0.6);
      mouse.y = lerp(mouse.y, mouse.ty, k * 0.6);
      scroll = lerp(scroll, scrollTarget, k);
      place.x = lerp(place.x, place.tx, k * 0.5);
      place.y = lerp(place.y, place.ty, k * 0.5);
      place.scale = lerp(place.scale, place.tscale, k * 0.5);
      const st = SHAPE_STYLE[shape].tint;
      for (let i = 0; i < 3; i++) tint[i] = calm ? st[i] : lerp(tint[i], st[i], k * 0.3);

      if (morphing) {
        if (morphStart < 0) morphStart = now;
        const t = (now - morphStart) / MORPH_MS;
        for (let i = 0; i < count; i++) {
          const ti = Math.max(0, Math.min(1, (t - seeds[i] * MAX_DELAY) / (1 - MAX_DELAY)));
          const e = ease(ti);
          const burst = Math.sin(Math.PI * ti) * 0.38;
          const j = i * 3;
          current[j] = from[j] + (to[j] - from[j]) * e + dirs[j] * burst;
          current[j + 1] = from[j + 1] + (to[j + 1] - from[j + 1]) * e + dirs[j + 1] * burst;
          current[j + 2] = from[j + 2] + (to[j + 2] - from[j + 2]) * e + dirs[j + 2] * burst;
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, current);
        if (t >= 1) morphing = false;
      }

      gl.disable(gl.DEPTH_TEST);
      gl.disable(gl.BLEND);

      // Landscape into its low-resolution texture...
      gl.bindFramebuffer(gl.FRAMEBUFFER, landFbo);
      gl.viewport(0, 0, landW, landH);
      gl.useProgram(landscape);
      gl.bindVertexArray(emptyVao);
      gl.uniform2f(L.res, landW, landH);
      gl.uniform1f(L.time, time);
      gl.uniform1f(L.theme, theme);
      gl.uniform2f(L.mouse, mouse.x, mouse.y);
      gl.uniform1f(L.scroll, scroll);
      gl.uniform1i(L.octaves, tier.octaves);
      gl.uniform3f(L.tint, tint[0], tint[1], tint[2]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      // ...then stretched over the screen
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(blit);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, landTex);
      gl.uniform1i(B.tex, 0);
      gl.uniform2f(B.res, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      // Additive glow at night, normal blending at dawn so colours stay rich on a light sky
      gl.enable(gl.BLEND);
      if (theme < 0.5) gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      else gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      const aspect = width / height;
      const style = SHAPE_STYLE[shape];
      gl.useProgram(particles);
      gl.bindVertexArray(vao);
      gl.uniformMatrix4fv(P.proj, false, perspective(projMatrix, (40 * Math.PI) / 180, aspect, 0.1, 50));
      gl.uniformMatrix4fv(
        P.view,
        false,
        viewMatrix(viewMat, -0.08 + mouse.y * 0.12, time * style.spin + mouse.x * 0.35, place.scale, 3.4),
      );
      gl.uniform1f(P.time, time);
      gl.uniform1f(P.size, tier.size);
      gl.uniform1f(P.dpr, dpr);
      gl.uniform2f(P.mouse, calm ? 9 : mouse.x, calm ? 9 : mouse.y);
      gl.uniform2f(P.offset, place.x, place.y);
      gl.uniform1f(P.aspect, aspect);
      gl.uniform1f(P.theme, theme);
      for (let i = 0; i < 4; i++) {
        gl.uniform3f(P.c[i], lerp(NIGHT[i][0], DAWN[i][0], theme), lerp(NIGHT[i][1], DAWN[i][1], theme), lerp(NIGHT[i][2], DAWN[i][2], theme));
      }
      gl.drawArrays(gl.POINTS, 0, Math.round(count * STEPS[step]));

      gl.useProgram(motesProgram);
      gl.bindVertexArray(emptyVao);
      gl.uniform1f(M.time, time);
      gl.uniform1f(M.theme, theme);
      gl.uniform1f(M.dpr, dpr);
      gl.drawArrays(gl.POINTS, 0, Math.round(tier.motes * STEPS[step]));

      if (firstFrame) {
        firstFrame = false;
        canvas.classList.add("is-ready");
        ready();
      }

      if (!calm) {
        frames++;
        if (now - windowStart >= 1000) {
          if (now > warmupUntil) adapt((frames * 1000) / (now - windowStart));
          frames = 0;
          windowStart = now;
        }
        if (!paused()) frame = requestAnimationFrame(render);
      }
    };

    function request() {
      if (!frame && !paused()) frame = requestAnimationFrame(render);
    }

    const onResume = () => {
      // Restart timing so a pause doesn't count as a slow frame.
      lastNow = performance.now();
      frames = 0;
      windowStart = lastNow;
      request();
    };
    const stateObserver = new MutationObserver(onResume);
    stateObserver.observe(root, { attributes: true, attributeFilter: ["data-theme", "data-intro", "class"] });
    const onLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(frame);
      frame = 0;
      root.classList.add("no-webgl");
    };

    // Start only once everything above exists.
    resize();
    onScroll();
    rescan();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onResume);
    canvas.addEventListener("webglcontextlost", onLost);

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      mo.disconnect();
      stateObserver.disconnect();
      window.clearTimeout(rescanTimer);
      window.removeEventListener("scene:rescan", rescan);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onResume);
      canvas.removeEventListener("webglcontextlost", onLost);
      gl.deleteBuffer(posBuffer);
      gl.deleteBuffer(seedBuffer);
      gl.deleteVertexArray(vao);
      gl.deleteVertexArray(emptyVao);
      gl.deleteTexture(landTex);
      gl.deleteFramebuffer(landFbo);
      [landscape, blit, particles, motesProgram].forEach((p) => gl.deleteProgram(p));
    };
  }, [quality, calm]);

  return (
    <>
      <canvas ref={canvasRef} className="scene" aria-hidden="true" />
      <div className="scene-scrim" aria-hidden="true" />
    </>
  );
}
