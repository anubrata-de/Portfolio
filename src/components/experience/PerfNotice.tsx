"use client";

import { useEffect, useState } from "react";
import { useExperience } from "@/context/Experience";

/**
 * If the scene can't hold a smooth frame rate even at its lowest settings,
 * offer the simple version instead of letting the page stutter.
 */
export function PerfNotice() {
  const { setMotion, calm } = useExperience();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onSlow = () => setShow(true);
    window.addEventListener("scene:slow", onSlow);
    return () => window.removeEventListener("scene:slow", onSlow);
  }, []);

  if (!show || calm) return null;

  return (
    <div className="perf-notice glass" role="status">
      <p>The animation is running slowly on this device. The simple version keeps everything, without the motion.</p>
      <div className="perf-notice__actions">
        <button
          type="button"
          className="pill pill--solid"
          onClick={() => {
            setMotion("still");
            setShow(false);
          }}
        >
          Switch to simple version
        </button>
        <button type="button" className="pill" onClick={() => setShow(false)}>
          Keep animations
        </button>
      </div>
    </div>
  );
}
