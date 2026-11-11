/**
 * The hero drawing: a late-night desk. A laptop with a chart, a bowl of ramen,
 * a sleeping cat, and a sakura branch across the window. Original artwork.
 */
const INK = "#1d1b22";
const line = { fill: "none", stroke: INK, strokeWidth: 2.4, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const solid = (fill: string) => ({ ...line, fill });

function Blossom({ x, y, r = 9, rot = 0 }: { x: number; y: number; r?: number; rot?: number }) {
  const petals = Array.from({ length: 5 }, (_, i) => {
    const a = ((i * 72 + rot) * Math.PI) / 180;
    const cx = x + Math.cos(a) * r * 0.62;
    const cy = y + Math.sin(a) * r * 0.62;
    return <ellipse key={i} cx={cx} cy={cy} rx={r * 0.5} ry={r * 0.36} transform={`rotate(${i * 72 + rot} ${cx} ${cy})`} fill="#ffc9d6" stroke={INK} strokeWidth={1.5} />;
  });
  return (
    <g>
      {petals}
      <circle cx={x} cy={y} r={r * 0.22} fill="#e5484d" />
    </g>
  );
}

export function HeroScene({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 460" className={className} role="img" aria-label="A drawing of a desk at night: a laptop showing a chart, a bowl of ramen, a sleeping cat and a sakura branch outside the window.">
      <g filter="url(#wobble)">
        {/* window */}
        <rect x="250" y="22" width="320" height="226" rx="6" fill="#e3e9f6" stroke={INK} strokeWidth={2.4} />
        <path d="M410 22 V248 M250 136 H570" {...line} />
        <circle cx="505" cy="76" r="26" {...solid("#ffe680")} />
        <path d="M494 70 a4 4 0 1 0 0.1 0 M512 86 a3 3 0 1 0 0.1 0" {...line} strokeWidth={1.6} />
        {[
          [300, 62],
          [372, 102],
          [462, 190],
          [540, 168],
        ].map(([x, y]) => (
          <path key={`${x}`} d={`M${x} ${y - 6} V${y + 6} M${x - 6} ${y} H${x + 6}`} {...line} strokeWidth={1.8} />
        ))}

        {/* sakura branch */}
        <path d="M232 30 C 290 44, 330 70, 408 84 M300 52 C 312 76, 330 92, 352 104 M352 74 C 368 60, 384 52, 404 50" {...line} strokeWidth={3.2} />
        <Blossom x={300} y={46} r={12} />
        <Blossom x={348} y={70} r={10} rot={20} />
        <Blossom x={406} y={84} r={11} rot={40} />
        <Blossom x={352} y={104} r={10} rot={10} />
        <Blossom x={404} y={50} r={9} rot={30} />
        <Blossom x={268} y={36} r={8} rot={50} />

        {/* falling petals */}
        <path d="M440 150 c6 -6 12 0 6 6 c-6 6 -12 0 -6 -6z" {...solid("#ffc9d6")} strokeWidth={1.6} />
        <path d="M318 196 c6 -6 12 0 6 6 c-6 6 -12 0 -6 -6z" {...solid("#ffc9d6")} strokeWidth={1.6} />

        {/* desk */}
        <rect x="18" y="392" width="572" height="48" fill="url(#tone-light)" />
        <path d="M14 382 H592 M18 392 H588" {...line} />

        {/* laptop */}
        <rect x="168" y="226" width="206" height="146" rx="9" {...solid("#fbfaf7")} />
        <rect x="180" y="238" width="182" height="120" rx="4" fill="#ffffff" stroke={INK} strokeWidth={1.8} />
        <path d="M188 248 h0.1 M196 248 h0.1 M204 248 h0.1" {...line} strokeWidth={3} />
        {[
          [198, 318, 26],
          [224, 304, 40],
          [250, 290, 54],
          [276, 310, 34],
          [302, 282, 62],
        ].map(([x, y, h]) => (
          <rect key={x} x={x} y={y} width="16" height={h} rx="2" fill="#ffe680" stroke={INK} strokeWidth={1.6} />
        ))}
        <path d="M194 300 L 226 284 L 254 272 L 284 288 L 318 262 L 346 252" fill="none" stroke="#e5484d" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M150 372 H392 L 406 384 H136 Z" {...solid("#fbfaf7")} />
        <path d="M250 378 H292" {...line} strokeWidth={1.6} />

        {/* ramen */}
        <path d="M486 296 C 478 284, 494 276, 486 262 M506 300 C 498 286, 514 278, 506 262 M466 300 C 458 288, 474 280, 466 268" {...line} strokeWidth={1.8} opacity={0.75} />
        <path d="M516 304 L 594 258 M524 310 L 596 270" {...line} strokeWidth={2.6} />
        <path d="M414 318 C 418 372, 446 386, 486 386 C 526 386, 554 372, 558 318 Z" {...solid("#fbfaf7")} />
        <path d="M424 344 C 470 352, 506 352, 550 344" {...line} stroke="#e5484d" strokeWidth={2.2} />
        <path d="M430 356 l6 -6 l6 6 l6 -6 l6 6 M500 356 l6 -6 l6 6 l6 -6 l6 6" fill="none" stroke="#e5484d" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        <ellipse cx="486" cy="318" rx="72" ry="14" {...solid("#f3dcb0")} />
        <path d="M436 318 c8 -6 14 6 22 0 s14 6 22 0 s14 6 22 0" {...line} strokeWidth={1.6} />
        <ellipse cx="454" cy="314" rx="13" ry="7.5" {...solid("#ffffff")} strokeWidth={1.8} />
        <ellipse cx="456" cy="314" rx="5.5" ry="4" fill="#ffc94d" stroke={INK} strokeWidth={1.4} />
        <circle cx="514" cy="314" r="10" {...solid("#ffffff")} strokeWidth={1.8} />
        <path d="M514 314 m-1 0 a2 2 0 0 1 3 0 a4 4 0 0 1 -5 3 a6 6 0 0 1 6 -8" fill="none" stroke="#e5484d" strokeWidth={1.6} strokeLinecap="round" />
        <path d="M466 386 h40 v8 h-40 z" {...solid("#fbfaf7")} strokeWidth={2} />

        {/* sleeping cat */}
        <path d="M150 372 C 154 396, 110 398, 82 388" {...line} strokeWidth={3} />
        <ellipse cx="96" cy="356" rx="58" ry="26" {...solid("#fbfaf7")} />
        <path d="M108 336 c6 6 6 14 0 20 M126 338 c6 6 6 14 0 20" {...line} strokeWidth={1.8} />
        <rect x="70" y="340" width="56" height="34" rx="16" fill="url(#tone-light)" opacity={0.7} />
        <path d="M30 356 L 34 324 L 48 338 Z M58 336 L 72 322 L 74 352 Z" {...solid("#fbfaf7")} />
        <circle cx="52" cy="352" r="22" {...solid("#fbfaf7")} />
        <path d="M40 352 q4 4 8 0 M56 352 q4 4 8 0" {...line} strokeWidth={1.8} />
        <path d="M51 360 l2 2 l2 -2" {...line} strokeWidth={1.5} />
        <path d="M30 360 h-10 M30 364 l-9 4 M74 360 h10 M74 364 l9 4" {...line} strokeWidth={1.3} />
      </g>
      <text x="62" y="306" fontFamily="var(--font-hand), cursive" fontSize="26" fill={INK}>
        z z z
      </text>
    </svg>
  );
}
