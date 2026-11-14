import type { CSSProperties } from "react";

/**
 * Page buddies: small original characters that sit beside the page titles.
 *
 *   About: a bunny in a red scarf on a stack of books. It waves hello with a
 *          よろしく! ("nice to meet you", the line that ends a self-introduction),
 *          blinks, wiggles its nose, twitches an ear and hops now and then.
 *   Work:  a shiba puppy at a laptop. It types (code lines fill the screen to a
 *          manga カタカタ, "tap tap"), ships it, throws a happy paw up, then tilts
 *          its head at a "?" while it thinks up the next one. Tail always wagging.
 *
 * Same ink-and-pastel style as the desk scene; the motion lives in globals.css.
 * Decorative, so hidden from assistive tech.
 */
const INK = "#1d1b22";
const PAPER = "#fbfaf7";
const line = { fill: "none", stroke: INK, strokeWidth: 2.4, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const solid = (fill: string, strokeWidth = 2.4) => ({ ...line, fill, strokeWidth });
const JA_FONT = "'Hiragino Sans', 'Yu Gothic', 'Noto Sans JP', 'Noto Sans CJK JP', sans-serif";
const timing = (duration: number, delay = 0): CSSProperties => ({ animationDuration: `${duration}s`, animationDelay: `${delay}s` });

/** A four-point sparkle centred on (x, y). */
function Sparkle({ x, y, s = 1, style }: { x: number; y: number; s?: number; style?: CSSProperties }) {
  const d = `M${x} ${y - 7 * s} C ${x + s} ${y - 2 * s}, ${x + 2 * s} ${y - s}, ${x + 7 * s} ${y} C ${x + 2 * s} ${y + s}, ${x + s} ${y + 2 * s}, ${x} ${y + 7 * s} C ${x - s} ${y + 2 * s}, ${x - 2 * s} ${y + s}, ${x - 7 * s} ${y} C ${x - 2 * s} ${y - s}, ${x - s} ${y - 2 * s}, ${x} ${y - 7 * s} Z`;
  return <path className="twinkle" style={style} d={d} fill="#ffe27a" stroke={INK} strokeWidth={1.3} strokeLinejoin="round" />;
}

export function BunnyBuddy() {
  const FUR = "#ffffff";
  const PINK = "#ffc5d5";
  return (
    <svg viewBox="0 -16 360 296" className="buddy" aria-hidden="true" focusable="false">
      {/* the stack of books */}
      <g filter="url(#wobble)">
        <rect x="172" y="240" width="156" height="26" rx="4" {...solid("#d6e6ff")} />
        <path d="M190 240 V266 M310 240 V266" {...line} strokeWidth={1.6} />
        <rect x="184" y="216" width="134" height="24" rx="4" {...solid("#cfe6b4")} />
        <path d="M200 216 V240 M300 216 V240" {...line} strokeWidth={1.6} />
        <rect x="198" y="198" width="108" height="18" rx="3" {...solid("#ffe27a")} />
        <path d="M212 198 V216" {...line} strokeWidth={1.6} />
      </g>
      <ellipse className="bunny__shadow" cx="252" cy="199" rx="34" ry="3.5" fill={INK} opacity={0.12} />

      <g className="bunny">
        <g className="bunny__breath">
          {/* ears, behind the head; each flops on its own */}
          <g className="bunny__ear bunny__ear--left">
            <g filter="url(#wobble)">
              <path d="M232 84 C 216 66, 212 30, 224 18 C 236 8, 248 44, 248 78 Z" {...solid(FUR)} />
              <path d="M233 74 C 223 58, 221 36, 226 29 C 232 24, 240 48, 242 72 Z" fill={PINK} />
            </g>
          </g>
          <g className="bunny__ear bunny__ear--right">
            <g filter="url(#wobble)">
              <path d="M272 84 C 288 66, 292 30, 280 18 C 268 8, 256 44, 256 78 Z" {...solid(FUR)} />
              <path d="M271 74 C 281 58, 283 36, 278 29 C 272 24, 264 48, 262 72 Z" fill={PINK} />
            </g>
          </g>

          <g filter="url(#wobble)">
            <circle cx="292" cy="184" r="10" {...solid(FUR)} />
            <path d="M216 198 C 210 168, 226 140, 252 140 C 278 140, 294 168, 288 198 Z" {...solid(FUR)} />
            <ellipse cx="252" cy="178" rx="18" ry="15" fill="#fdeef2" />
            <ellipse cx="234" cy="197" rx="13" ry="6" {...solid(FUR)} />
            <ellipse cx="270" cy="197" rx="13" ry="6" {...solid(FUR)} />
            <ellipse cx="228" cy="172" rx="8" ry="15" transform="rotate(18 228 172)" {...solid(FUR)} />
            {/* red scarf */}
            <path d="M220 146 C 236 156, 268 156, 284 146 L 286 156 C 268 167, 236 167, 218 156 Z" {...solid("#e2442f", 2)} />
            <path d="M232 160 L 224 186 L 234 189 L 242 161 Z" {...solid("#e2442f", 2)} />
            <circle cx="252" cy="108" r="36" {...solid(FUR)} />
            <path d="M222 112 h-10 M222 116 l-9 3 M282 112 h10 M282 116 l9 3" {...line} strokeWidth={1.2} />
          </g>

          {/* face */}
          <ellipse cx="230" cy="117" rx="6.5" ry="3.8" fill="#ffb3c4" opacity={0.85} />
          <ellipse cx="274" cy="117" rx="6.5" ry="3.8" fill="#ffb3c4" opacity={0.85} />
          <g className="bunny__eyes">
            <ellipse cx="239" cy="106" rx="3.4" ry="4.4" fill={INK} />
            <ellipse cx="265" cy="106" rx="3.4" ry="4.4" fill={INK} />
            <circle cx="240.2" cy="104.4" r="1.2" fill="#ffffff" />
            <circle cx="266.2" cy="104.4" r="1.2" fill="#ffffff" />
          </g>
          <path className="bunny__nose" d="M248.5 114.5 h7 l-3.5 3.6 z" fill="#ff8fa6" stroke={INK} strokeWidth={1.2} strokeLinejoin="round" />
          <path d="M252 118.4 v2.4 M252 120.8 q-3.2 3.2 -6.4 0.8 M252 120.8 q3.2 3.2 6.4 0.8" {...line} strokeWidth={1.5} />

          {/* the waving arm, drawn raised; at rest it hangs by the body */}
          <g className="bunny__arm">
            <g filter="url(#wobble)">
              <ellipse cx="289.5" cy="131" rx="8" ry="22" transform="rotate(26.6 289.5 131)" {...solid(FUR)} />
              <circle cx="299" cy="111" r="9" {...solid(FUR)} />
            </g>
            <circle cx="296" cy="108.6" r="1.6" fill={PINK} />
            <circle cx="301.6" cy="108" r="1.6" fill={PINK} />
            <circle cx="299" cy="113.6" r="2.4" fill={PINK} />
          </g>
        </g>
      </g>

      {/* よろしく! ("nice to meet you") */}
      <g className="bunny__bubble">
        <path
          d="M48 34 H164 A24 24 0 0 1 188 58 V80 L 212 112 L 160 100 H48 A24 24 0 0 1 24 76 V58 A24 24 0 0 1 48 34 Z"
          {...solid("#ffffff", 2.2)}
          filter="url(#wobble)"
        />
        <text x="106" y="69" textAnchor="middle" fontFamily={JA_FONT} fontWeight="800" fontSize="26" fill={INK}>
          よろしく!
        </text>
        <text x="106" y="90" textAnchor="middle" fontFamily="var(--font-hand), cursive" fontSize="15" fill="#4f4c58">
          nice to meet you
        </text>
      </g>

      <Sparkle x={22} y={22} s={0.9} style={timing(2.6, -0.4)} />
      <Sparkle x={200} y={22} s={0.7} style={timing(3.2, -1.6)} />
      <Sparkle x={326} y={62} s={1} style={timing(2.9, -2.2)} />
      <Sparkle x={336} y={150} s={0.6} style={timing(3.4, -0.9)} />
    </svg>
  );
}

/** Code lines on the laptop screen: x, y, width, colour. */
const CODE = [
  [54, 112, 46, "#ffc5d5"],
  [66, 125, 74, "#ffe27a"],
  [78, 138, 52, "#d6e6ff"],
  [78, 151, 90, "#cfe6b4"],
  [66, 164, 40, "#ffe27a"],
  [54, 177, 22, "#ffc5d5"],
] as const;

export function ShibaBuddy() {
  const FUR = "#f2a65a";
  const CREAM = "#fff3e0";
  return (
    <svg viewBox="0 0 380 250" className="buddy" aria-hidden="true" focusable="false">
      {/* desk */}
      <rect x="12" y="240" width="356" height="10" fill="url(#tone-light)" />
      <path d="M8 232 H372 M12 240 H368" {...line} />

      {/* laptop */}
      <g filter="url(#wobble)">
        <rect x="34" y="90" width="172" height="116" rx="9" {...solid(PAPER)} />
        <rect x="44" y="100" width="152" height="96" rx="4" fill="#2b2d42" stroke={INK} strokeWidth={1.8} />
        <circle cx="120" cy="95" r="1.6" fill={INK} />
        <path d="M30 206 H210 L 228 230 H12 Z" {...solid(PAPER)} />
        <path d="M42 213 H198 M36 220 H206" {...line} strokeWidth={1.4} strokeDasharray="6 4" opacity={0.55} />
        <path d="M100 226 H140" {...line} strokeWidth={1.4} />
      </g>
      {CODE.map(([x, y, w, c], i) => (
        <rect key={y} className={`code-line code-line--${i + 1}`} x={x} y={y} width={w} height="6" rx="3" fill={c} />
      ))}
      <g className="shiba__ship">
        <rect x="120" y="168" width="66" height="20" rx="10" {...solid("#cfe6b4", 1.6)} />
        <text x="153" y="182" textAnchor="middle" fontSize="11" fontWeight="700" fill={INK}>
          ✓ shipped
        </text>
      </g>

      {/* カタカタ ("kata kata"): the manga sound of typing */}
      <g className="shiba__sfx">
        <g className="shiba__sfx-jitter">
          <text
            x="96"
            y="76"
            transform="rotate(-6 96 76)"
            textAnchor="middle"
            fontFamily={JA_FONT}
            fontWeight="800"
            fontSize="22"
            fill="#e2442f"
            stroke={PAPER}
            strokeWidth="5"
            paintOrder="stroke"
          >
            カタカタ
          </text>
        </g>
      </g>

      <g className="shiba">
        {/* curly tail, behind the body */}
        <g className="shiba__tail">
          <path d="M310 210 C 340 206, 350 172, 330 162 C 314 154, 304 176, 320 180" fill="none" stroke={INK} strokeWidth={15} strokeLinecap="round" />
          <path d="M310 210 C 340 206, 350 172, 330 162 C 314 154, 304 176, 320 180" fill="none" stroke={FUR} strokeWidth={10} strokeLinecap="round" />
        </g>

        {/* the typing paw: reaches onto the keyboard from behind the chest */}
        <g className="shiba__pose">
          <g className="shiba__tap">
            <path d="M276 198 L 214 213" fill="none" stroke={INK} strokeWidth={17} strokeLinecap="round" />
            <path d="M276 198 L 214 213" fill="none" stroke={CREAM} strokeWidth={12.5} strokeLinecap="round" />
            <ellipse cx="210" cy="214" rx="9.5" ry="6.5" {...solid(CREAM, 2.2)} />
            <path d="M205.5 211 v4 M210.5 210.4 v5" {...line} strokeWidth={1.3} />
          </g>
        </g>

        <g filter="url(#wobble)">
          <path d="M250 232 C 242 200, 254 164, 288 160 C 322 164, 334 200, 326 232 Z" {...solid(FUR)} />
          <path d="M270 232 C 266 210, 274 186, 288 182 C 302 186, 310 210, 306 232 Z" fill={CREAM} />
          <rect x="293" y="196" width="16" height="32" rx="8" {...solid(CREAM, 2.2)} />
          <path d="M298 226 v3 M303 226 v3" {...line} strokeWidth={1.3} />
          <ellipse cx="256" cy="229" rx="13" ry="6.5" {...solid(FUR)} />
          <ellipse cx="320" cy="229" rx="13" ry="6.5" {...solid(FUR)} />
        </g>

        <g className="shiba__head">
          <g filter="url(#wobble)">
            <path d="M252 98 L 256 62 L 278 86 Z" {...solid(FUR)} />
            <path d="M257 92 L 259 72 L 272 86 Z" fill={CREAM} />
          </g>
          <g className="shiba__ear">
            <g filter="url(#wobble)">
              <path d="M324 98 L 320 62 L 298 86 Z" {...solid(FUR)} />
              <path d="M319 92 L 317 72 L 304 86 Z" fill={CREAM} />
            </g>
          </g>
          <g filter="url(#wobble)">
            <ellipse cx="288" cy="120" rx="45" ry="38" {...solid(FUR)} />
            <path d="M246 128 C 252 150, 270 158, 288 158 C 306 158, 324 150, 330 128 C 318 136, 304 132, 288 136 C 272 132, 258 136, 246 128 Z" fill={CREAM} />
          </g>
          {/* the shiba's cream "eyebrow" spots */}
          <ellipse cx="273" cy="103" rx="5" ry="3.2" fill={CREAM} />
          <ellipse cx="303" cy="103" rx="5" ry="3.2" fill={CREAM} />
          <ellipse cx="258" cy="132" rx="6.5" ry="3.6" fill="#ffb3a8" opacity={0.8} />
          <ellipse cx="318" cy="132" rx="6.5" ry="3.6" fill="#ffb3a8" opacity={0.8} />
          <g className="shiba__open">
            <g className="shiba__look">
              <g className="shiba__blink">
                <ellipse cx="272" cy="116" rx="3.6" ry="4.4" fill={INK} />
                <ellipse cx="302" cy="116" rx="3.6" ry="4.4" fill={INK} />
                <circle cx="273.2" cy="114.4" r="1.2" fill="#ffffff" />
                <circle cx="303.2" cy="114.4" r="1.2" fill="#ffffff" />
              </g>
            </g>
          </g>
          {/* ^ ^ when it ships */}
          <path className="shiba__happy" d="M267 118 q5 -6 10 0 M297 118 q5 -6 10 0" {...line} strokeWidth={2} />
          <path d="M283.5 128 q4.5 -3 9 0 q-1 4 -4.5 4.5 q-3.5 -0.5 -4.5 -4.5 z" fill={INK} />
          <ellipse className="shiba__tongue" cx="290" cy="139.6" rx="3" ry="3.6" fill="#ff8fa6" stroke={INK} strokeWidth={1.2} />
          <path d="M288 132.5 v2.5 M288 135 q-3.5 3.5 -7 0.6 M288 135 q3.5 3.5 7 0.6" {...line} strokeWidth={1.6} />
        </g>
      </g>

      {/* the next idea: a little "?" */}
      <text
        className="shiba__q"
        x="336"
        y="70"
        transform="rotate(12 336 70)"
        textAnchor="middle"
        fontSize="32"
        fontWeight="800"
        fill="#e2442f"
        stroke={PAPER}
        strokeWidth="4"
        paintOrder="stroke"
      >
        ?
      </text>

      <g className="shiba__sparks">
        <Sparkle x={30} y={80} s={0.9} />
        <Sparkle x={214} y={78} s={1.1} />
        <Sparkle x={150} y={58} s={0.7} />
      </g>
    </svg>
  );
}
