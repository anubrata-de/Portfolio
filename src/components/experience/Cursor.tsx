"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { audio } from "@/lib/audio";
import { useExperience } from "@/context/Experience";

type Mode = "default" | "link" | "view" | "drag" | "text" | "hidden";

const INTERACTIVE = "a, button, [role='button'], [data-cursor], label, summary, select";
const TEXT = "input:not([type='radio']):not([type='checkbox']), textarea, [contenteditable='true']";

/**
 * A glowing orb that trails the pointer, grows over links, shows a label over
 * projects and carousels, and pulls buttons marked data-magnetic toward it.
 * Mouse and trackpad only; touch devices keep their normal behaviour.
 */
const FINE = "(hover: hover) and (pointer: fine)";

function subscribePointer(onChange: () => void) {
  const query = window.matchMedia(FINE);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
const hasFinePointer = () => window.matchMedia(FINE).matches;

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const { calm } = useExperience();
  const finePointer = useSyncExternalStore(subscribePointer, hasFinePointer, () => false);
  const enabled = finePointer && !calm;
  const [mode, setMode] = useState<Mode>("default");
  const [label, setLabel] = useState("");
  const [pressed, setPressed] = useState(false);
  const pathname = usePathname();
  const [lastPath, setLastPath] = useState(pathname);

  // A new page means whatever was hovered is gone.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMode("default");
    setLabel("");
  }

  useEffect(() => {
    document.documentElement.classList.toggle("has-cursor", enabled);
    if (!enabled) return;
    const dot = dotRef.current!;
    const orb = orbRef.current!;
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const orbPos = { ...pos };
    let target: HTMLElement | null = null;
    let magnet: HTMLElement | null = null;
    let frame = 0;
    let visible = false;
    const wake = () => {
      if (!frame) frame = requestAnimationFrame(loop);
    };

    const loop = () => {
      let tx = pos.x;
      let ty = pos.y;
      if (target && target.dataset.cursor === undefined && target.matches("a, button")) {
        // Lean towards the centre of whatever is under the pointer.
        const r = target.getBoundingClientRect();
        tx += (r.left + r.width / 2 - tx) * 0.25;
        ty += (r.top + r.height / 2 - ty) * 0.25;
      }
      const dx = tx - orbPos.x;
      const dy = ty - orbPos.y;
      orbPos.x += dx * 0.18;
      orbPos.y += dy * 0.18;
      dot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      orb.style.transform = `translate3d(${orbPos.x}px, ${orbPos.y}px, 0)`;
      // Sleep once the orb has caught up; the next pointer move wakes it.
      frame = Math.abs(dx) + Math.abs(dy) > 0.2 ? requestAnimationFrame(loop) : 0;
    };

    const releaseMagnet = () => {
      if (magnet) magnet.style.transform = "";
      magnet = null;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (!visible) {
        visible = true;
        orbPos.x = pos.x;
        orbPos.y = pos.y;
        setMode((m) => (m === "hidden" ? "default" : m));
      }
      if (magnet) {
        const r = magnet.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        magnet.style.transform = `translate(${dx * 0.18}px, ${dy * 0.25}px)`;
      }
      wake();
    };

    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null;
      if (!el) return;
      if (el.closest(TEXT)) {
        target = null;
        releaseMagnet();
        setMode("text");
        return;
      }
      const hit = el.closest<HTMLElement>(INTERACTIVE);
      if (hit !== target) {
        target = hit;
        if (hit) audio.hover();
      }
      const nextMagnet = hit?.closest<HTMLElement>("[data-magnetic]") ?? null;
      if (nextMagnet !== magnet) {
        releaseMagnet();
        magnet = nextMagnet;
      }
      if (!hit) {
        setMode("default");
        setLabel("");
        return;
      }
      const kind = hit.dataset.cursor;
      if (kind === "view" || kind === "drag" || kind === "open") {
        setMode(kind === "drag" ? "drag" : "view");
        setLabel(hit.dataset.cursorLabel ?? (kind === "drag" ? "Drag" : kind === "open" ? "Open" : "View"));
      } else {
        setMode("link");
        setLabel("");
      }
    };

    const onDown = () => {
      setPressed(true);
      if (target) audio.click();
    };
    const onUp = () => setPressed(false);
    const onLeave = () => {
      visible = false;
      setMode("hidden");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      releaseMagnet();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="cursor" data-mode={mode} data-pressed={pressed || undefined} aria-hidden="true">
      <div ref={orbRef} className="cursor__orb">
        <span className="cursor__glow" />
        <span className="cursor__label">{label}</span>
      </div>
      <div ref={dotRef} className="cursor__dot" />
    </div>
  );
}
