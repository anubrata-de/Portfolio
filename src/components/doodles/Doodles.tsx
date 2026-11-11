import type { SVGProps } from "react";

/** Small hand-drawn marks used around the page. All decorative. */

const ink = { fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

type P = SVGProps<SVGSVGElement>;

/** A loose marker underline, sized to whatever it sits under. */
export function Scribble(props: P) {
  return (
    <svg viewBox="0 0 200 16" preserveAspectRatio="none" aria-hidden="true" {...props}>
      <path d="M3 10 C 40 4, 80 13, 120 7 S 180 6, 197 9" {...ink} strokeWidth={3} />
      <path d="M20 13 C 60 9, 110 14, 170 11" {...ink} strokeWidth={2} opacity={0.6} />
    </svg>
  );
}

/** A red-pen circle around a word. */
export function Ring(props: P) {
  return (
    <svg viewBox="0 0 220 90" preserveAspectRatio="none" aria-hidden="true" {...props}>
      <path d="M150 8 C 70 2, 10 18, 8 46 C 6 74, 70 86, 128 82 C 190 78, 214 60, 210 38 C 206 16, 160 6, 96 12" {...ink} strokeWidth={2.6} />
    </svg>
  );
}

export function Arrow(props: P) {
  return (
    <svg viewBox="0 0 80 60" aria-hidden="true" {...props}>
      <path d="M6 10 C 20 40, 44 50, 70 46" {...ink} />
      <path d="M58 36 L 71 46 L 57 54" {...ink} />
    </svg>
  );
}

export function Star(props: P) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" {...props}>
      <path d="M20 4 L 23 16 L 36 20 L 23 24 L 20 36 L 17 24 L 4 20 L 17 16 Z" {...ink} strokeWidth={2} />
    </svg>
  );
}

export function Petal(props: P) {
  return (
    <svg viewBox="0 0 30 30" aria-hidden="true" {...props}>
      <path d="M15 4 C 24 8, 26 18, 15 26 C 4 18, 6 8, 15 4 Z" fill="#ffc9d6" stroke="currentColor" strokeWidth={1.6} />
      <path d="M15 8 L 15 14" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" />
    </svg>
  );
}

const tileDoodles = {
  tram: (
    <>
      <rect x="6" y="10" width="28" height="20" rx="4" {...ink} />
      <path d="M6 18 H34 M14 10 V18 M26 10 V18 M20 4 L 16 10 M20 4 L 24 10" {...ink} />
      <circle cx="12" cy="33" r="2.5" {...ink} />
      <circle cx="28" cy="33" r="2.5" {...ink} />
    </>
  ),
  moon: (
    <>
      <path d="M26 6 A 14 14 0 1 0 34 26 A 11 11 0 1 1 26 6 Z" fill="#ffe680" stroke="currentColor" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M8 8 l2 2 m0 -2 l-2 2" {...ink} strokeWidth={1.6} />
    </>
  ),
  play: (
    <>
      <rect x="4" y="8" width="32" height="22" rx="3" {...ink} />
      <path d="M17 14 L 25 19 L 17 24 Z" fill="currentColor" />
      <path d="M14 35 H26" {...ink} />
    </>
  ),
  badge: (
    <>
      <path d="M20 4 L 33 9 V 20 C 33 28, 27 33, 20 36 C 13 33, 7 28, 7 20 V 9 Z" {...ink} />
      <path d="M14 20 L 18 24 L 26 15" {...ink} />
    </>
  ),
  brackets: (
    <>
      <path d="M14 8 C 8 8, 11 18, 6 20 C 11 22, 8 32, 14 32" {...ink} />
      <path d="M26 8 C 32 8, 29 18, 34 20 C 29 22, 32 32, 26 32" {...ink} />
      <circle cx="20" cy="20" r="1.8" fill="currentColor" />
    </>
  ),
  spark: (
    <>
      <path d="M22 4 L 10 22 H 20 L 17 36 L 30 16 H 20 Z" fill="#ffe680" stroke="currentColor" strokeWidth={2.2} strokeLinejoin="round" />
    </>
  ),
  cup: (
    <>
      <path d="M8 14 H28 V 26 C 28 31, 24 34, 18 34 C 12 34, 8 31, 8 26 Z" {...ink} />
      <path d="M28 17 C 34 17, 34 25, 28 25" {...ink} />
      <path d="M14 5 C 12 8, 16 9, 14 12 M21 5 C 19 8, 23 9, 21 12" {...ink} strokeWidth={1.8} />
    </>
  ),
} as const;

export type TileDoodleName = keyof typeof tileDoodles;

export function TileDoodle({ name, ...props }: P & { name: TileDoodleName }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" filter="url(#wobble)" {...props}>
      {tileDoodles[name]}
    </svg>
  );
}

/** Hand-drawn icons for the connect menu and footer. */
const socialDoodles = {
  GitHub: <path d="M14 10 L 5 20 L 14 30 M26 10 L 35 20 L 26 30 M22 7 L 18 33" {...ink} />,
  LinkedIn: (
    <>
      <rect x="6" y="12" width="28" height="20" rx="3" {...ink} />
      <path d="M15 12 V 8 H 25 V 12 M6 20 H34" {...ink} />
    </>
  ),
  Instagram: (
    <>
      <rect x="6" y="9" width="28" height="23" rx="5" {...ink} />
      <circle cx="20" cy="20.5" r="6" {...ink} />
      <path d="M28 13.5 h0.1" {...ink} strokeWidth={3} />
    </>
  ),
  Email: (
    <>
      <rect x="5" y="10" width="30" height="21" rx="3" {...ink} />
      <path d="M6 12 L 20 23 L 34 12" {...ink} />
    </>
  ),
} as const;

export type SocialName = keyof typeof socialDoodles;

export function SocialDoodle({ name, ...props }: P & { name: SocialName }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" {...props}>
      {socialDoodles[name]}
    </svg>
  );
}
