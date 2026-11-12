import type { CSSProperties } from "react";

/**
 * The hero drawing: a late-night desk. A laptop with a chart, a bowl of ramen,
 * a sleeping cat, and a sakura branch across the window. Original artwork.
 *
 * It is drawn as stacked layers that share one viewBox. The bottom layer holds
 * everything that stays still, and the parts that move sit on their own layers
 * above it, so a twinkling star never makes the browser repaint the whole desk.
 * The motion lives in globals.css and switches off when reduced motion is on;
 * with no motion, the layers line up into the original still drawing.
 */
const INK = "#1d1b22";
const VIEW = "0 0 600 460";
const line = { fill: "none", stroke: INK, strokeWidth: 2.4, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const solid = (fill: string) => ({ ...line, fill });
const timing = (duration: number, delay: number): CSSProperties => ({ animationDuration: `${duration}s`, animationDelay: `${delay}s` });

function Blossom({ x, y, r = 9, rot = 0 }: { x: number; y: number; r?: number; rot?: number }) {
  const petals = Array.from({ length: 5 }, (_, i) => {
    const a = ((i * 72 + rot) * Math.PI) / 180;
    const cx = x + Math.cos(a) * r * 0.62;
    const cy = y + Math.sin(a) * r * 0.62;
    return <ellipse key={i} cx={cx} cy={cy} rx={r * 0.5} ry={r * 0.36} transform={`rotate(${i * 72 + rot} ${cx} ${cy})`} fill="#ffc5d5" stroke={INK} strokeWidth={1.5} />;
  });
  return (
    <g>
      {petals}
      <circle cx={x} cy={y} r={r * 0.22} fill="#e2442f" />
    </g>
  );
}

/** Star crosses: x, y, seconds per twinkle, start offset. */
const STARS = [
  [284, 84, 2.8, -0.4],
  [372, 102, 3.6, -2.1],
  [462, 190, 2.4, -1.2],
  [540, 168, 3.2, -0.8],
] as const;

/** Tiny dot stars: x, y, seconds per twinkle, start offset. */
const DOTS = [
  [446, 40, 2.2, -1.5],
  [552, 118, 3.0, -0.3],
  [268, 154, 2.6, -1.9],
  [530, 228, 3.4, -2.6],
  [330, 114, 2.9, -0.9],
] as const;

/** Falling petals: where each one sits in the still drawing, then its timing. */
const PETALS = [
  { x: 443, y: 153, dur: 9, delay: -2, spin: 2.3 },
  { x: 321, y: 199, dur: 10.5, delay: -6.5, spin: 2.9 },
  { x: 388, y: 214, dur: 8.2, delay: -4, spin: 2.1 },
  { x: 520, y: 196, dur: 11, delay: -8.5, spin: 2.6 },
] as const;

const STEAM = ["M466 300 C 458 288, 474 280, 466 268", "M486 296 C 478 284, 494 276, 486 262", "M506 300 C 498 286, 514 278, 506 262"];

const ZS = [
  { x: 58, y: 314, size: 18 },
  { x: 76, y: 302, size: 22 },
  { x: 97, y: 288, size: 27 },
] as const;

export function HeroScene({ className }: { className?: string }) {
  return (
    <div className={`scene scene--hero ${className ?? ""}`}>
      {/* the still drawing */}
      <svg viewBox={VIEW} className="scene__layer" role="img" aria-label="A drawing of a desk at night: a laptop showing a chart, a bowl of ramen, a sleeping cat and a sakura branch outside the window.">
        <defs>
          <linearGradient id="twilight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#24448f" />
            <stop offset="0.5" stopColor="#6a6fcf" />
            <stop offset="0.82" stopColor="#e99ac4" />
            <stop offset="1" stopColor="#ffc59a" />
          </linearGradient>
        </defs>
        <g filter="url(#wobble)">
          {/* window: a twilight sky and the moon */}
          <rect x="250" y="22" width="320" height="226" rx="6" fill="url(#twilight)" stroke={INK} strokeWidth={2.4} />
          <path d="M410 22 V248 M250 136 H570" {...line} />
          <circle cx="505" cy="76" r="26" {...solid("#ffe27a")} />
          <path d="M494 70 a4 4 0 1 0 0.1 0 M512 86 a3 3 0 1 0 0.1 0" {...line} strokeWidth={1.6} />

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
            <rect key={x} x={x} y={y} width="16" height={h} rx="2" fill="#ffe27a" stroke={INK} strokeWidth={1.6} />
          ))}
          <path d="M194 300 L 226 284 L 254 272 L 284 288 L 318 262 L 346 252" fill="none" stroke="#e2442f" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M150 372 H392 L 406 384 H136 Z" {...solid("#fbfaf7")} />
          <path d="M250 378 H292" {...line} strokeWidth={1.6} />

          {/* ramen */}
          <path d="M516 304 L 594 258 M524 310 L 596 270" {...line} strokeWidth={2.6} />
          <path d="M414 318 C 418 372, 446 386, 486 386 C 526 386, 554 372, 558 318 Z" {...solid("#fbfaf7")} />
          <path d="M424 344 C 470 352, 506 352, 550 344" {...line} stroke="#e2442f" strokeWidth={2.2} />
          <path d="M430 356 l6 -6 l6 6 l6 -6 l6 6 M500 356 l6 -6 l6 6 l6 -6 l6 6" fill="none" stroke="#e2442f" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx="486" cy="318" rx="72" ry="14" {...solid("#f3dcb0")} />
          <path d="M436 318 c8 -6 14 6 22 0 s14 6 22 0 s14 6 22 0" {...line} strokeWidth={1.6} />
          <ellipse cx="454" cy="314" rx="13" ry="7.5" {...solid("#ffffff")} strokeWidth={1.8} />
          <ellipse cx="456" cy="314" rx="5.5" ry="4" fill="#ffc94d" stroke={INK} strokeWidth={1.4} />
          <circle cx="514" cy="314" r="10" {...solid("#ffffff")} strokeWidth={1.8} />
          <path d="M514 314 m-1 0 a2 2 0 0 1 3 0 a4 4 0 0 1 -5 3 a6 6 0 0 1 6 -8" fill="none" stroke="#e2442f" strokeWidth={1.6} strokeLinecap="round" />
          <path d="M466 386 h40 v8 h-40 z" {...solid("#fbfaf7")} strokeWidth={2} />
        </g>
        {/* manga sound effect: シーン ("shiin"), the sound of a very quiet room */}
        <g transform="rotate(-10 120 140)">
          <text
            x="120"
            y="150"
            textAnchor="middle"
            fontFamily="'Hiragino Sans', 'Yu Gothic', 'Noto Sans JP', 'Noto Sans CJK JP', sans-serif"
            fontWeight="900"
            fontSize="46"
            fill="#e2442f"
            stroke="#fbfaf7"
            strokeWidth="6"
            paintOrder="stroke"
            letterSpacing="2"
          >
            シーン
          </text>
          <path d="M54 112 l-12 -10 M60 100 l-6 -14 M190 108 l12 -10 M184 96 l6 -14" stroke="#e2442f" strokeWidth={2.4} strokeLinecap="round" />
        </g>
      </svg>

      {/* the sakura branch, swaying as one piece from where it enters the frame */}
      <svg viewBox={VIEW} className="scene__layer scene__sakura" aria-hidden="true" focusable="false">
        <g filter="url(#wobble)">
          <path d="M232 30 C 290 44, 330 70, 408 84 M300 52 C 312 76, 330 92, 352 104 M352 74 C 368 60, 384 52, 404 50" {...line} strokeWidth={3.2} />
          <Blossom x={300} y={46} r={12} />
          <Blossom x={348} y={70} r={10} rot={20} />
          <Blossom x={406} y={84} r={11} rot={40} />
          <Blossom x={352} y={104} r={10} rot={10} />
          <Blossom x={404} y={50} r={9} rot={30} />
          <Blossom x={268} y={36} r={8} rot={50} />
        </g>
      </svg>

      {/* small moving things: stars, a shooting star, petals, steam and the z's */}
      <svg viewBox={VIEW} className="scene__layer scene__fx" aria-hidden="true" focusable="false">
        <defs>
          {/* the four window panes, so anything in the sky stays behind the frame */}
          <clipPath id="hero-panes">
            <rect x="253" y="25" width="154" height="108" />
            <rect x="413" y="25" width="154" height="108" />
            <rect x="253" y="139" width="154" height="106" />
            <rect x="413" y="139" width="154" height="106" />
          </clipPath>
        </defs>
        <g clipPath="url(#hero-panes)">
          {STARS.map(([x, y, dur, delay]) => (
            <path key={`s${x}`} className="twinkle" style={timing(dur, delay)} d={`M${x} ${y - 6} V${y + 6} M${x - 6} ${y} H${x + 6}`} {...line} stroke="#ffffff" strokeWidth={1.8} />
          ))}
          {DOTS.map(([x, y, dur, delay]) => (
            <circle key={`d${x}`} className="twinkle" style={timing(dur, delay)} cx={x} cy={y} r="1.7" fill="#ffffff" />
          ))}
          <g className="shooting-star">
            <path d="M296 120 L 368 160" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" opacity={0.85} />
            <circle cx="370" cy="161" r="2.6" fill="#ffffff" />
          </g>
          {PETALS.map((p) => (
            <g key={p.x} transform={`translate(${p.x} ${p.y})`}>
              <g className="petal" style={timing(p.dur, p.delay)}>
                <path className="petal__spin" style={timing(p.spin, p.delay)} d="M-3 -3 c6 -6 12 0 6 6 c-6 6 -12 0 -6 -6z" {...solid("#ffc5d5")} strokeWidth={1.6} />
              </g>
            </g>
          ))}
        </g>
        {STEAM.map((d, i) => (
          <path key={d} className="steam" style={{ animationDelay: `${-i * 1.15}s` }} d={d} {...line} strokeWidth={1.8} opacity={0.75} />
        ))}
        {ZS.map((z, i) => (
          <text key={z.x} className="snore" style={{ animationDelay: `${i * 0.45}s` }} x={z.x} y={z.y} fontFamily="var(--font-hand), cursive" fontSize={z.size} fill={INK}>
            z
          </text>
        ))}
      </svg>

      {/* the cat: breathes all the time, flicks its tail, twitches an ear and yawns now and then */}
      <svg viewBox={VIEW} className="scene__layer scene__cat" aria-hidden="true" focusable="false">
        <g className="cat__tail">
          <path d="M150 372 C 154 396, 110 398, 82 388" {...line} strokeWidth={3} filter="url(#wobble)" />
        </g>
        <g filter="url(#wobble)">
          <ellipse cx="96" cy="356" rx="58" ry="26" {...solid("#fbfaf7")} />
          <path d="M108 336 c6 6 6 14 0 20 M126 338 c6 6 6 14 0 20" {...line} strokeWidth={1.8} />
          <rect x="70" y="340" width="56" height="34" rx="16" fill="url(#tone-light)" opacity={0.7} />
        </g>
        <g className="cat__head">
          <g className="cat__ear">
            <path d="M30 356 L 34 324 L 48 338 Z" {...solid("#fbfaf7")} filter="url(#wobble)" />
          </g>
          <g filter="url(#wobble)">
            <path d="M58 336 L 72 322 L 74 352 Z" {...solid("#fbfaf7")} />
            <circle cx="52" cy="352" r="22" {...solid("#fbfaf7")} />
            <path d="M40 352 q4 4 8 0 M56 352 q4 4 8 0" {...line} strokeWidth={1.8} />
            <path d="M30 360 h-10 M30 364 l-9 4 M74 360 h10 M74 364 l9 4" {...line} strokeWidth={1.3} />
          </g>
          <path className="cat__mouth" d="M51 360 l2 2 l2 -2" {...line} strokeWidth={1.5} />
          <g className="cat__yawn">
            <ellipse cx="53" cy="365" rx="4.6" ry="5.8" fill="#b8384f" stroke={INK} strokeWidth={1.5} />
            <ellipse cx="53" cy="368.6" rx="2.6" ry="1.6" fill="#ff9fb4" />
          </g>
        </g>
      </svg>
    </div>
  );
}
