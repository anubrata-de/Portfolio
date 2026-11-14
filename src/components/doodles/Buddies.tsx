import type { CSSProperties } from "react";

/**
 * Page buddies: small original characters that sit beside the page titles.
 *
 *   About: a bunny with a red bow, sitting on a stack of books. It waves hello with a
 *          よろしく! ("nice to meet you", the line that ends a self-introduction),
 *          blinks, wiggles its nose, twitches an ear and hops now and then.
 *   Work:  a corgi typing at a laptop like a person, both paws on the keys. Code
 *          fills the screen to a manga カタカタ ("tap tap"); it ships it and turns
 *          to look at you, pleased; then tilts its head at a "?" and starts again.
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
            {/* left arm, resting at its side */}
            <ellipse cx="224.5" cy="166" rx="8.5" ry="16" transform="rotate(9.5 224.5 166)" {...solid(FUR)} />
            <circle cx="252" cy="108" r="36" {...solid(FUR)} />
            <path d="M222 112 h-10 M222 116 l-9 3 M282 112 h10 M282 116 l9 3" {...line} strokeWidth={1.2} />
          </g>
          {/* a red bow under the chin */}
          <g filter="url(#wobble)">
            <path d="M250 149 L 244 163 L 251 159 Z" {...solid("#e2442f", 1.8)} />
            <path d="M254 149 L 260 163 L 253 159 Z" {...solid("#e2442f", 1.8)} />
            <path d="M252 146 C 240 136, 228 138, 230 147 C 232 156, 244 154, 252 146 Z" {...solid("#e2442f", 2)} />
            <path d="M252 146 C 264 136, 276 138, 274 147 C 272 156, 260 154, 252 146 Z" {...solid("#e2442f", 2)} />
            <circle cx="252" cy="146" r="4.2" {...solid("#c7351f", 1.8)} />
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

          {/* right arm: the twin of the left one, until it swings up to wave */}
          <g className="bunny__arm">
            <ellipse cx="279.5" cy="166" rx="8.5" ry="16" transform="rotate(-9.5 279.5 166)" {...solid(FUR)} filter="url(#wobble)" />
            <circle cx="279.6" cy="176.6" r="1.4" fill={PINK} />
            <circle cx="284.4" cy="177.4" r="1.4" fill={PINK} />
            <circle cx="282" cy="180.2" r="1.9" fill={PINK} />
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
  [40, 112, 40, "#ffc5d5"],
  [50, 124, 62, "#ffe27a"],
  [60, 136, 44, "#d6e6ff"],
  [60, 148, 72, "#cfe6b4"],
  [50, 160, 34, "#ffe27a"],
  [40, 172, 20, "#ffc5d5"],
] as const;

/**
 * A corgi typing like a person, after a clip of one doing exactly that: it sits
 * side-on at the laptop with both front paws on the keyboard, tapping one after
 * the other, head in profile watching the screen, and turns to look straight at
 * you now and then.
 */
export function PuppyBuddy() {
  const FUR = "#f0a04b";
  const FUR_FAR = "#dd8a36";
  const CREAM = "#fffaf0";
  return (
    <svg viewBox="0 0 380 250" className="buddy" aria-hidden="true" focusable="false">
      {/* desk */}
      <rect x="12" y="240" width="356" height="10" fill="url(#tone-light)" />
      <path d="M8 232 H372 M12 240 H368" {...line} />

      {/* laptop, turned a little toward the corgi */}
      <g filter="url(#wobble)">
        <path d="M22 190 L 152 202 L 190 228 L 34 228 Z" {...solid(PAPER)} />
        <path d="M34 228 H190 V232 H34 Z" {...solid(PAPER, 2)} />
        <path d="M29 199 L 158 210 M33 207 L 165 216 M36 215 L 172 222" {...line} strokeWidth={1.4} strokeDasharray="6 4" opacity={0.55} />
        <path d="M22 92 L 152 80 L 152 202 L 22 190 Z" {...solid(PAPER)} />
        <path d="M31 100 L 143 90.5 L 143 193 L 31 182.5 Z" fill="#2b2d42" stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
        <circle cx="87" cy="88" r="1.6" fill={INK} />
      </g>
      {CODE.map(([x, y, w, c], i) => (
        <rect key={y} className={`code-line code-line--${i + 1}`} x={x} y={y} width={w} height="6" rx="3" fill={c} />
      ))}
      <g className="puppy__ship">
        <rect x="84" y="166" width="54" height="18" rx="9" {...solid("#cfe6b4", 1.6)} />
        <text x="111" y="179" textAnchor="middle" fontSize="10" fontWeight="700" fill={INK}>
          ✓ shipped
        </text>
      </g>

      {/* カタカタ ("kata kata"): the manga sound of typing */}
      <g className="puppy__sfx">
        <g className="puppy__sfx-jitter">
          <text
            x="92"
            y="66"
            transform="rotate(-6 92 66)"
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

      <g className="puppy">
        {/* both front legs reach onto the keyboard and tap in turn */}
        <g className="puppy__leg puppy__leg--far">
          <path d="M216 176 L 151 205" fill="none" stroke={INK} strokeWidth={16} strokeLinecap="round" />
          <path d="M216 176 L 151 205" fill="none" stroke="#f3ecdf" strokeWidth={11.5} strokeLinecap="round" />
          <ellipse cx="148" cy="206" rx="9" ry="6" {...solid("#f3ecdf", 2.2)} />
        </g>
        <g className="puppy__leg puppy__leg--near">
          <path d="M214 186 L 167 216" fill="none" stroke={INK} strokeWidth={17} strokeLinecap="round" />
          <path d="M214 186 L 167 216" fill="none" stroke={CREAM} strokeWidth={12.5} strokeLinecap="round" />
          <ellipse cx="164" cy="217" rx="9.5" ry="6.5" {...solid(CREAM, 2.2)} />
          <path d="M159.5 214 v4 M164.5 213.4 v5" {...line} strokeWidth={1.3} />
        </g>

        {/* sitting body: fluffy chest in front, big haunch behind */}
        <g filter="url(#wobble)">
          <path d="M206 232 C 194 206, 188 170, 198 148 C 206 128, 230 116, 252 120 C 278 128, 302 190, 296 232 Z" {...solid(FUR)} />
          <path d="M200 146 C 190 172, 194 206, 206 232 L 232 232 C 222 206, 218 174, 226 148 C 220 138, 208 138, 200 146 Z" fill={CREAM} />
          <path d="M206 232 C 194 206, 188 170, 198 148" {...line} />
          <ellipse cx="276" cy="206" rx="30" ry="25" {...solid(FUR)} />
          <path d="M262 196 c6 -4 14 -4 20 0" {...line} strokeWidth={1.4} opacity={0.5} />
          <ellipse cx="282" cy="229" rx="15" ry="5.5" {...solid(CREAM, 2.2)} />
        </g>

        {/* head in profile, watching the screen */}
        <g className="puppy__profile">
          <g className="puppy__tilt">
            <g filter="url(#wobble)">
              <path d="M218 86 L 222 44 L 240 80 Z" {...solid(FUR_FAR)} />
              <g className="puppy__ear">
                <path d="M232 88 L 244 46 L 258 92 Z" {...solid(FUR)} />
                <path d="M238 84 L 245 58 L 253 88 Z" fill={CREAM} />
              </g>
              <path d="M240 84 C 224 74, 202 78, 194 94 C 190 100, 184 103, 178 105 C 170 107, 166 114, 170 120 C 174 126, 186 128, 196 128 C 206 138, 232 140, 246 128 C 258 116, 256 94, 240 84 Z" fill={FUR} />
              <path d="M192 108 C 186 110, 178 111, 173 112 C 167 115, 167 120, 171 122 C 177 126, 188 128, 197 128 C 207 134, 221 133, 224 124 C 224 115, 208 107, 192 108 Z" fill={CREAM} />
              <path d="M240 84 C 224 74, 202 78, 194 94 C 190 100, 184 103, 178 105 C 170 107, 166 114, 170 120 C 174 126, 186 128, 196 128 C 206 138, 232 140, 246 128 C 258 116, 256 94, 240 84 Z" {...line} />
            </g>
            <ellipse cx="169" cy="114.2" rx="4.6" ry="3.8" fill={INK} />
            <path d="M173 123.5 C 179 127, 187 127, 193 124" {...line} strokeWidth={1.6} />
            <ellipse cx="214" cy="117" rx="6" ry="3.4" fill="#ffb3a8" opacity={0.8} />
            <g className="puppy__look">
              <g className="puppy__blink">
                <ellipse cx="206" cy="101" rx="3.4" ry="4.2" fill={INK} />
                <circle cx="207.2" cy="99.6" r="1.1" fill="#ffffff" />
              </g>
            </g>
          </g>
        </g>

        {/* head turned to the viewer, pleased with itself */}
        <g className="puppy__front">
          <g filter="url(#wobble)">
            <path d="M186 92 L 186 44 L 212 80 Z" {...solid(FUR)} />
            <path d="M190 86 L 190 56 L 206 80 Z" fill={CREAM} />
            <path d="M246 92 L 246 44 L 220 80 Z" {...solid(FUR)} />
            <path d="M242 86 L 242 56 L 226 80 Z" fill={CREAM} />
            <ellipse cx="216" cy="110" rx="37" ry="32" {...solid(FUR)} />
            <path d="M216 82 C 212 94, 206 106, 204 118 C 208 134, 224 134, 228 118 C 226 106, 220 94, 216 82 Z" fill={CREAM} />
            <ellipse cx="216" cy="125" rx="17" ry="11" fill={CREAM} />
          </g>
          <ellipse cx="194" cy="120" rx="6" ry="3.4" fill="#ffb3a8" opacity={0.8} />
          <ellipse cx="238" cy="120" rx="6" ry="3.4" fill="#ffb3a8" opacity={0.8} />
          <path d="M196 110 q6 -7 12 0 M224 110 q6 -7 12 0" {...line} strokeWidth={2} />
          <path d="M211.5 119 q4.5 -3 9 0 q-1 4 -4.5 4.5 q-3.5 -0.5 -4.5 -4.5 z" fill={INK} />
          <ellipse cx="218" cy="131" rx="3" ry="3.6" fill="#ff8fa6" stroke={INK} strokeWidth={1.2} />
          <path d="M216 123.5 v2.2 M216 125.7 q-3.4 3.4 -6.8 0.6 M216 125.7 q3.4 3.4 6.8 0.6" {...line} strokeWidth={1.6} />
        </g>
      </g>

      {/* the next idea: a little "?" */}
      <text
        className="puppy__q"
        x="270"
        y="52"
        transform="rotate(12 270 52)"
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

      <g className="puppy__sparks">
        <Sparkle x={14} y={78} s={0.9} />
        <Sparkle x={166} y={68} s={1.1} />
        <Sparkle x={128} y={50} s={0.7} />
      </g>
    </svg>
  );
}
