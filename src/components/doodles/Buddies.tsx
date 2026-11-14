import type { CSSProperties } from "react";

/**
 * Page buddies: small original characters that sit beside the page titles.
 *
 *   About: a bunny with a red bow, sitting on a stack of books. It waves hello with a
 *          よろしく! ("nice to meet you", the line that ends a self-introduction),
 *          blinks, wiggles its nose, twitches an ear and hops now and then.
 *   Work:  a chibi corgi puppy typing like a person, both paws on the keys. Code
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
          </g>
          {/* whiskers twitch along with the nose */}
          <path className="bunny__whiskers bunny__whiskers--left" d="M223 112 h-11 M223 116 l-10 3.4" {...line} strokeWidth={1.2} />
          <path className="bunny__whiskers bunny__whiskers--right" d="M281 112 h11 M281 116 l10 3.4" {...line} strokeWidth={1.2} />
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
  [50, 114, 44, "#ffc5d5"],
  [62, 126, 70, "#ffe27a"],
  [74, 138, 50, "#d6e6ff"],
  [74, 150, 84, "#cfe6b4"],
  [62, 162, 38, "#ffe27a"],
  [50, 174, 22, "#ffc5d5"],
] as const;

/**
 * A chibi corgi puppy typing like a person, after a clip of one doing exactly
 * that: it sits at the laptop with both front paws on the keys, tapping one
 * after the other, watching the screen, and turns to look at you now and then.
 */
export function PuppyBuddy() {
  const FUR = "#f4b265";
  const FUR_FAR = "#e9a254";
  const CREAM = "#fffaf0";
  const EAR_IN = "#ffd9c4";
  return (
    <svg viewBox="0 0 380 250" className="buddy" aria-hidden="true" focusable="false">
      {/* desk */}
      <rect x="12" y="240" width="356" height="10" fill="url(#tone-light)" />
      <path d="M8 232 H372 M12 240 H368" {...line} />

      {/* laptop, square to the viewer */}
      <g filter="url(#wobble)">
        <rect x="30" y="92" width="160" height="108" rx="8" {...solid(PAPER)} />
        <rect x="40" y="102" width="140" height="88" rx="4" fill="#2b2d42" stroke={INK} strokeWidth={1.8} />
        <circle cx="110" cy="97" r="1.6" fill={INK} />
        <path d="M24 200 H196 L 212 226 H8 Z" {...solid(PAPER)} />
        <path d="M8 226 H212 V230 H8 Z" {...solid(PAPER, 2)} />
        <path d="M30 207 H190 M24 214 H196 M19 220 H201" {...line} strokeWidth={1.4} strokeDasharray="6 4" opacity={0.55} />
      </g>
      {CODE.map(([x, y, w, c], i) => (
        <rect key={y} className={`code-line code-line--${i + 1}`} x={x} y={y} width={w} height="6" rx="3" fill={c} />
      ))}
      <g className="puppy__ship">
        <rect x="118" y="168" width="54" height="18" rx="9" {...solid("#cfe6b4", 1.6)} />
        <text x="145" y="181" textAnchor="middle" fontSize="10" fontWeight="700" fill={INK}>
          ✓ shipped
        </text>
      </g>

      {/* カタカタ ("kata kata"): the manga sound of typing */}
      <g className="puppy__sfx">
        <g className="puppy__sfx-jitter">
          <text
            x="104"
            y="76"
            transform="rotate(-6 104 76)"
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
        {/* both front paws reach onto the keyboard and tap in turn */}
        <g className="puppy__leg puppy__leg--far">
          <path d="M246 176 L 181 207" fill="none" stroke={INK} strokeWidth={15} strokeLinecap="round" />
          <path d="M246 176 L 181 207" fill="none" stroke="#f3ecdf" strokeWidth={10.5} strokeLinecap="round" />
          <ellipse cx="178" cy="208" rx="8.5" ry="6" {...solid("#f3ecdf", 2.2)} />
        </g>
        <g className="puppy__leg puppy__leg--near">
          <path d="M244 186 L 193 216" fill="none" stroke={INK} strokeWidth={16} strokeLinecap="round" />
          <path d="M244 186 L 193 216" fill="none" stroke={CREAM} strokeWidth={11.5} strokeLinecap="round" />
          <ellipse cx="190" cy="217" rx="9" ry="6.5" {...solid(CREAM, 2.2)} />
          <path d="M185.6 214 v4 M190.4 213.4 v5" {...line} strokeWidth={1.3} />
        </g>

        {/* a round little body with a fluffy chest and a big haunch */}
        <g filter="url(#wobble)">
          <path d="M228 232 C 220 204, 222 170, 244 154 C 262 142, 294 146, 306 166 C 320 190, 320 218, 312 232 Z" {...solid(FUR)} />
          <path d="M236 160 C 226 180, 226 212, 234 232 L 262 232 C 254 210, 252 182, 262 162 C 254 154, 242 154, 236 160 Z" fill={CREAM} />
          <path d="M228 232 C 220 204, 222 170, 244 154" {...line} />
          <ellipse cx="300" cy="210" rx="24" ry="21" {...solid(FUR)} />
          <ellipse cx="306" cy="229" rx="13" ry="5" {...solid(CREAM, 2.2)} />
        </g>

        {/* head turned toward the screen */}
        <g className="puppy__profile">
          <g className="puppy__tilt">
            <g filter="url(#wobble)">
              <path d="M226 86 C 216 64, 220 44, 232 38 C 244 46, 250 64, 246 80 Z" {...solid(FUR_FAR)} />
              <path d="M230 80 C 224 64, 226 50, 233 46 C 240 52, 243 64, 241 76 Z" fill={EAR_IN} />
              <g className="puppy__ear">
                <path d="M274 76 C 282 56, 296 44, 306 48 C 310 62, 304 80, 292 92 Z" {...solid(FUR)} />
                <path d="M279 76 C 285 62, 295 54, 302 55 C 304 66, 299 78, 291 86 Z" fill={EAR_IN} />
              </g>
              <ellipse cx="262" cy="108" rx="44" ry="40" {...solid(FUR)} />
              <path d="M222 116 C 226 138, 246 148, 264 148 C 284 148, 300 138, 304 120 C 292 128, 278 126, 266 130 C 252 126, 236 128, 222 116 Z" fill={CREAM} />
              <path d="M252 70 C 246 84, 240 98, 238 110 L 254 112 C 254 98, 256 84, 252 70 Z" fill={CREAM} />
              <ellipse cx="236" cy="120" rx="16" ry="11.5" {...solid(CREAM, 2)} />
            </g>
            <ellipse cx="248" cy="116" rx="5" ry="3" fill="#ffb3a8" opacity={0.85} />
            <ellipse cx="286" cy="116" rx="7" ry="4" fill="#ffb3a8" opacity={0.85} />
            <path d="M224 114 q5 -3 10 0 q-1 4.5 -5 5 q-4 -0.5 -5 -5 z" fill={INK} />
            <ellipse cx="227.6" cy="114.6" rx="1.6" ry="0.9" fill="#ffffff" opacity={0.8} />
            <path d="M229 121 v2 M229 123 q-3 3 -6 0.5 M229 123 q3 3 6 0.5" {...line} strokeWidth={1.5} />
            <g className="puppy__look">
              <g className="puppy__blink">
                <ellipse cx="242" cy="101" rx="5" ry="6.5" fill={INK} />
                <ellipse cx="272" cy="102" rx="5.5" ry="7" fill={INK} />
                <circle cx="243.8" cy="98.6" r="2" fill="#ffffff" />
                <circle cx="240.6" cy="104" r="1" fill="#ffffff" />
                <circle cx="274" cy="99.4" r="2.2" fill="#ffffff" />
                <circle cx="270.6" cy="105.2" r="1.1" fill="#ffffff" />
              </g>
            </g>
          </g>
        </g>

        {/* head turned to the viewer, pleased with itself */}
        <g className="puppy__front">
          <g filter="url(#wobble)">
            <path d="M226 88 C 214 66, 218 44, 230 38 C 244 46, 250 64, 246 82 Z" {...solid(FUR)} />
            <path d="M230 82 C 222 66, 224 52, 231 46 C 240 52, 243 64, 241 78 Z" fill={EAR_IN} />
            <path d="M298 88 C 310 66, 306 44, 294 38 C 280 46, 274 64, 278 82 Z" {...solid(FUR)} />
            <path d="M294 82 C 302 66, 300 52, 293 46 C 284 52, 281 64, 283 78 Z" fill={EAR_IN} />
            <ellipse cx="262" cy="108" rx="44" ry="40" {...solid(FUR)} />
            <path d="M220 116 C 224 138, 244 148, 262 148 C 280 148, 300 138, 304 116 C 292 126, 276 124, 262 128 C 248 124, 232 126, 220 116 Z" fill={CREAM} />
            <path d="M262 70 C 256 84, 252 98, 252 110 L 272 110 C 272 98, 268 84, 262 70 Z" fill={CREAM} />
            <ellipse cx="262" cy="121" rx="17" ry="11.5" {...solid(CREAM, 2)} />
          </g>
          <ellipse cx="238" cy="116" rx="7" ry="4" fill="#ffb3a8" opacity={0.85} />
          <ellipse cx="286" cy="116" rx="7" ry="4" fill="#ffb3a8" opacity={0.85} />
          <path d="M240 104 q6 -7 12 0 M272 104 q6 -7 12 0" {...line} strokeWidth={2.2} />
          <path d="M257 115 q5 -3 10 0 q-1 4.5 -5 5 q-4 -0.5 -5 -5 z" fill={INK} />
          <ellipse cx="264" cy="130" rx="3.2" ry="3.8" fill="#ff8fa6" stroke={INK} strokeWidth={1.2} />
          <path d="M262 120.6 v2.2 M262 122.8 q-3.4 3.4 -6.8 0.6 M262 122.8 q3.4 3.4 6.8 0.6" {...line} strokeWidth={1.6} />
        </g>
      </g>

      {/* the next idea: a little "?" */}
      <text
        className="puppy__q"
        x="324"
        y="50"
        transform="rotate(12 324 50)"
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
        <Sparkle x={20} y={84} s={0.9} />
        <Sparkle x={202} y={78} s={1.1} />
        <Sparkle x={150} y={60} s={0.7} />
      </g>
    </svg>
  );
}
