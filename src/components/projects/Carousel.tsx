"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import { areaOrder, areas, projects, type AreaKey } from "@/data/projects";
import { ProjectCover } from "./ProjectCover";
import { useExperience } from "@/context/Experience";
import { audio } from "@/lib/audio";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";

/**
 * Projects on a curved wall that wraps around you. Drag, use the arrow keys,
 * or the buttons to turn it; the card in front opens its case study.
 */
export function Carousel() {
  const router = useRouter();
  const { calm } = useExperience();
  const [filter, setFilter] = useState<AreaKey | "all">("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const shown = filter === "all" ? projects : projects.filter((p) => p.area === filter);
  const [index, setIndex] = useState(0);
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ startX: 0, lastX: 0, lastT: 0, velocity: 0, moved: false });

  const count = shown.length;
  const step = 24; // degrees between cards
  const safeIndex = Math.min(index, count - 1);
  // Card i sits at -i·step around the wall; turning the wall by index·step brings it to the front.
  const angle = safeIndex * step - drag;

  function go(next: number) {
    const clamped = Math.max(0, Math.min(count - 1, next));
    if (clamped !== safeIndex) audio.hover();
    setIndex(clamped);
  }

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let wheelAccum = 0;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return; // leave vertical scrolling alone
      e.preventDefault();
      wheelAccum += e.deltaX;
      if (Math.abs(wheelAccum) > 60) {
        setIndex((i) => Math.max(0, Math.min(count - 1, i + Math.sign(wheelAccum))));
        wheelAccum = 0;
      }
    };
    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, [count]);

  function onPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    const s = dragState.current;
    s.startX = e.clientX;
    s.lastX = e.clientX;
    s.lastT = performance.now();
    s.velocity = 0;
    s.moved = false;
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    const s = dragState.current;
    const now = performance.now();
    s.velocity = (e.clientX - s.lastX) / Math.max(1, now - s.lastT);
    s.lastX = e.clientX;
    s.lastT = now;
    const dx = e.clientX - s.startX;
    if (Math.abs(dx) > 6) s.moved = true;
    setDrag(dx * 0.09);
  }

  function onPointerUp() {
    if (!dragging) return;
    const s = dragState.current;
    setDragging(false);
    // Carry the flick a little further, then snap to a card.
    const projected = drag + s.velocity * (calm ? 0 : 160) * 0.09;
    setDrag(0);
    go(safeIndex - Math.round(projected / step));
  }

  return (
    <div className="carousel">
      <div className="carousel__bar">
        <div className="carousel__filter">
          <button
            type="button"
            className="pill"
            aria-expanded={filterOpen}
            onClick={() => setFilterOpen(!filterOpen)}
          >
            Filter: {filter === "all" ? "All" : areas[filter].label}
          </button>
          {filterOpen && (
            <div className="carousel__filter-menu glass" role="radiogroup" aria-label="Filter projects">
              {(["all", ...areaOrder.filter((a) => projects.some((p) => p.area === a))] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  role="radio"
                  aria-checked={filter === key}
                  data-area={key === "all" ? undefined : key}
                  onClick={() => {
                    setFilter(key);
                    setIndex(0);
                    setFilterOpen(false);
                    audio.click();
                  }}
                >
                  {key !== "all" && <span className="swatch" aria-hidden="true" />}
                  {key === "all" ? "All" : areas[key].label}
                  <span className="carousel__filter-count">
                    {key === "all" ? projects.length : projects.filter((p) => p.area === key).length}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="carousel__nav">
          <button type="button" className="pill" onClick={() => go(safeIndex - 1)} disabled={safeIndex === 0} aria-label="Previous project">
            <Icon name="left" />
          </button>
          <button type="button" className="pill" onClick={() => go(safeIndex + 1)} disabled={safeIndex === count - 1} aria-label="Next project">
            <Icon name="right" />
          </button>
        </div>
      </div>

      <div
        ref={stageRef}
        className={cn("carousel__stage", dragging && "is-dragging")}
        data-cursor="drag"
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label="Projects. Use the left and right arrow keys to browse."
        onKeyDown={(e: ReactKeyboardEvent<HTMLDivElement>) => {
          if (e.key === "ArrowRight") go(safeIndex + 1);
          if (e.key === "ArrowLeft") go(safeIndex - 1);
          if (e.key === "Enter") router.push(`/projects/${shown[safeIndex].slug}`);
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div className="carousel__ring" style={{ "--angle": `${angle}deg` } as CSSProperties}>
          {shown.map((p, i) => {
            const offset = angle - i * step;
            const distance = Math.abs(offset) / step;
            return (
              <article
                key={p.slug}
                className={cn("carousel__card", i === safeIndex && "is-active")}
                data-area={p.area}
                style={
                  {
                    "--rot": `${-i * step}deg`,
                    "--dim": Math.min(1, distance * 0.28).toFixed(3),
                    zIndex: 100 - Math.round(distance * 10),
                    opacity: distance > 3.4 ? 0 : 1,
                    pointerEvents: distance > 3.4 ? "none" : undefined,
                  } as CSSProperties
                }
                aria-hidden={i !== safeIndex}
                onClick={() => {
                  if (dragState.current.moved) return;
                  if (i === safeIndex) router.push(`/projects/${p.slug}`);
                  else go(i);
                }}
              >
                <div className="carousel__frame">
                  <ProjectCover project={p} />
                </div>
                <div className="carousel__meta">
                  <span className="carousel__num">{String(i + 1).padStart(2, "0")}</span>
                  <h2 className="carousel__name">{p.name}</h2>
                  <span className="carousel__kind">
                    <span className="swatch" aria-hidden="true" />
                    {areas[p.area].label}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="carousel__foot">
        <span className="carousel__count">{String(safeIndex + 1).padStart(2, "0")}</span>
        <span className="carousel__ticks" aria-hidden="true">
          {shown.map((p, i) => (
            <span key={p.slug} className={cn(i === safeIndex && "is-active")} />
          ))}
        </span>
        <span className="carousel__count">{String(count).padStart(2, "0")}</span>
      </div>

      <div className="carousel__detail glass" aria-live="polite">
        <p className="carousel__detail-summary">{shown[safeIndex].summary}</p>
        <Link href={`/projects/${shown[safeIndex].slug}`} className="pill pill--solid" data-magnetic>
          Open {shown[safeIndex].name} <Icon name="return" />
        </Link>
      </div>
    </div>
  );
}
