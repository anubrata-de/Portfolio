/**
 * Point clouds the particle sculpture morphs between. Every shape returns
 * exactly `count` points so any shape can blend into any other.
 * Units are roughly -1.2..1.2, y up.
 */

export type ShapeName = "tree" | "wave" | "knot" | "clusters" | "globe" | "plane";

export const shapeNames: ShapeName[] = ["tree", "wave", "knot", "clusters", "globe", "plane"];

type Rand = () => number;

function rng(seed: number): Rand {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gauss(r: Rand) {
  return Math.sqrt(-2 * Math.log(Math.max(r(), 1e-9))) * Math.cos(2 * Math.PI * r());
}

function randomInSphere(r: Rand): [number, number, number] {
  const u = r() * 2 - 1;
  const t = r() * Math.PI * 2;
  const s = Math.sqrt(1 - u * u);
  return [s * Math.cos(t), u, s * Math.sin(t)];
}

function tree(count: number, r: Rand, out: Float32Array) {
  const trunk = Math.floor(count * 0.08);
  const branches = Math.floor(count * 0.12);
  const blobs = [
    { c: [0, 0.48, 0], s: 0.56 },
    { c: [-0.46, 0.28, 0.08], s: 0.4 },
    { c: [0.48, 0.32, -0.1], s: 0.42 },
    { c: [-0.2, 0.68, -0.26], s: 0.36 },
    { c: [0.26, 0.76, 0.2], s: 0.34 },
    { c: [0.02, 0.2, 0.36], s: 0.3 },
    { c: [-0.62, 0.52, -0.18], s: 0.26 },
  ];
  const weights = blobs.map((b) => b.s * b.s);
  const total = weights.reduce((a, b) => a + b, 0);
  for (let i = 0; i < count; i++) {
    let x: number, y: number, z: number;
    if (i < trunk) {
      const t = r();
      const radius = 0.075 - t * 0.04;
      const a = r() * Math.PI * 2;
      x = 0.05 * Math.sin(t * 2.6) + Math.cos(a) * radius;
      y = -1.1 + t * 0.95;
      z = Math.sin(a) * radius;
    } else if (i < trunk + branches) {
      const b = Math.floor(r() * 6);
      const t = r();
      const target = blobs[b];
      const sx = 0.05 * Math.sin(0.4 * 2.6);
      const sy = -0.5 + b * 0.06;
      const mx = (sx + target.c[0]) * 0.5 + (b % 2 ? 0.1 : -0.1);
      const my = (sy + target.c[1]) * 0.45;
      const u = 1 - t;
      x = u * u * sx + 2 * u * t * mx + t * t * target.c[0] * 0.8 + gauss(r) * 0.015;
      y = u * u * sy + 2 * u * t * my + t * t * target.c[1] * 0.8 + gauss(r) * 0.015;
      z = t * target.c[2] * 0.8 + gauss(r) * 0.015;
    } else {
      let pick = r() * total;
      let k = 0;
      while (pick > weights[k] && k < blobs.length - 1) pick -= weights[k++];
      const blob = blobs[k];
      const [dx, dy, dz] = randomInSphere(r);
      // Mostly near the surface, so the canopy reads as fluffy volume.
      const rad = blob.s * (0.62 + 0.38 * Math.pow(r(), 0.35));
      x = blob.c[0] + dx * rad;
      y = blob.c[1] + dy * rad * 0.9;
      z = blob.c[2] + dz * rad;
    }
    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  }
}

function wave(count: number, r: Rand, out: Float32Array) {
  const side = Math.ceil(Math.sqrt(count));
  const tilt = -0.55;
  for (let i = 0; i < count; i++) {
    const gx = (i % side) / (side - 1);
    const gz = Math.floor(i / side) / (side - 1);
    const x = (gx * 2 - 1) * 1.35 + (r() - 0.5) * 0.02;
    const z = (gz * 2 - 1) * 1.35 + (r() - 0.5) * 0.02;
    const y = 0.26 * Math.sin(2.2 * x + 1) * Math.cos(1.8 * z) + 0.1 * Math.sin(4 * x + 3 * z);
    // Tip the surface towards the camera.
    out[i * 3] = x;
    out[i * 3 + 1] = y * Math.cos(tilt) - z * Math.sin(tilt) - 0.05;
    out[i * 3 + 2] = y * Math.sin(tilt) + z * Math.cos(tilt);
  }
}

function knot(count: number, r: Rand, out: Float32Array) {
  const p = 2;
  const q = 3;
  const R = 0.72;
  const rr = 0.3;
  const curve = (t: number): [number, number, number] => [
    (R + rr * Math.cos(q * t)) * Math.cos(p * t),
    (R + rr * Math.cos(q * t)) * Math.sin(p * t),
    rr * Math.sin(q * t),
  ];
  for (let i = 0; i < count; i++) {
    const t = r() * Math.PI * 2;
    const a = curve(t);
    const b = curve(t + 0.001);
    const tx = b[0] - a[0];
    const ty = b[1] - a[1];
    const tz = b[2] - a[2];
    const tl = Math.hypot(tx, ty, tz) || 1;
    // Two vectors perpendicular to the tangent.
    let nx = -ty;
    let ny = tx;
    let nz = 0;
    const nl = Math.hypot(nx, ny, nz) || 1;
    nx /= nl;
    ny /= nl;
    const bx = (ty * nz - tz * ny) / tl;
    const by = (tz * nx - tx * nz) / tl;
    const bz = (tx * ny - ty * nx) / tl;
    const ang = r() * Math.PI * 2;
    const tube = 0.09 * Math.sqrt(r());
    out[i * 3] = a[0] + (nx * Math.cos(ang) + bx * Math.sin(ang)) * tube;
    out[i * 3 + 1] = a[1] + (ny * Math.cos(ang) + by * Math.sin(ang)) * tube;
    out[i * 3 + 2] = a[2] + (nz * Math.cos(ang) + bz * Math.sin(ang)) * tube;
  }
}

function clusters(count: number, r: Rand, out: Float32Array) {
  const centres = [
    { c: [-0.72, 0.42, 0.05], s: 0.2 },
    { c: [0.62, 0.52, -0.2], s: 0.22 },
    { c: [0.02, -0.25, 0.32], s: 0.24 },
    { c: [-0.5, -0.62, -0.3], s: 0.18 },
    { c: [0.78, -0.42, 0.12], s: 0.19 },
  ];
  const noise = Math.floor(count * 0.07);
  for (let i = 0; i < count; i++) {
    if (i < noise) {
      out[i * 3] = (r() * 2 - 1) * 1.25;
      out[i * 3 + 1] = (r() * 2 - 1) * 1.05;
      out[i * 3 + 2] = (r() * 2 - 1) * 0.8;
      continue;
    }
    const k = i % centres.length;
    const { c, s } = centres[k];
    out[i * 3] = c[0] + gauss(r) * s;
    out[i * 3 + 1] = c[1] + gauss(r) * s;
    out[i * 3 + 2] = c[2] + gauss(r) * s;
  }
}

function globe(count: number, r: Rand, out: Float32Array) {
  const sphere = Math.floor(count * 0.74);
  const golden = Math.PI * (3 - Math.sqrt(5));
  const tilt = 0.38;
  for (let i = 0; i < count; i++) {
    if (i < sphere) {
      const y = 1 - (i / (sphere - 1)) * 2;
      const rad = Math.sqrt(1 - y * y);
      const th = golden * i;
      const k = 0.88 + gauss(r) * 0.01;
      out[i * 3] = Math.cos(th) * rad * k;
      out[i * 3 + 1] = y * k;
      out[i * 3 + 2] = Math.sin(th) * rad * k;
    } else {
      const a = r() * Math.PI * 2;
      const rad = 1.22 + r() * 0.2;
      const x = Math.cos(a) * rad;
      const z = Math.sin(a) * rad;
      const y = gauss(r) * 0.012;
      out[i * 3] = x;
      out[i * 3 + 1] = y * Math.cos(tilt) - z * Math.sin(tilt);
      out[i * 3 + 2] = y * Math.sin(tilt) + z * Math.cos(tilt);
    }
  }
}

function plane(count: number, r: Rand, out: Float32Array) {
  const nose = [1.15, 0.05, 0];
  const tailL = [-0.85, 0.12, 0.78];
  const tailR = [-0.85, 0.12, -0.78];
  const tailC = [-0.85, 0.16, 0];
  const keel = [-0.85, -0.32, 0];
  const faces = [
    [nose, tailL, tailC],
    [nose, tailR, tailC],
    [nose, tailC, keel],
  ];
  const area = (f: number[][]) => {
    const ax = f[1][0] - f[0][0], ay = f[1][1] - f[0][1], az = f[1][2] - f[0][2];
    const bx = f[2][0] - f[0][0], by = f[2][1] - f[0][1], bz = f[2][2] - f[0][2];
    return Math.hypot(ay * bz - az * by, az * bx - ax * bz, ax * by - ay * bx) / 2;
  };
  const areas = faces.map(area);
  const total = areas.reduce((a, b) => a + b, 0);
  const rz = 0.42;
  const ry = -0.55;
  for (let i = 0; i < count; i++) {
    let pick = r() * total;
    let k = 0;
    while (pick > areas[k] && k < faces.length - 1) pick -= areas[k++];
    const [a, b, c] = faces[k];
    let u = r();
    let v = r();
    if (u + v > 1) {
      u = 1 - u;
      v = 1 - v;
    }
    let x = a[0] + (b[0] - a[0]) * u + (c[0] - a[0]) * v;
    let y = a[1] + (b[1] - a[1]) * u + (c[1] - a[1]) * v + gauss(r) * 0.008;
    let z = a[2] + (b[2] - a[2]) * u + (c[2] - a[2]) * v;
    // Pitch up and turn, as if flying off to the right.
    const x1 = x * Math.cos(rz) - y * Math.sin(rz);
    const y1 = x * Math.sin(rz) + y * Math.cos(rz);
    x = x1 * Math.cos(ry) + z * Math.sin(ry);
    z = -x1 * Math.sin(ry) + z * Math.cos(ry);
    y = y1;
    out[i * 3] = x * 0.9;
    out[i * 3 + 1] = y * 0.9;
    out[i * 3 + 2] = z * 0.9;
  }
}

const builders: Record<ShapeName, (count: number, r: Rand, out: Float32Array) => void> = {
  tree,
  wave,
  knot,
  clusters,
  globe,
  plane,
};

export function buildShape(name: ShapeName, count: number) {
  const out = new Float32Array(count * 3);
  builders[name](count, rng(1234 + shapeNames.indexOf(name) * 977), out);
  // A different shuffle per shape pairs points randomly between shapes,
  // so morphs scatter and regather instead of sweeping across in build order.
  const r = rng(42 + shapeNames.indexOf(name) * 31);
  const idx = new Uint32Array(count);
  for (let i = 0; i < count; i++) idx[i] = i;
  for (let i = count - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    const t = idx[i];
    idx[i] = idx[j];
    idx[j] = t;
  }
  const shuffled = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    shuffled[i * 3] = out[idx[i] * 3];
    shuffled[i * 3 + 1] = out[idx[i] * 3 + 1];
    shuffled[i * 3 + 2] = out[idx[i] * 3 + 2];
  }
  return shuffled;
}
