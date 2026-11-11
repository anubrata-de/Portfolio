"use client";

import { useEffect, useState } from "react";
import { Scribble } from "@/components/doodles/Doodles";

/** Rotates through words on a timer. Stays on the first word when motion is reduced. */
export function CyclingWord({ words }: { words: readonly string[] }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % words.length), 2400);
    return () => window.clearInterval(id);
  }, [words.length]);

  return (
    <span className="cycle" aria-hidden="true">
      <span key={i} className="cycle__word">
        {words[i]}
      </span>
      <Scribble className="cycle__line" />
    </span>
  );
}
