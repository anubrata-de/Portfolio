/** Larger original drawings: the checklist scene and the end card. */
const INK = "#1d1b22";
const line = { fill: "none", stroke: INK, strokeWidth: 2.4, strokeLinecap: "round", strokeLinejoin: "round" } as const;

/**
 * Draws in three layers, one per ticked box: hills, then a torii gate, then the sun and birds.
 * Every path uses pathLength=1 so CSS can draw it in with stroke-dashoffset.
 */
export function ChecklistScene({ count }: { count: number }) {
  const on = (n: number) => `scene-layer${count >= n ? " is-on" : ""}`;
  return (
    <svg viewBox="0 0 420 300" className="checklist__scene" role="img" aria-label={`Drawing, ${count} of 3 parts done: hills, a torii gate, and the sun with birds.`}>
      <g filter="url(#wobble)">
        <path d="M10 262 H410" {...line} strokeDasharray="4 8" opacity={count ? 0 : 0.4} />
        <g className={on(1)}>
          <path pathLength={1} d="M10 262 H410" {...line} />
          <path pathLength={1} d="M30 262 L 150 112 L 202 172 L 240 134 L 392 262" {...line} fill="#d6e6ff" />
          <path pathLength={1} d="M122 147 L 150 112 L 178 146 L 164 140 L 150 152 L 136 141 Z" {...line} fill="#ffffff" />
          <path pathLength={1} d="M20 280 C 120 272, 300 288, 400 278" {...line} strokeWidth={1.6} />
        </g>
        <g className={on(2)}>
          <path pathLength={1} d="M258 176 H270 V262 H258 Z M330 176 H342 V262 H330 Z" {...line} fill="#e2442f" />
          <path pathLength={1} d="M246 178 H354 V188 H246 Z" {...line} fill="#e2442f" />
          <path pathLength={1} d="M228 152 Q 300 140 372 152 L 368 164 Q 300 154 232 164 Z" {...line} fill="#e2442f" />
          <path pathLength={1} d="M294 164 H306 V178 H294 Z" {...line} fill="#e2442f" />
        </g>
        <g className={on(3)}>
          <path pathLength={1} d="M352 70 m -28 0 a 28 28 0 1 0 56 0 a 28 28 0 1 0 -56 0" {...line} fill="#ffe27a" />
          <path pathLength={1} d="M70 64 q 8 -8 16 0 q 8 -8 16 0 M112 44 q 6 -6 12 0 q 6 -6 12 0 M150 70 q 5 -5 10 0 q 5 -5 10 0" {...line} strokeWidth={2} />
          <path pathLength={1} d="M214 100 c6 -6 12 0 6 6 c-6 6 -12 0 -6 -6z M196 214 c6 -6 12 0 6 6 c-6 6 -12 0 -6 -6z" {...line} strokeWidth={1.6} fill="#ffc5d5" />
        </g>
      </g>
      {count === 0 && (
        <text x="210" y="150" textAnchor="middle" fontFamily="var(--font-hand), cursive" fontSize="28" fill="#55525e">
          tick a box…
        </text>
      )}
    </svg>
  );
}

/** Dusk over rooftops and power lines, the classic last shot of an episode. */
export function EndCardScene() {
  const wire = (y1: number, y2: number, sag: number) => `M-20 ${y1} Q 140 ${y1 + sag} 262 ${y2} Q 620 ${y2 + sag * 1.6} 982 ${y2 + 4} Q 1100 ${y2 + sag} 1220 ${y1 + 10}`;
  return (
    <svg viewBox="0 0 1200 400" preserveAspectRatio="xMidYMax slice" className="endcard__scene" aria-hidden="true">
      <defs>
        <linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5b86e5" />
          <stop offset="0.38" stopColor="#a796e0" />
          <stop offset="0.68" stopColor="#ff9fb4" />
          <stop offset="1" stopColor="#ffd08f" />
        </linearGradient>
      </defs>
      <rect width="1200" height="400" fill="url(#dusk)" />
      <circle cx="830" cy="300" r="96" fill="#ffe1a1" opacity={0.95} />
      <circle cx="830" cy="300" r="140" fill="#ffd08f" opacity={0.35} />
      <g filter="url(#wobble)" fill="#fff4f6" stroke={INK} strokeWidth={1.6} strokeOpacity={0.3}>
        <path d="M90 120 c10 -30 60 -34 74 -8 c18 -14 52 -4 50 22 c24 4 26 34 0 36 H96 c-28 0 -34 -40 -6 -50 z" />
        <path d="M560 70 c10 -24 50 -26 60 -6 c16 -10 42 -2 40 18 c20 4 20 28 0 30 H566 c-22 0 -28 -32 -6 -42 z" />
        <path d="M940 140 c8 -20 40 -22 50 -4 c12 -8 34 -2 32 14 c16 4 16 22 0 24 H946 c-18 0 -22 -26 -6 -34 z" />
      </g>
      <g fill={INK}>
        <path d="M0 400 V318 H70 V292 H150 V330 H210 V280 H232 V262 H262 V280 H300 V312 H380 V300 H470 V336 H560 V306 H640 V290 H700 V320 H760 V300 H860 V270 H930 V300 H1010 V286 H1080 V318 H1140 V296 H1200 V400 Z" />
        <rect x="236" y="236" width="22" height="26" rx="4" />
        <rect x="874" y="246" width="40" height="24" rx="10" />
        <rect x="660" y="270" width="30" height="20" rx="8" />
      </g>
      <g stroke={INK} strokeLinecap="round" fill="none">
        <path d="M262 400 V40 M982 400 V60" strokeWidth={9} />
        <path d="M228 76 H296 M232 100 H292 M950 96 H1014 M954 120 H1010" strokeWidth={5} />
        <path d={wire(70, 76, 40)} strokeWidth={1.8} />
        <path d={wire(94, 100, 46)} strokeWidth={1.8} />
        <path d={wire(108, 120, 36)} strokeWidth={1.4} />
        <path d="M420 150 q8 -8 16 0 q8 -8 16 0 M480 120 q6 -6 12 0 q6 -6 12 0 M700 170 q6 -6 12 0 q6 -6 12 0" strokeWidth={2.4} strokeLinejoin="round" />
      </g>
    </svg>
  );
}
