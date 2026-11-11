"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { areas, projects } from "@/data/projects";
import { ProjectCover } from "@/components/projects/ProjectCover";
import { RevealLines, delay } from "@/components/ui/RevealLines";
import { useExperience } from "@/context/Experience";

/**
 * Project index. On a mouse, hovering a row floats that project's cover
 * beside the pointer, tilting with its movement.
 */
export function SelectedProjects() {
  const [active, setActive] = useState<number | null>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const { calm } = useExperience();

  useEffect(() => {
    const el = floatRef.current;
    if (!el || calm || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const pos = { x: 0, y: 0, tx: 0, ty: 0 };
    let frame = 0;
    const loop = () => {
      const dx = pos.tx - pos.x;
      const dy = pos.ty - pos.y;
      pos.x += dx * 0.14;
      pos.y += dy * 0.14;
      const tilt = Math.max(-12, Math.min(12, dx * 0.08));
      el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${tilt}deg)`;
      // Stop once it has caught up; the next pointer move restarts it.
      frame = Math.abs(dx) + Math.abs(dy) > 0.3 ? requestAnimationFrame(loop) : 0;
    };
    const onMove = (e: PointerEvent) => {
      const first = pos.x === 0 && pos.y === 0;
      pos.tx = e.clientX + 28;
      pos.ty = e.clientY - 110;
      if (first) {
        pos.x = pos.tx;
        pos.y = pos.ty;
      }
      if (!frame) frame = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, [calm]);

  return (
    <section className="selected" data-scene="globe" data-scene-side="right" aria-labelledby="selected-title">
      <div className="wrap">
        <div className="section-intro">
          <RevealLines
            id="selected-title"
            lines={[
              <>
                Selected <span className="arrows" aria-hidden="true">⟶⟶</span> projects
              </>,
            ]}
          />
          <p data-reveal style={delay(0.15)}>
            Seven projects with code on GitHub: agents, retrieval apps and the full-stack systems that hold them.
          </p>
        </div>

        <ol className="plist glass" onPointerLeave={() => setActive(null)}>
          {projects.map((p, i) => (
            <li key={p.slug} data-reveal style={delay(0.04 * i)}>
              <Link
                href={`/projects/${p.slug}`}
                className="plist__row"
                data-area={p.area}
                data-cursor="view"
                onPointerEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
              >
                <span className="plist__index">{String(i + 1).padStart(2, "0")}</span>
                <span className="plist__name">{p.name}</span>
                <span className="plist__summary">{p.summary}</span>
                <span className="plist__kind">
                  <span className="swatch" aria-hidden="true" />
                  {areas[p.area].label}
                </span>
              </Link>
            </li>
          ))}
        </ol>

        <p className="selected__more" data-reveal>
          <Link href="/projects" className="pill" data-magnetic>
            View all work <span aria-hidden="true">↳</span>
          </Link>
        </p>
      </div>

      <div ref={floatRef} className={`plist__float${active !== null ? " is-visible" : ""}`} aria-hidden="true">
        {projects.map((p, i) => (
          <div key={p.slug} className={`plist__float-card${active === i ? " is-active" : ""}`}>
            <ProjectCover project={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
