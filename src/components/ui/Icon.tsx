import { cn } from "@/lib/cn";

/**
 * Arrows and small marks drawn as SVG. Unicode arrows (↪ ⟶ ↳ ↗) fall back to
 * whatever font the system has, so they look different on every machine.
 */
export type IconName = "curl" | "return" | "long" | "external" | "left" | "right" | "down" | "close" | "sound" | "muted";

const paths: Record<IconName, { viewBox: string; d: string; fill?: boolean }> = {
  curl: { viewBox: "0 0 24 24", d: "M5 4v7a4 4 0 0 0 4 4h10m-4-4 4 4-4 4" },
  return: { viewBox: "0 0 24 24", d: "M6 4v8a3 3 0 0 0 3 3h9m-3.5-3.5L18 15l-3.5 3.5" },
  long: { viewBox: "0 0 48 24", d: "M2 12h42m-6-6 6 6-6 6" },
  external: { viewBox: "0 0 24 24", d: "M7 17 17 7m-8 0h8v8" },
  left: { viewBox: "0 0 24 24", d: "M19 12H5m6-6-6 6 6 6" },
  right: { viewBox: "0 0 24 24", d: "M5 12h14m-6-6 6 6-6 6" },
  down: { viewBox: "0 0 24 24", d: "M12 5v14m-6-6 6 6 6-6" },
  close: { viewBox: "0 0 24 24", d: "M6 6l12 12M18 6 6 18" },
  sound: { viewBox: "0 0 24 24", d: "M4 9.5h3.5L12 5.5v13L7.5 14.5H4zM15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" },
  muted: { viewBox: "0 0 24 24", d: "M4 9.5h3.5L12 5.5v13L7.5 14.5H4zM16 9.5l5 5m0-5-5 5" },
};

export function Icon({ name, className }: { name: IconName; className?: string }) {
  const p = paths[name];
  return (
    <svg
      className={cn("icon", `icon--${name}`, className)}
      viewBox={p.viewBox}
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth={name === "long" ? 1.6 : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={p.d} />
    </svg>
  );
}
