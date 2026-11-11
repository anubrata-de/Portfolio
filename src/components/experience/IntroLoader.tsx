"use client";

import { useEffect, useRef, useState } from "react";
import { useExperience } from "@/context/Experience";
import { cn } from "@/lib/cn";

const MIN_MS = 1400;
const SCENE_TIMEOUT_MS = 5000;

/**
 * First-visit intro. Progress tracks real work (fonts, the WebGL scene
 * compiling, the page loading), then asks whether to enter with sound,
 * because browsers only allow audio after a choice like this.
 */
export function IntroLoader() {
  const { introDone, finishIntro, calm, recommended } = useExperience();
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const target = useRef(0);
  const enterRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (introDone) return;
    const start = performance.now();
    const done = { fonts: false, scene: false, load: false };
    const update = () => {
      const count = Object.values(done).filter(Boolean).length;
      target.current = (count / 3) * 100;
    };
    document.fonts?.ready.then(() => {
      done.fonts = true;
      update();
    });
    const onScene = () => {
      done.scene = true;
      update();
    };
    const onLoad = () => {
      done.load = true;
      update();
    };
    window.addEventListener("scene:ready", onScene);
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad);
    const sceneFallback = window.setTimeout(onScene, SCENE_TIMEOUT_MS);

    let frame = 0;
    let shown = 0;
    let last = start;
    const tick = (now: number) => {
      // Never run ahead of real progress, and never finish before the minimum time.
      // Time-based easing, so a slow device doesn't make the counter crawl.
      const timeCap = Math.min(100, ((now - start) / MIN_MS) * 100);
      const goal = Math.min(target.current, timeCap);
      shown += (goal - shown) * (1 - Math.exp(-(now - last) / 90));
      last = now;
      if (goal - shown < 0.6) shown = goal;
      setProgress(Math.floor(shown));
      if (shown >= 100) {
        setReady(true);
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(sceneFallback);
      window.removeEventListener("scene:ready", onScene);
      window.removeEventListener("load", onLoad);
    };
  }, [introDone]);

  useEffect(() => {
    if (ready) enterRef.current?.focus({ preventScroll: true });
  }, [ready]);

  useEffect(() => {
    if (!leaving) return;
    const id = window.setTimeout(() => setLeaving(false), calm ? 0 : 1100);
    return () => window.clearTimeout(id);
  }, [leaving, calm]);

  if (introDone && !leaving) return null;

  function enter(sound: boolean, motion?: "full" | "still") {
    setLeaving(true);
    finishIntro({ sound, motion });
  }

  const suggestSimple = recommended.motion === "still";

  return (
    <div
      className={cn("intro", ready && "intro--ready", leaving && "intro--leaving")}
      role="dialog"
      aria-modal="true"
      aria-label="Welcome"
    >
      <div className="intro__blobs" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="intro__content">
        <p className="intro__brand">
          anubrata<span>.de</span>
        </p>
        <p className="intro__tagline">Data science, LLM agents and the systems around them</p>

        {!ready ? (
          <div className="intro__progress" role="status" aria-live="polite">
            <p className="intro__label">Experience loading, please wait</p>
            <p className="intro__count">
              <span className="intro__number">{String(progress).padStart(3, "0")}%</span>
              <span className="intro__of">out of 100%</span>
            </p>
            <div className="intro__bar" aria-hidden="true">
              <span style={{ transform: `scaleX(${progress / 100})` }} />
            </div>
          </div>
        ) : (
          <div className="intro__choice">
            <p className="intro__label">
              {suggestSimple
                ? "This device may find the animation heavy. The simple version is recommended."
                : "Best with sound on. You can change it any time."}
            </p>
            <div className="intro__buttons">
              <button
                ref={suggestSimple ? undefined : enterRef}
                type="button"
                className={suggestSimple ? "pill" : "pill pill--solid"}
                onClick={() => enter(true, "full")}
              >
                <SoundIcon on /> Enter with sound
              </button>
              <button type="button" className="pill" onClick={() => enter(false, "full")}>
                <SoundIcon on={false} /> Enter without sound
              </button>
            </div>
            <button
              ref={suggestSimple ? enterRef : undefined}
              type="button"
              className={suggestSimple ? "pill pill--solid intro__simple" : "intro__simple intro__simple--link"}
              onClick={() => enter(false, "still")}
            >
              Use the simple version, without animation
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function SoundIcon({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
      <path d="M3 8h3l4-3.5v11L6 12H3z" fill="currentColor" />
      {on ? (
        <path d="M13 7.5a3.5 3.5 0 0 1 0 5M15 5a7 7 0 0 1 0 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      ) : (
        <path d="M13.5 8l4 4m0-4l-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      )}
    </svg>
  );
}
