import type { ReactNode } from "react";

/**
 * A small, clean drawing of each project's main screen, inside a window frame.
 * Kept crisp (no wobble) so it reads like a screenshot pinned to the page.
 */
const INK = "#1d1b22";
const MUTED = "#c9c6d1";
const s = { fill: "none", stroke: INK, strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const bar = (x: number, y: number, w: number, fill = MUTED) => <rect x={x} y={y} width={w} height="6" rx="3" fill={fill} />;

const screens: Record<string, ReactNode> = {
  "data-analyst-agent": (
    <>
      <rect x="18" y="40" width="150" height="150" rx="6" fill="#1d1b22" />
      <text x="30" y="62" fontFamily="ui-monospace, monospace" fontSize="10" fill="#ffe27a">POST /api</text>
      {[78, 94, 110, 126, 142, 158].map((y, i) => (
        <rect key={y} x={i % 3 === 0 ? 30 : 42} y={y} width={[90, 70, 100, 60, 84, 50][i]} height="5" rx="2.5" fill={i === 2 ? "#ffc5d5" : "#6b6875"} />
      ))}
      <text x="186" y="58" fontSize="10" fontWeight="600" fill={INK}>answers.json</text>
      {[
        [188, 150, 26],
        [212, 132, 44],
        [236, 116, 60],
        [260, 140, 36],
        [284, 104, 72],
      ].map(([x, y, h]) => (
        <rect key={x} x={x} y={y} width="16" height={h} rx="2" fill="#ffe27a" stroke={INK} strokeWidth={1.4} />
      ))}
      <path d="M182 176 H306" {...s} />
    </>
  ),
  "tds-virtual-ta": (
    <>
      <rect x="120" y="40" width="182" height="34" rx="12" fill="#d6e6ff" stroke={INK} strokeWidth={1.4} />
      {bar(134, 50, 120, "#9aa7c4")}
      {bar(134, 62, 80, "#9aa7c4")}
      <rect x="18" y="86" width="210" height="62" rx="12" fill="#ffffff" stroke={INK} strokeWidth={1.4} />
      {bar(32, 98, 170)}
      {bar(32, 110, 150)}
      {bar(32, 122, 110)}
      {["forum #412", "notes 3.2"].map((t, i) => (
        <g key={t}>
          <rect x={32 + i * 86} y="158" width="78" height="20" rx="10" fill="#ffe27a" stroke={INK} strokeWidth={1.2} />
          <text x={71 + i * 86} y="172" textAnchor="middle" fontSize="9.5" fill={INK}>{t}</text>
        </g>
      ))}
    </>
  ),
  prompt2ppt: (
    <>
      <rect x="18" y="40" width="96" height="150" rx="6" fill="#f4f2f7" />
      {[50, 90, 130].map((y, i) => (
        <rect key={y} x="28" y={y} width="76" height="32" rx="3" fill="#ffffff" stroke={i === 0 ? "#e2442f" : INK} strokeWidth={i === 0 ? 2 : 1.2} />
      ))}
      <rect x="128" y="48" width="176" height="112" rx="4" fill="#ffffff" stroke={INK} strokeWidth={1.6} />
      <text x="144" y="78" fontSize="14" fontWeight="700" fill={INK}>Q3 in one slide</text>
      {bar(144, 92, 120)}
      {bar(144, 104, 96)}
      <circle cx="270" cy="132" r="16" fill="#cfe6b4" stroke={INK} strokeWidth={1.4} />
      <path d="M270 132 V116 A16 16 0 0 1 284 140 Z" fill="#ffe27a" stroke={INK} strokeWidth={1.2} />
      <rect x="200" y="170" width="104" height="22" rx="11" fill={INK} />
      <text x="252" y="185" textAnchor="middle" fontSize="10" fill="#ffffff">Download .pptx</text>
    </>
  ),
  "browser-llm-agent": (
    <>
      {[
        ["search_web", "#d6e6ff"],
        ["run_js", "#ffe27a"],
        ["fetch_api", "#cfe6b4"],
      ].map(([t, fill], i) => (
        <g key={t}>
          <rect x="18" y={42 + i * 40} width="200" height="30" rx="8" fill={fill} stroke={INK} strokeWidth={1.4} />
          <text x="32" y={61 + i * 40} fontFamily="ui-monospace, monospace" fontSize="10.5" fill={INK}>{t}()</text>
          <path d={`M196 ${53 + i * 40} l4 4 l8 -8`} {...s} />
        </g>
      ))}
      <path d="M118 72 v10 M118 112 v10" {...s} strokeDasharray="3 3" />
      <rect x="232" y="42" width="72" height="110" rx="8" fill="#ffffff" stroke={INK} strokeWidth={1.4} />
      {[56, 70, 84, 98, 112].map((y) => (
        <g key={y}>{bar(242, y, 52)}</g>
      ))}
      <rect x="18" y="164" width="286" height="26" rx="13" fill="#ffffff" stroke={INK} strokeWidth={1.4} />
      {bar(34, 174, 140)}
    </>
  ),
  parkease: (
    <>
      {Array.from({ length: 12 }, (_, i) => {
        const x = 22 + (i % 6) * 46;
        const y = i < 6 ? 44 : 120;
        const taken = [1, 2, 4, 7, 9, 10].includes(i);
        return (
          <g key={i}>
            <rect x={x} y={y} width="38" height="58" rx="4" fill={taken ? "#ffc5d5" : "#ffffff"} stroke={INK} strokeWidth={1.4} />
            <text x={x + 19} y={y + 34} textAnchor="middle" fontSize="11" fontWeight="600" fill={INK}>
              {taken ? "×" : `P${i + 1}`}
            </text>
          </g>
        );
      })}
      <path d="M18 110 H306" {...s} strokeDasharray="8 6" />
    </>
  ),
  "placement-portal": (
    <>
      {["Applied", "Shortlisted", "Placed"].map((t, c) => (
        <g key={t}>
          <rect x={18 + c * 98} y="40" width="88" height="150" rx="6" fill="#f4f2f7" />
          <text x={26 + c * 98} y="58" fontSize="10" fontWeight="600" fill={INK}>{t}</text>
          {Array.from({ length: 3 - c }, (_, r) => (
            <g key={r}>
              <rect x={26 + c * 98} y={66 + r * 40} width="72" height="32" rx="4" fill={c === 2 ? "#cfe6b4" : "#ffffff"} stroke={INK} strokeWidth={1.2} />
              {bar(34 + c * 98, 74 + r * 40, 44)}
              {bar(34 + c * 98, 84 + r * 40, 30)}
            </g>
          ))}
        </g>
      ))}
    </>
  ),
  "quiz-master-v1": (
    <>
      <text x="22" y="62" fontSize="12" fontWeight="700" fill={INK}>Q4. Which join keeps every row?</text>
      {["Inner join", "Left join", "Cross join"].map((t, i) => (
        <g key={t}>
          <rect x="22" y={76 + i * 34} width="200" height="26" rx="6" fill={i === 1 ? "#cfe6b4" : "#ffffff"} stroke={INK} strokeWidth={1.4} />
          <circle cx="38" cy={89 + i * 34} r="5" fill={i === 1 ? INK : "#ffffff"} stroke={INK} strokeWidth={1.4} />
          <text x="52" y={93 + i * 34} fontSize="11" fill={INK}>{t}</text>
        </g>
      ))}
      <circle cx="268" cy="110" r="30" fill="#ffffff" stroke={MUTED} strokeWidth={6} />
      <path d="M268 80 A30 30 0 1 1 240 120" fill="none" stroke="#e2442f" strokeWidth={6} strokeLinecap="round" />
      <text x="268" y="115" textAnchor="middle" fontSize="13" fontWeight="700" fill={INK}>0:42</text>
    </>
  ),
  "portcast-take-home": (
    <>
      <text x="20" y="52" fontSize="11" fontWeight="700" fill={INK}>Booked vs actual</text>
      <text x="20" y="81" fontSize="9.5" fill={INK}>Booked</text>
      <rect x="70" y="71" width="40" height="14" rx="3" fill="#d6e6ff" stroke={INK} strokeWidth={1.2} />
      <rect x="114" y="71" width="150" height="14" rx="3" fill="#d6e6ff" stroke={INK} strokeWidth={1.2} />
      <text x="20" y="108" fontSize="9.5" fill={INK}>Actual</text>
      <rect x="70" y="98" width="44" height="14" rx="3" fill="#cfe6b4" stroke={INK} strokeWidth={1.2} />
      <rect x="114" y="96" width="36" height="18" rx="3" fill="#ffc5d5" stroke="#e2442f" strokeWidth={1.6} strokeDasharray="3 2" />
      <rect x="150" y="98" width="150" height="14" rx="3" fill="#cfe6b4" stroke={INK} strokeWidth={1.2} />
      <path d="M264 64 V120 M300 64 V120" stroke="#e2442f" strokeWidth={1.2} strokeDasharray="3 3" />
      <text x="282" y="62" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#e2442f">+7d</text>
      <path d="M18 132 H302" {...s} strokeWidth={1} strokeDasharray="4 4" />
      <text x="20" y="152" fontSize="9.5" fill={INK}>Stock</text>
      <text x="20" y="168" fontSize="9.5" fill={INK}>Expedite</text>
      <text x="20" y="184" fontSize="9.5" fill={INK}>D&amp;D</text>
      <rect x="70" y="144" width="53" height="10" rx="2" fill="#d6e6ff" stroke={INK} strokeWidth={1.1} />
      <rect x="70" y="160" width="120" height="10" rx="2" fill="#e2442f" stroke={INK} strokeWidth={1.1} />
      <rect x="70" y="176" width="58" height="10" rx="2" fill="#ffe27a" stroke={INK} strokeWidth={1.1} />
      <text x="300" y="172" textAnchor="end" fontSize="14" fontWeight="700" fill={INK}>≈ $2.3M/yr</text>
    </>
  ),
};

export function ScreenSketch({ slug, label, className }: { slug: string; label: string; className?: string }) {
  return (
    <svg viewBox="0 0 320 206" className={className} role="img" aria-label={`Sketch of ${label}`}>
      <rect x="1" y="1" width="318" height="204" rx="10" fill="#ffffff" stroke={INK} strokeWidth={2} />
      <path d="M1 28 H319" stroke={INK} strokeWidth={1.4} />
      <circle cx="16" cy="15" r="4" fill="#e2442f" />
      <circle cx="30" cy="15" r="4" fill="#ffe27a" stroke={INK} strokeWidth={1} />
      <circle cx="44" cy="15" r="4" fill="#cfe6b4" stroke={INK} strokeWidth={1} />
      <rect x="96" y="8" width="128" height="14" rx="7" fill="#f4f2f7" />
      {screens[slug]}
    </svg>
  );
}
