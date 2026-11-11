/**
 * Visitor preferences, kept outside React so the WebGL scene, the audio
 * engine and components all read the same values.
 */

import { recommendedMotion, recommendedQuality } from "./device";

export type Theme = "light" | "dark";
export type Quality = "high" | "low";
export type Motion = "full" | "still";

export type Prefs = {
  theme: Theme;
  sound: boolean;
  quality: Quality;
  motion: Motion;
};

const serverPrefs: Prefs = { theme: "dark", sound: false, quality: "high", motion: "full" };

function read(): Prefs {
  try {
    const theme: Theme = document.documentElement.dataset.theme === "light" ? "light" : "dark";
    const sound = localStorage.getItem("sound") === "on";
    const q = localStorage.getItem("quality");
    const m = localStorage.getItem("motion");
    return {
      theme,
      sound,
      quality: q === "high" || q === "low" ? q : recommendedQuality(),
      motion: m === "full" || m === "still" ? m : recommendedMotion(),
    };
  } catch {
    return serverPrefs;
  }
}

// Read lazily, so the pre-paint script has always run first.
let current: Prefs | null = null;
const listeners = new Set<() => void>();

function reflect(prefs: Prefs) {
  const root = document.documentElement;
  root.dataset.theme = prefs.theme;
  root.dataset.motion = prefs.motion;
  root.dataset.quality = prefs.quality;
}

export function subscribePrefs(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export const getServerPrefs = () => serverPrefs;

export const getPrefs = (): Prefs => {
  if (typeof window === "undefined") return serverPrefs;
  if (!current) {
    current = read();
    reflect(current);
  }
  return current;
};

export function setPrefs(patch: Partial<Prefs>) {
  current = { ...getPrefs(), ...patch };
  reflect(current);
  try {
    if (patch.theme) {
      localStorage.setItem("theme", patch.theme);
      document.cookie = `theme=${patch.theme};path=/;max-age=31536000;samesite=lax`;
    }
    if (patch.sound !== undefined) localStorage.setItem("sound", patch.sound ? "on" : "off");
    if (patch.quality) localStorage.setItem("quality", patch.quality);
    if (patch.motion) localStorage.setItem("motion", patch.motion);
  } catch {
    /* storage can be blocked; preferences still apply for this visit */
  }
  listeners.forEach((l) => l());
}
