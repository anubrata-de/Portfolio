"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useExperience } from "@/context/Experience";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

const MIN_MS = 1600;
const SCENE_TIMEOUT_MS = 5000;

/**
 * First-visit intro. The progress line along the bottom tracks real work
 * (fonts, the WebGL scene compiling, the page loading), then the visitor
 * chooses to enter with or without sound, because browsers only allow audio
 * after a choice like this.
 */
export function IntroLoader() {
  const { introDone, finishIntro, calm, recommended } = useExperience();
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const target = useRef(0);
  const enterRef = useRef<HTMLButtonElement>(null);
  const blobsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (introDone) return;
    const start = performance.now();
    const done = { fonts: false, scene: false, load: false };
    const update = () => {
      target.current = (Object.values(done).filter(Boolean).length / 3) * 100;
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
      // Never ahead of real progress, never done before the minimum time,
      // and eased by the clock so slow devices don't make it crawl.
      const goal = Math.min(target.current, Math.min(100, ((now - start) / MIN_MS) * 100));
      shown += (goal - shown) * (1 - Math.exp(-(now - last) / 90));
      last = now;
      if (goal - shown < 0.6) shown = goal;
      setProgress(Math.floor(shown));
      if (shown >= 100) {
        window.setTimeout(() => setReady(true), 250);
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

  // The soft blobs drift towards the pointer once the choice appears.
  useEffect(() => {
    const el = blobsRef.current;
    if (!ready || calm || !el) return;
    const onMove = (e: PointerEvent) => {
      el.style.setProperty("--mx", String(e.clientX / window.innerWidth - 0.5));
      el.style.setProperty("--my", String(e.clientY / window.innerHeight - 0.5));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [ready, calm]);

  useEffect(() => {
    if (!leaving) return;
    const id = window.setTimeout(() => setLeaving(false), calm ? 0 : 1100);
    return () => window.clearTimeout(id);
  }, [leaving, calm]);

  if (introDone && !leaving) return null;

  function enter(sound: boolean, motion: "full" | "still") {
    setLeaving(true);
    finishIntro({ sound, motion });
  }

  const suggestSimple = recommended.motion === "still";
  const pct = String(progress).padStart(3, "0");

  return (
    <div
      className={cn("intro", ready && "intro--ready", leaving && "intro--leaving")}
      role="dialog"
      aria-modal="true"
      aria-label="Welcome"
    >
      <div className="intro__blobs" ref={blobsRef} aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="intro__center">
        <p className="intro__brand">
          anubrata<span>.de</span>
        </p>
        <p className="intro__tagline">
          Data science, LLM agents
          <br />
          and the systems around them
        </p>
      </div>

      {!ready ? (
        <div className="intro__progress" role="status" aria-live="polite" aria-label={`Loading, ${progress}%`}>
          <div className="intro__words" aria-hidden="true">
            <span>Experience</span>
            <span>is loading</span>
            <span>please</span>
            <span>wait</span>
            <span className="intro__pct">{pct}%</span>
            <span>out of</span>
            <span>100%</span>
          </div>
          <div className="intro__line">
            <span style={{ "--p": progress / 100 } as CSSProperties} />
          </div>
        </div>
      ) : (
        <div className="intro__choice">
          {suggestSimple && <p className="intro__note">This device may find the animation heavy, so the simple version is recommended.</p>}
          <button
            ref={suggestSimple ? undefined : enterRef}
            type="button"
            className="intro__enter"
            onClick={() => enter(true, "full")}
          >
            <Icon name="sound" />
            Enter with sound
          </button>
          <button type="button" className="intro__quiet" onClick={() => enter(false, "full")}>
            <Icon name="muted" />
            Enter without sound
          </button>
          <button
            ref={suggestSimple ? enterRef : undefined}
            type="button"
            className={cn("intro__simple", suggestSimple && "is-recommended")}
            onClick={() => enter(false, "still")}
          >
            Simple version, no animation
          </button>
        </div>
      )}
    </div>
  );
}
