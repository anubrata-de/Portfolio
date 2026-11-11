"use client";

import { useEffect, useRef } from "react";
import { useExperience } from "@/context/Experience";
import { audio } from "@/lib/audio";

/** Equaliser bars that move with the actual sound. Click to toggle sound. */
export function SoundButton() {
  const { sound, setSound, calm } = useExperience();
  const barsRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const bars = barsRef.current?.children;
    if (!bars) return;
    let frame = 0;
    const draw = (now: number) => {
      const levels = audio.getLevels();
      for (let i = 0; i < bars.length; i++) {
        // Keep a gentle idle sway when the sound is quiet, so the icon reads as "playing".
        const idle = sound && !calm ? 0.25 + 0.15 * Math.sin(now / 260 + i * 1.3) : 0.12;
        const level = sound ? Math.max(idle, Math.min(1, levels[i] * 2.4)) : 0.12;
        (bars[i] as HTMLElement).style.transform = `scaleY(${level.toFixed(3)})`;
      }
      if (sound && !calm) frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [sound, calm]);

  return (
    <button
      type="button"
      className="sound-button"
      aria-pressed={sound}
      aria-label={sound ? "Turn sound off" : "Turn sound on"}
      title={sound ? "Sound on" : "Sound off"}
      onClick={() => {
        const next = !sound;
        setSound(next);
        audio.toggle(next);
      }}
    >
      <span className="sound-button__bars" ref={barsRef} aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </span>
    </button>
  );
}
