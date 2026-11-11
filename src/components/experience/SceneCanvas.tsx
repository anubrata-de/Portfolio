"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { getPrefs } from "@/lib/prefs";
import { buildShape, shapeNames, type ShapeName } from "@/lib/scene/shapes";
import { blitFrag, landscapeFrag, landscapeVert, moteFrag, moteVert, particleFrag, particleVert } from "@/lib/scene/shaders";
import { useExperience } from "@/context/Experience";

/**
 * The living background: a night (or dawn) landscape with a lake, and a
 * particle sculpture driven by the scroll position.
 *
 * Each section marks an anchor with data-scene="tree|wave|knot|clusters|globe|plane"
 * and data-scene-side="left|right|center". Between two anchors the scroll position
 * scrubs the morph from one shape to the next: the particles burst outward, the
 * camera flies through the cloud, and they regather as the next shape. Rotation and
 * the landscape parallax follow the scroll too, so every scroll moves something.
 *
 * Performance: the landscape renders at reduced resolution into a texture, frame
 * rate is measured every second and resolution and particle count step down (and
 * back up) to stay smooth, and nothing renders while the scene is covered or the
 * tab is hidden. In the simple version it draws one still frame.
 */

type Side = "left" | "right" | "center";
type Anchor = { y: number; shape: ShapeName; side: Side };

const SHAPE_STYLE: Record<ShapeName, { scale: number; y: number; spin: number; tint: [number, number, number] }> = {
  tree: { scale: 0.82, y: -0.02, spin: 0.09, tint: [1, 1, 1] },
  wave: { scale: 0.92, y: 0.02, spin: 0.05, tint: [0.95, 1, 1.08] },
  knot: { scale: 0.9, y: 0.04, spin: 0.2, tint: [1.05, 0.95, 1.05] },
  clusters: { scale: 0.95, y: 0.04, spin: 0.1, tint: [0.94, 0.98, 1.1] },
  globe: { scale: 0.8, y: 0.05, spin: 0.14, tint: [1, 1, 1] },
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
  [0.8, 0.45, 1.0],
  [0.58, 0.3, 1.0],
  [1.0, 0.52, 0.88],
];
const DAWN = [
  [0.6, 0.26, 0.98],
  [0.78, 0.3, 0.86],
  [0.42, 0.18, 0.82],
  [0.98, 0.45, 0.75],
];

const TIERS = {
  high: { count: 8000, dprCap: 2, motes: 240, octaves: 5, size: 19 },
  low: { count: 3000, dprCap: 1.25, motes: 100, octaves: 3, size: 24 },
};
/** Steps the renderer moves through when frame rate drops. */
const STEPS = [1, 0.85, 0.7, 0.55];
const LANDSCAPE_RES = 0.75; // landscape pixels per CSS pixel, before stepping
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
const smooth = (a: number, b: number, t: number) => {
  const x = Math.max(0, Math.min(1, (t - a) / (b - a)));
  return x * x * (3 - 2 * x);
};
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

    // Particle data. Buffers are shuffled, so drawing the first N is an even subsample.
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
    const current = new Float32Array(shapes[routeShape(routeRef.current)]);

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
    let width = 1, height = 1, dpr = 1;
    let step = 0;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let pageProgress = 0;
    let theme = getPrefs().theme === "light" ? 1 : 0;
    const place = { x: 0.4, y: 0, scale: 0.82, fly: 0 };
    const tint = [1, 1, 1];
    let spinShape: ShapeName = routeShape(routeRef.current);
    const projMatrix = new Float32Array(16);
    const viewMat = new Float32Array(16);

    // Scroll anchors: the centre of every [data-scene] section, top to bottom.
    let anchors: Anchor[] = [];
    let lastMorphKey = "";
    const measure = () => {
      anchors = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"))
        .map((el) => {
          const r = el.getBoundingClientRect();
          return {
            y: r.top + window.scrollY + r.height / 2,
            shape: (el.dataset.scene as ShapeName) || "tree",
            side: (el.dataset.sceneSide as Side) || "right",
          };
        })
        .sort((a, b) => a.y - b.y);
      lastMorphKey = "";
      request();
    };

    const sideX = (side: Side) => (width / height < 0.95 ? 0 : side === "right" ? 0.4 : side === "left" ? -0.4 : 0);

    /** Where between two anchors the middle of the screen sits, 0..1. */
    const locate = (): { a: Anchor; b: Anchor; m: number } => {
      if (calm || anchors.length === 0) {
        const shape = routeShape(routeRef.current);
        const first = anchors[0];
        const only = { y: 0, shape, side: first?.side ?? "right" };
        return { a: only, b: only, m: 0 };
      }
      const centre = window.scrollY + height * 0.5;
      if (centre <= anchors[0].y) return { a: anchors[0], b: anchors[0], m: 0 };
      for (let i = 0; i < anchors.length - 1; i++) {
        const a = anchors[i];
        const b = anchors[i + 1];
        if (centre < b.y) {
          // Hold each shape briefly around its section, morph through the rest.
          const t = (centre - a.y) / Math.max(1, b.y - a.y);
          return { a, b, m: smooth(0.12, 0.88, t) };
        }
      }
      const last = anchors[anchors.length - 1];
      return { a: last, b: last, m: 0 };
    };

    const updateParticles = (a: ShapeName, b: ShapeName, m: number) => {
      const key = a === b || m <= 0 ? a : m >= 1 ? b : `${a}>${b}:${m.toFixed(4)}`;
      if (key === lastMorphKey) return;
      lastMorphKey = key;
      const A = shapes[a];
      const Bs = shapes[b];
      if (a === b || m <= 0) current.set(A);
      else if (m >= 1) current.set(Bs);
      else {
        for (let i = 0; i < count; i++) {
          const ti = Math.max(0, Math.min(1, (m - seeds[i] * MAX_DELAY) / (1 - MAX_DELAY)));
          const e = ease(ti);
          const burst = Math.sin(Math.PI * ti) * 0.6;
          const j = i * 3;
          current[j] = A[j] + (Bs[j] - A[j]) * e + dirs[j] * burst;
          current[j + 1] = A[j + 1] + (Bs[j + 1] - A[j + 1]) * e + dirs[j + 1] * burst;
          current[j + 2] = A[j + 2] + (Bs[j + 2] - A[j + 2]) * e + dirs[j + 2] * burst;
        }
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, current);
    };

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
      request();
    };

    let measureTimer = 0;
    const remeasureSoon = () => {
      window.clearTimeout(measureTimer);
      measureTimer = window.setTimeout(measure, 150);
    };
    const mo = new MutationObserver(remeasureSoon);
    const main = document.querySelector("main");
    if (main) mo.observe(main, { childList: true, subtree: true });
    window.addEventListener("scene:rescan", remeasureSoon);
    document.fonts?.ready.then(measure);

    const onPointer = (e: PointerEvent) => {
      if (calm) return;
      mouse.tx = (e.clientX / width) * 2 - 1;
      mouse.ty = -((e.clientY / height) * 2 - 1);
      request();
    };
    const onScroll = () => {
      if (!calm) request();
    };

    // Frame-rate monitor
    let frames = 0;
    let windowStart = performance.now();
    const warmupUntil = windowStart + 2500;
    let slowWindows = 0;
    let fastWindows = 0;
    let slowNotified = false;
    // Quality changes resize at the start of the next frame, so the clear and redraw happen together.
    let resizePending = false;
    const adapt = (fps: number) => {
      if (fps < 45) {
        fastWindows = 0;
        slowWindows++;
        if (step < STEPS.length - 1) {
          step++;
          resizePending = true;
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
          resizePending = true;
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
      if (resizePending) {
        resizePending = false;
        resize();
      }
      const dt = Math.min(64, now - lastNow);
      lastNow = now;
      const follow = calm ? 1 : 1 - Math.pow(0.0005, dt / 1000); // fast, but never a hard jump
      const time = calm ? 12 : (now - start) / 1000;

      const targetTheme = getPrefs().theme === "light" ? 1 : 0;
      theme = calm ? targetTheme : lerp(theme, targetTheme, Math.min(1, dt / 160));
      mouse.x = lerp(mouse.x, mouse.tx, follow * 0.5);
      mouse.y = lerp(mouse.y, mouse.ty, follow * 0.5);
      const maxScroll = document.documentElement.scrollHeight - height;
      pageProgress = lerp(pageProgress, maxScroll > 0 ? Math.min(1, window.scrollY / maxScroll) : 0, follow);

      // Scroll-scrubbed sculpture
      const { a, b, m } = locate();
      updateParticles(a.shape, b.shape, m);
      const me = ease(m);
      const sa = SHAPE_STYLE[a.shape];
      const sb = SHAPE_STYLE[b.shape];
      const narrow = width / height < 0.95;
      const flyTarget = a.shape !== b.shape ? Math.sin(Math.PI * m) : 0;
      place.fly = lerp(place.fly, flyTarget, follow);
      // Mid-transition the cloud drifts towards the centre while the camera flies into it.
      place.x = lerp(place.x, lerp(sideX(a.side), sideX(b.side), me) * (1 - place.fly * 0.7), follow);
      place.y = lerp(place.y, lerp(sa.y, sb.y, me) + (narrow ? 0.42 : 0), follow);
      place.scale = lerp(place.scale, lerp(sa.scale, sb.scale, me) * (narrow ? 0.52 : 1), follow);
      spinShape = m < 0.5 ? a.shape : b.shape;
      for (let i = 0; i < 3; i++) tint[i] = lerp(tint[i], lerp(sa.tint[i], sb.tint[i], me), follow);

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
      gl.uniform1f(L.scroll, pageProgress);
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
      const spin = time * SHAPE_STYLE[spinShape].spin + window.scrollY * 0.0009 + mouse.x * 0.35;
      gl.useProgram(particles);
      gl.bindVertexArray(vao);
      gl.uniformMatrix4fv(P.proj, false, perspective(projMatrix, (40 * Math.PI) / 180, aspect, 0.1, 50));
      gl.uniformMatrix4fv(
        P.view,
        false,
        viewMatrix(viewMat, -0.08 + mouse.y * 0.12 + place.fly * 0.25, spin, place.scale, 3.4 - place.fly * 2.2),
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
    const onResize = () => {
      resize();
      remeasureSoon();
    };

    // Start only once everything above exists.
    resize();
    measure();
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onResume);
    canvas.addEventListener("webglcontextlost", onLost);

    return () => {
      cancelAnimationFrame(frame);
      mo.disconnect();
      stateObserver.disconnect();
      window.clearTimeout(measureTimer);
      window.removeEventListener("scene:rescan", remeasureSoon);
      window.removeEventListener("resize", onResize);
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
