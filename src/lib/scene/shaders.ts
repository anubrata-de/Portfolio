/**
 * GLSL for the background scene (WebGL 2).
 * uTheme blends between the night palette (0) and the dawn palette (1).
 */

export const landscapeVert = /* glsl */ `#version 300 es
void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

export const landscapeFrag = /* glsl */ `#version 300 es
precision highp float;
out vec4 outColor;

uniform vec2 uRes;
uniform float uTime;
uniform float uTheme;
uniform vec2 uMouse;
uniform float uScroll;
uniform int uOctaves;
uniform vec3 uTint;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 6; i++) {
    if (i >= uOctaves) break;
    v += a * noise(p);
    p = p * 2.03 + vec2(17.1, 9.2);
    a *= 0.5;
  }
  return v;
}

vec3 pal(vec3 night, vec3 dawn) { return mix(night, dawn, uTheme); }

// Everything above the water line, so the lake can reflect it.
vec3 above(vec2 uv, float aspect, float horizon) {
  float t = clamp((uv.y - horizon) / (1.0 - horizon), 0.0, 1.0);
  vec3 top = pal(vec3(0.035, 0.022, 0.085), vec3(0.58, 0.49, 0.90));
  vec3 mid = pal(vec3(0.13, 0.06, 0.27), vec3(0.79, 0.69, 0.95));
  vec3 low = pal(vec3(0.42, 0.17, 0.55), vec3(0.98, 0.84, 0.93));
  vec3 col = mix(low, mid, smoothstep(0.0, 0.32, t));
  col = mix(col, top, smoothstep(0.28, 1.0, t));
  col *= uTint;

  vec2 p = vec2((uv.x - 0.5) * aspect, uv.y);

  // Stars (night only)
  vec2 sp = p * 140.0;
  float sh = hash(floor(sp));
  float star = step(0.986, sh) * smoothstep(0.5, 0.0, length(fract(sp) - 0.5));
  star *= 0.55 + 0.45 * sin(uTime * (1.0 + sh * 3.0) + sh * 50.0);
  col += vec3(0.9, 0.85, 1.0) * star * (1.0 - uTheme) * smoothstep(horizon + 0.05, horizon + 0.3, uv.y);

  // Moon at night, a soft sun haze at dawn
  vec2 m = vec2(0.24, 0.8);
  float d = length((uv - m) * vec2(aspect, 1.0));
  float disk = smoothstep(0.047, 0.043, d);
  float crater = fbm((uv - m) * 60.0) * 0.25;
  col = mix(col, vec3(0.96, 0.92, 1.0) - crater, disk * (1.0 - uTheme));
  col += pal(vec3(0.45, 0.25, 0.75), vec3(1.0, 0.9, 0.85)) * exp(-d * pal(vec3(8.0), vec3(4.5)).x) * pal(vec3(0.45), vec3(0.55)).x;

  // Drifting cloud bands
  float c = fbm(vec2(p.x * 1.4 + uTime * 0.012, p.y * 3.4 - uTime * 0.004));
  float band = smoothstep(0.5, 0.78, c) * smoothstep(horizon + 0.02, horizon + 0.2, uv.y) * (1.0 - smoothstep(0.82, 1.0, uv.y));
  col = mix(col, pal(vec3(0.32, 0.16, 0.48), vec3(1.0, 0.86, 0.96)), band * pal(vec3(0.42), vec3(0.65)).x);

  // Three hill layers, far to near, each nudged by the pointer and scroll for parallax
  for (int k = 0; k < 3; k++) {
    float fk = float(k);
    float par = (uMouse.x * 0.015 + uScroll * 0.04) * (fk + 1.0);
    float freq = 1.4 + fk * 1.25;
    float h = horizon + 0.012 + (0.11 - fk * 0.025) * fbm(vec2(p.x * freq + par + fk * 7.3, fk * 3.1));
    if (k == 2) h = horizon + 0.004 + 0.05 * pow(abs(noise(vec2(p.x * 6.0 + par * 2.0, 4.0)) * 2.0 - 1.0), 0.6);
    vec3 far = pal(vec3(0.16, 0.07, 0.3), vec3(0.62, 0.48, 0.84));
    vec3 near = pal(vec3(0.05, 0.02, 0.11), vec3(0.35, 0.2, 0.58));
    vec3 hill = mix(far, near, fk / 2.0) * uTint;
    float edge = smoothstep(h, h - 0.002, uv.y);
    col = mix(col, hill, edge);
  }
  return col;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  float horizon = 0.3 + uScroll * 0.08 - uMouse.y * 0.01;
  float water = horizon;

  vec3 col;
  if (uv.y >= water) {
    col = above(uv, aspect, horizon);
  } else {
    // Lake: a rippled reflection, darker with depth, with a glint under the moon
    float depth = (water - uv.y) / water;
    float ripple = (noise(vec2(uv.x * 60.0, uv.y * 220.0 - uTime * 0.6)) - 0.5) * 0.012 * (0.4 + depth);
    vec2 r = vec2(uv.x + ripple, water + (water - uv.y) * 0.9);
    col = above(r, aspect, horizon);
    vec3 deep = pal(vec3(0.03, 0.015, 0.07), vec3(0.42, 0.3, 0.68));
    col = mix(col * pal(vec3(0.75), vec3(0.88)), deep, smoothstep(0.0, 1.0, depth) * 0.7);
    float glint = exp(-abs(uv.x - 0.24) * aspect * 12.0) * smoothstep(0.6, 0.9, noise(vec2(uv.x * 90.0, uv.y * 300.0 + uTime)));
    col += pal(vec3(0.6, 0.45, 0.95), vec3(1.0, 0.95, 0.98)) * glint * (1.0 - depth) * 0.5;
  }

  // Foreground grass at the edges
  float sides = smoothstep(0.38, 0.0, uv.x) + smoothstep(0.62, 1.0, uv.x);
  float grass = (0.05 + 0.07 * fbm(vec2(uv.x * 38.0, 1.0)) + 0.02 * sin(uv.x * 220.0 + uTime * 1.3)) * sides;
  vec3 grassCol = pal(vec3(0.09, 0.03, 0.16), vec3(0.47, 0.27, 0.7));
  col = mix(col, grassCol, smoothstep(grass, grass - 0.004, uv.y));

  // Vignette and a little dither against banding
  vec2 v = (uv - 0.5) * vec2(1.05, 1.3);
  col *= 1.0 - dot(v, v) * pal(vec3(0.55), vec3(0.22)).x;
  col += (hash(gl_FragCoord.xy) - 0.5) / 255.0;
  outColor = vec4(col, 1.0);
}`;

/** Stretches the low-resolution landscape texture over the full canvas. */
export const blitFrag = /* glsl */ `#version 300 es
precision mediump float;
uniform sampler2D uTex;
uniform vec2 uRes;
out vec4 outColor;
void main() {
  outColor = texture(uTex, gl_FragCoord.xy / uRes);
}`;

export const particleVert = /* glsl */ `#version 300 es
in vec3 aPos;
in float aSeed;
uniform mat4 uProj;
uniform mat4 uView;
uniform float uTime;
uniform float uSize;
uniform float uDpr;
uniform vec2 uMouse;
uniform vec2 uOffset;
uniform float uAspect;
out float vSeed;
out float vDepth;
out float vGlow;

void main() {
  float s = aSeed * 6.2831;
  vec3 p = aPos + 0.012 * vec3(sin(uTime * 0.9 + s * 3.0), cos(uTime * 0.7 + s * 5.0), sin(uTime * 0.8 + s * 7.0));
  vec4 view = uView * vec4(p, 1.0);
  vec4 clip = uProj * view;
  vec2 ndc = clip.xy / clip.w + uOffset;

  // The pointer gently pushes particles aside
  vec2 d = (ndc - uMouse) * vec2(uAspect, 1.0);
  float dist = length(d);
  float push = smoothstep(0.28, 0.0, dist);
  ndc += (d / max(dist, 1e-4)) * push * 0.07 * vec2(1.0 / uAspect, 1.0);

  gl_Position = vec4(ndc * clip.w, clip.z, clip.w);
  gl_PointSize = uSize * (0.5 + 1.15 * fract(aSeed * 91.7)) * uDpr * (1.0 + push * 0.9) / clip.w;
  vSeed = aSeed;
  vDepth = view.z;
  vGlow = push;
}`;

export const particleFrag = /* glsl */ `#version 300 es
precision highp float;
in float vSeed;
in float vDepth;
in float vGlow;
out vec4 outColor;
uniform float uTheme;
uniform vec3 uC0;
uniform vec3 uC1;
uniform vec3 uC2;
uniform vec3 uC3;

void main() {
  vec2 c = gl_PointCoord - 0.5;
  float r = length(c);
  if (r > 0.5) discard;
  float a = pow(smoothstep(0.5, 0.0, r), 1.5);
  float pick = fract(vSeed * 13.37);
  vec3 col = pick < 0.25 ? uC0 : pick < 0.6 ? uC1 : pick < 0.86 ? uC2 : uC3;
  col = mix(col, vec3(1.0), smoothstep(0.22, 0.0, r) * mix(0.55, 0.15, uTheme));
  float depthFade = clamp(1.25 + (vDepth + 3.4) * 0.45, 0.35, 1.0);
  outColor = vec4(col, a * depthFade * (0.8 + vGlow * 0.4));
}`;

export const moteVert = /* glsl */ `#version 300 es
uniform float uTime;
uniform float uTheme;
uniform float uDpr;
out float vAlpha;
out float vRot;

float h(float n) { return fract(sin(n * 127.1) * 43758.5453); }

void main() {
  float id = float(gl_VertexID);
  float x = h(id) * 2.0 - 1.0;
  float speed = 0.015 + h(id + 1.0) * 0.04;
  // Night: fireflies drifting up from the shore. Dawn: petals falling across the screen.
  float tn = fract(h(id + 2.0) + uTime * speed * 0.5);
  vec2 night = vec2(x * 1.05 + 0.05 * sin(uTime * 0.6 + id), -0.95 + tn * 1.1);
  float td = fract(h(id + 3.0) + uTime * speed * 0.8);
  vec2 dawn = vec2(x * 1.1 + 0.08 * sin(uTime * 1.2 + id * 1.7) + td * 0.25, 1.1 - td * 2.25);
  gl_Position = vec4(mix(night, dawn, uTheme), 0.0, 1.0);
  float blink = 0.5 + 0.5 * sin(uTime * (1.5 + h(id + 4.0) * 2.0) + id);
  float fireflyAlpha = blink * smoothstep(0.0, 0.15, tn) * smoothstep(1.0, 0.65, tn);
  vAlpha = mix(fireflyAlpha, 0.8, uTheme);
  gl_PointSize = mix(3.0 + h(id + 5.0) * 4.0, 7.0 + h(id + 6.0) * 7.0, uTheme) * uDpr;
  vRot = uTime * (0.6 + h(id + 7.0)) + id;
}`;

export const moteFrag = /* glsl */ `#version 300 es
precision highp float;
in float vAlpha;
in float vRot;
out vec4 outColor;
uniform float uTheme;

void main() {
  vec2 c = gl_PointCoord - 0.5;
  // Firefly: round glow
  float glow = pow(smoothstep(0.5, 0.0, length(c)), 2.0);
  // Petal: a rotating ellipse
  float cs = cos(vRot), sn = sin(vRot);
  vec2 q = vec2(c.x * cs - c.y * sn, c.x * sn + c.y * cs);
  float petal = smoothstep(1.0, 0.75, length(q / vec2(0.48, 0.24)));
  float shape = mix(glow, petal, uTheme);
  if (shape < 0.01) discard;
  vec3 col = mix(vec3(1.0, 0.86, 0.62), vec3(1.0, 0.7, 0.86), uTheme);
  outColor = vec4(col, shape * vAlpha);
}`;
