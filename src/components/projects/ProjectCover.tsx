import type { ReactNode } from "react";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/cn";

/**
 * Cover art for each project: a small illustration of what it does,
 * drawn in SVG so it stays sharp and themable. Not a screenshot.
 */
export function ProjectCover({ project, className }: { project: Project; className?: string }) {
  const id = `cover-${project.slug}`;
  return (
    <svg
      className={cn("cover", className)}
      data-area={project.area}
      viewBox="0 0 320 200"
      role="img"
      aria-label={`Illustration for ${project.name}`}
    >
      <defs>
        <radialGradient id={`${id}-bg`} cx="30%" cy="20%" r="95%">
          <stop offset="0%" className="cover__bg-a" />
          <stop offset="100%" className="cover__bg-b" />
        </radialGradient>
        <filter id={`${id}-glow`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect width="320" height="200" fill={`url(#${id}-bg)`} />
      <g className="cover__grid">
        {Array.from({ length: 9 }, (_, i) => (
          <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="200" />
        ))}
        {Array.from({ length: 6 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 40} x2="320" y2={i * 40} />
        ))}
      </g>
      <g filter={`url(#${id}-glow)`}>{art[project.slug] ?? art.default}</g>
    </svg>
  );
}

const bars = [38, 62, 48, 84, 70, 102];

const art: Record<string, ReactNode> = {
  "data-analyst-agent": (
    <g className="cover__ink">
      <rect x="28" y="40" width="96" height="52" rx="10" className="cover__panel" />
      <text x="42" y="64" className="cover__text">How many</text>
      <text x="42" y="80" className="cover__text">rows grew?</text>
      <path d="M130 66 h28" className="cover__line cover__dash" />
      <path d="M152 60 l8 6 -8 6" className="cover__line" />
      <rect x="168" y="36" width="124" height="128" rx="12" className="cover__panel" />
      {bars.map((h, i) => (
        <rect key={i} x={182 + i * 17} y={150 - h} width="10" height={h} rx="2" className={i === 3 ? "cover__accent" : "cover__fill"} />
      ))}
      <path d="M182 92 L199 80 L216 86 L233 58 L250 66 L267 44 L284 50" className="cover__line" />
      <g className="cover__fill">
        <rect x="28" y="108" width="96" height="8" rx="2" />
        <rect x="28" y="122" width="72" height="8" rx="2" />
        <rect x="28" y="136" width="84" height="8" rx="2" />
      </g>
    </g>
  ),
  "tds-virtual-ta": (
    <g className="cover__ink">
      <rect x="28" y="30" width="150" height="40" rx="14" className="cover__panel" />
      <text x="44" y="55" className="cover__text">Why does my POST fail?</text>
      <rect x="120" y="84" width="172" height="62" rx="14" className="cover__panel cover__panel--strong" />
      <rect x="136" y="100" width="120" height="7" rx="2" className="cover__fill" />
      <rect x="136" y="114" width="140" height="7" rx="2" className="cover__fill" />
      <rect x="136" y="128" width="90" height="7" rx="2" className="cover__fill" />
      <g>
        <rect x="120" y="156" width="74" height="22" rx="11" className="cover__chip" />
        <text x="132" y="171" className="cover__text cover__text--small">forum #42</text>
        <rect x="202" y="156" width="64" height="22" rx="11" className="cover__chip" />
        <text x="214" y="171" className="cover__text cover__text--small">notes §3</text>
      </g>
      <circle cx="58" cy="128" r="22" className="cover__line" />
      <circle cx="58" cy="128" r="10" className="cover__accent" />
      <path d="M80 128 h34" className="cover__line cover__dash" />
    </g>
  ),
  prompt2ppt: (
    <g className="cover__ink">
      <rect x="40" y="30" width="80" height="140" rx="10" className="cover__panel" />
      {[48, 62, 76, 90, 104, 118, 132].map((y, i) => (
        <rect key={y} x="52" y={y} width={i % 3 === 0 ? 40 : 56} height="6" rx="2" className="cover__fill" />
      ))}
      <path d="M128 100 h26" className="cover__line cover__dash" />
      <path d="M148 94 l8 6 -8 6" className="cover__line" />
      <rect x="196" y="40" width="110" height="70" rx="8" className="cover__panel" />
      <rect x="182" y="58" width="110" height="70" rx="8" className="cover__panel" />
      <rect x="168" y="76" width="110" height="70" rx="8" className="cover__panel cover__panel--strong" />
      <rect x="180" y="88" width="60" height="9" rx="2" className="cover__accent" />
      <rect x="180" y="106" width="80" height="5" rx="2" className="cover__fill" />
      <rect x="180" y="118" width="70" height="5" rx="2" className="cover__fill" />
      <rect x="180" y="130" width="50" height="5" rx="2" className="cover__fill" />
    </g>
  ),
  "browser-llm-agent": (
    <g className="cover__ink">
      <circle cx="160" cy="100" r="56" className="cover__line cover__dash" />
      <path d="M212 88 l4 12 10 -6" className="cover__line" />
      <circle cx="160" cy="100" r="22" className="cover__accent" />
      <text x="146" y="105" className="cover__text cover__text--dark">LLM</text>
      {[
        { x: 160, y: 30, t: "search" },
        { x: 240, y: 138, t: "js_exec" },
        { x: 80, y: 138, t: "ask model" },
      ].map((n) => (
        <g key={n.t}>
          <rect x={n.x - 40} y={n.y - 14} width="80" height="28" rx="14" className="cover__panel cover__panel--strong" />
          <text x={n.x} y={n.y + 5} textAnchor="middle" className="cover__text cover__text--small">
            {n.t}
          </text>
        </g>
      ))}
    </g>
  ),
  parkease: (
    <g className="cover__ink">
      {Array.from({ length: 2 }, (_, row) =>
        Array.from({ length: 7 }, (_, col) => {
          const x = 30 + col * 38;
          const y = row === 0 ? 34 : 116;
          const filled = (row * 7 + col) % 3 !== 1;
          const mine = row === 1 && col === 4;
          return (
            <g key={`${row}-${col}`}>
              <rect x={x} y={y} width="30" height="50" rx="4" className="cover__slot" />
              {filled && !mine && <rect x={x + 5} y={y + 8} width="20" height="34" rx="6" className="cover__fill" />}
              {mine && <rect x={x + 5} y={y + 8} width="20" height="34" rx="6" className="cover__accent" />}
            </g>
          );
        }),
      )}
      <path d="M20 100 H300" className="cover__line cover__dash" />
      <circle cx="292" cy="22" r="14" className="cover__panel cover__panel--strong" />
      <text x="287" y="27" className="cover__text">P</text>
    </g>
  ),
  "placement-portal": (
    <g className="cover__ink">
      {["Admin", "Company", "Student"].map((role, i) => (
        <g key={role}>
          <rect x={26 + i * 96} y="34" width="80" height="132" rx="12" className={i === 1 ? "cover__panel cover__panel--strong" : "cover__panel"} />
          <text x={66 + i * 96} y="56" textAnchor="middle" className="cover__text cover__text--small">
            {role}
          </text>
          {[72, 96, 120].map((y, j) => (
            <g key={y}>
              <rect x={38 + i * 96} y={y} width="56" height="16" rx="5" className="cover__fill" />
              {(i + j) % 2 === 0 && <path d={`M${44 + i * 96} ${y + 8} l4 4 8 -8`} className="cover__check" />}
            </g>
          ))}
          <rect x={38 + i * 96} y="144" width="56" height="12" rx="6" className={i === 2 ? "cover__accent" : "cover__chip"} />
        </g>
      ))}
    </g>
  ),
  "quiz-master-v1": (
    <g className="cover__ink">
      <circle cx="86" cy="100" r="50" className="cover__slot" />
      <path d="M86 50 A50 50 0 1 1 42 124" className="cover__line cover__line--thick" />
      <text x="86" y="108" textAnchor="middle" className="cover__text cover__text--big">04:12</text>
      {["A", "B", "C", "D"].map((opt, i) => (
        <g key={opt}>
          <rect x="166" y={36 + i * 34} width="128" height="26" rx="13" className={i === 2 ? "cover__accent" : "cover__panel"} />
          <text x="182" y={53 + i * 34} className={i === 2 ? "cover__text cover__text--dark" : "cover__text"}>
            {opt}
          </text>
          <rect x="202" y={46 + i * 34} width={60 - i * 8} height="6" rx="2" className={i === 2 ? "cover__dark" : "cover__fill"} />
        </g>
      ))}
    </g>
  ),
  default: (
    <g className="cover__ink">
      <circle cx="160" cy="100" r="50" className="cover__line" />
    </g>
  ),
};
