"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { beliefs } from "@/data/home";

/** The three sticky notes. They settle onto the page once, when scrolled into view. */
export function Notes() {
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-in");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <ul ref={ref} className="notes">
      {beliefs.map((b, i) => (
        <li key={b.title} className={`note note--${b.colour}`} style={{ "--i": i } as CSSProperties}>
          <span className="tape" aria-hidden="true" />
          <h3 className="note__title">{b.title}</h3>
          <p className="note__body">{b.body}</p>
        </li>
      ))}
    </ul>
  );
}
