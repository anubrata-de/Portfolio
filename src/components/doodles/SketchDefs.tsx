/**
 * Shared SVG definitions, rendered once in the layout.
 * - #wobble gives doodles a slightly uneven, hand-inked line.
 * - #tone is a manga screentone dot pattern for shading.
 */
export function SketchDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
      <defs>
        <filter id="wobble" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.4" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <pattern id="tone" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
          <circle cx="3.5" cy="3.5" r="1.25" fill="#1d1b22" />
        </pattern>
        <pattern id="tone-light" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
          <circle cx="3.5" cy="3.5" r="0.8" fill="#1d1b22" opacity="0.55" />
        </pattern>
      </defs>
    </svg>
  );
}
