"use client";

import { useState } from "react";
import Link from "next/link";
import { ChecklistScene } from "@/components/doodles/Scenes";

/** Each ticked item draws another part of the scene beside it. */
export function Checklist({ items }: { items: readonly string[] }) {
  const [done, setDone] = useState<boolean[]>(() => items.map(() => false));
  const count = done.filter(Boolean).length;

  return (
    <div className="checklist">
      <div>
        <ul className="checklist__items">
          {items.map((item, i) => (
            <li key={item}>
              <label className="check">
                <input
                  type="checkbox"
                  checked={done[i]}
                  onChange={() => setDone((d) => d.map((v, j) => (j === i ? !v : v)))}
                />
                <span className="check__box" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M5 13 L 10 18 L 20 6" />
                  </svg>
                </span>
                <span className="check__text">{item}</span>
              </label>
            </li>
          ))}
        </ul>
        <div className="checklist__cta">
          <Link href="/contact" className="button">
            Let&apos;s talk
          </Link>
          <p className="hand checklist__hint">{count === 3 ? "sugoi! we should talk" : "go on, tick them"}</p>
        </div>
      </div>
      <ChecklistScene count={count} />
    </div>
  );
}
