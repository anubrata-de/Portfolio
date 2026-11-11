"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useExperience } from "@/context/Experience";
import { audio } from "@/lib/audio";
import { cn } from "@/lib/cn";

export function SettingsMenu({ inline = false }: { inline?: boolean }) {
  const { sound, setSound, theme, setTheme, quality, setQuality, motion, setMotion, recommended } = useExperience();
  const [open, setOpen] = useState(inline);
  const [qualityOpen, setQualityOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open || inline) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open, inline]);

  const panel = (
    <div id={panelId} className={cn("settings__panel", inline && "settings__panel--inline")} role="group" aria-label="Settings">
      {!inline && <p className="settings__heading">Settings</p>}
      <button
        type="button"
        role="switch"
        aria-checked={sound}
        className="settings__row"
        onClick={() => {
          const next = !sound;
          setSound(next);
          audio.toggle(next);
        }}
      >
        <span className="settings__icon" aria-hidden="true">
          <svg viewBox="0 0 20 20" width="16" height="16">
            <path d="M3 8h3l4-3.5v11L6 12H3z" fill="currentColor" />
            <path d="M13 7.5a3.5 3.5 0 0 1 0 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
        Sound
        <span className="switch" aria-hidden="true" />
      </button>
      <button
        type="button"
        role="switch"
        aria-checked={theme === "dark"}
        className="settings__row"
        onClick={() => {
          setTheme(theme === "dark" ? "light" : "dark");
          audio.click();
        }}
      >
        <span className="settings__icon" aria-hidden="true">
          <svg viewBox="0 0 20 20" width="16" height="16">
            <path d="M15.5 12.5A6.5 6.5 0 0 1 7.5 4.5a6.5 6.5 0 1 0 8 8z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        </span>
        Dark mode
        <span className="switch" aria-hidden="true" />
      </button>
      <button
        type="button"
        role="switch"
        aria-checked={motion === "full"}
        className="settings__row"
        onClick={() => {
          setMotion(motion === "full" ? "still" : "full");
          audio.click();
        }}
      >
        <span className="settings__icon" aria-hidden="true">
          <svg viewBox="0 0 20 20" width="16" height="16">
            <path d="M3 13c2.5-6 4.5-6 7 0s4.5 6 7 0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
        Animations
        <span className="switch" aria-hidden="true" />
      </button>
      {motion === "full" && (
      <div className="settings__quality">
        <button
          type="button"
          className="settings__row"
          aria-expanded={qualityOpen}
          onClick={() => {
            setQualityOpen(!qualityOpen);
            audio.click();
          }}
        >
          <span className="settings__icon" aria-hidden="true">
            <svg viewBox="0 0 20 20" width="16" height="16">
              <path d="M3.5 14a6.5 6.5 0 1 1 13 0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M10 14l3-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
          Quality
          <span className="settings__value">{quality === "high" ? "High" : "Low"}</span>
          <span className={cn("settings__chevron", qualityOpen && "is-open")} aria-hidden="true">
            ›
          </span>
        </button>
        {qualityOpen && (
          <div className="settings__options" role="radiogroup" aria-label="Visual quality">
            {(["high", "low"] as const).map((q) => (
              <button
                key={q}
                type="button"
                role="radio"
                aria-checked={quality === q}
                className="settings__option"
                onClick={() => {
                  setQuality(q);
                  audio.click();
                }}
              >
                {q === "high" ? "High" : "Low"}
                {recommended.quality === q && <span className="settings__badge">Recommended</span>}
              </button>
            ))}
          </div>
        )}
      </div>
      )}
    </div>
  );

  if (inline) return <div className="settings settings--inline">{panel}</div>;

  return (
    <div className="settings" ref={ref}>
      <button
        type="button"
        className="settings__trigger"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          setOpen(!open);
          audio.click();
        }}
      >
        <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true">
          <path
            d="M10 6.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4zm7 4.2-.1-2 1.6-1.3-1.6-2.8-2 .6a6.5 6.5 0 0 0-1.7-1L12.8 2H9.6l-.4 2.5a6.5 6.5 0 0 0-1.7 1l-2-.6-1.6 2.8L5.5 9l-.1 2-1.6 1.3 1.6 2.8 2-.6c.5.4 1.1.8 1.7 1l.4 2.5h3.2l.4-2.5c.6-.2 1.2-.6 1.7-1l2 .6 1.6-2.8z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
        Settings
      </button>
      {open && panel}
    </div>
  );
}
