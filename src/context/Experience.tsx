"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { audio } from "@/lib/audio";
import { recommendedMotion, recommendedQuality } from "@/lib/device";
import { getPrefs, getServerPrefs, setPrefs, subscribePrefs, type Motion, type Prefs, type Quality, type Theme } from "@/lib/prefs";

type Experience = Prefs & {
  /** True in the simple version or when the system asks for reduced motion. */
  calm: boolean;
  recommended: { quality: Quality; motion: Motion };
  introDone: boolean;
  finishIntro: (options: { sound: boolean; motion?: Motion }) => void;
  setTheme: (theme: Theme) => void;
  setSound: (on: boolean) => void;
  setQuality: (quality: Quality) => void;
  setMotion: (motion: Motion) => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  assistantOpen: boolean;
  setAssistantOpen: (open: boolean) => void;
};

const ExperienceContext = createContext<Experience | null>(null);

const REDUCED = "(prefers-reduced-motion: reduce)";
function subscribeMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
const getReduced = () => window.matchMedia(REDUCED).matches;

function subscribeIntro(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-intro"] });
  return () => observer.disconnect();
}
const getIntro = () => document.documentElement.dataset.intro === "seen";

const serverRecommended = { quality: "high" as Quality, motion: "full" as Motion };
let clientRecommended: typeof serverRecommended | null = null;
const getRecommended = () => (clientRecommended ??= { quality: recommendedQuality(), motion: recommendedMotion() });
const noSubscribe = () => () => {};

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const prefs = useSyncExternalStore(subscribePrefs, getPrefs, getServerPrefs);
  const reducedMotion = useSyncExternalStore(subscribeMotion, getReduced, () => false);
  const introDone = useSyncExternalStore(subscribeIntro, getIntro, () => false);
  const recommended = useSyncExternalStore(noSubscribe, getRecommended, () => serverRecommended);
  const [menuOpen, setMenuOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const calm = reducedMotion || prefs.motion === "still";

  // Returning visitors who left sound on: browsers only allow audio after a gesture,
  // so start it on the first click or key press.
  useEffect(() => {
    if (!introDone || !getPrefs().sound || audio.isEnabled) return;
    const start = () => {
      if (getPrefs().sound) audio.setEnabled(true);
    };
    window.addEventListener("pointerdown", start, { once: true });
    window.addEventListener("keydown", start, { once: true });
    return () => {
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
    };
  }, [introDone]);

  useEffect(() => {
    document.documentElement.classList.toggle("is-locked", menuOpen || assistantOpen);
  }, [menuOpen, assistantOpen]);

  const finishIntro = useCallback(({ sound, motion }: { sound: boolean; motion?: Motion }) => {
    setPrefs(motion ? { sound, motion } : { sound });
    audio.setEnabled(sound);
    try {
      sessionStorage.setItem("intro-seen", "1");
    } catch {
      /* private mode: the intro will simply show again next time */
    }
    document.documentElement.dataset.intro = "seen";
  }, []);

  const setTheme = useCallback((theme: Theme) => setPrefs({ theme }), []);
  const setSound = useCallback((on: boolean) => {
    setPrefs({ sound: on });
    audio.setEnabled(on);
  }, []);
  const setQuality = useCallback((quality: Quality) => setPrefs({ quality }), []);
  const setMotion = useCallback((motion: Motion) => setPrefs({ motion }), []);

  const value = useMemo<Experience>(
    () => ({
      ...prefs,
      calm,
      recommended,
      introDone,
      finishIntro,
      setTheme,
      setSound,
      setQuality,
      setMotion,
      menuOpen,
      setMenuOpen,
      assistantOpen,
      setAssistantOpen,
    }),
    [prefs, calm, recommended, introDone, finishIntro, setTheme, setSound, setQuality, setMotion, menuOpen, assistantOpen],
  );

  return <ExperienceContext.Provider value={value}>{children}</ExperienceContext.Provider>;
}

export function useExperience() {
  const value = useContext(ExperienceContext);
  if (!value) throw new Error("useExperience must be used inside ExperienceProvider");
  return value;
}
