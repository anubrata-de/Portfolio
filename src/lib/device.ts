/**
 * One-time look at what the visitor's device can handle, used to pick
 * sensible defaults: full animation or the simple still version, and the
 * starting quality. The live scene also adapts to measured frame rate.
 */

type DeviceProfile = {
  webgl2: boolean;
  softwareGpu: boolean;
  renderer: string;
  reducedMotion: boolean;
  saveData: boolean;
  coarsePointer: boolean;
  cores: number;
  memory: number;
};

let cached: DeviceProfile | null = null;

function getDeviceProfile(): DeviceProfile {
  if (cached) return cached;
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  let webgl2 = false;
  let renderer = "";
  try {
    const probe = document.createElement("canvas");
    const gl = probe.getContext("webgl2");
    if (gl) {
      webgl2 = true;
      const info = gl.getExtension("WEBGL_debug_renderer_info");
      renderer = String(gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER) ?? "");
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    }
  } catch {
    webgl2 = false;
  }
  cached = {
    webgl2,
    renderer,
    softwareGpu: /swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer),
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    saveData: nav.connection?.saveData === true,
    coarsePointer: window.matchMedia("(pointer: coarse)").matches,
    cores: nav.hardwareConcurrency ?? 4,
    memory: nav.deviceMemory ?? 8,
  };
  return cached;
}

/** Full animation unless the device or the visitor's settings suggest otherwise. */
export function recommendedMotion(): "full" | "still" {
  if (typeof window === "undefined") return "full";
  const d = getDeviceProfile();
  return d.reducedMotion || d.saveData || !d.webgl2 || d.softwareGpu ? "still" : "full";
}

/** High on capable desktops and laptops; low on phones, tablets and weaker machines. */
export function recommendedQuality(): "high" | "low" {
  if (typeof window === "undefined") return "high";
  const d = getDeviceProfile();
  return d.webgl2 && !d.softwareGpu && !d.coarsePointer && d.cores >= 6 && d.memory >= 4 ? "high" : "low";
}
