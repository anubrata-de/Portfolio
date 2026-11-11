import type { CSSProperties, ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * A headline whose lines slide up out of masks when it scrolls into view,
 * then bend away as it leaves (data-warp). Pass each line as an array item.
 */
export function RevealLines({
  as: Tag = "h2",
  lines,
  className,
  id,
  delay = 0,
  warp = true,
}: {
  as?: ElementType;
  lines: ReactNode[];
  className?: string;
  id?: string;
  delay?: number;
  warp?: boolean;
}) {
  return (
    <Tag
      id={id}
      className={cn("display", className)}
      data-reveal="lines"
      data-warp={warp ? "" : undefined}
      style={{ "--d": `${delay}s` } as CSSProperties}
    >
      {lines.map((line, i) => (
        <span key={i} className="line-mask">
          <span style={{ "--i": i } as CSSProperties}>{line}</span>
        </span>
      ))}
    </Tag>
  );
}

/** Small label in the mono face. */
export function Label({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("label", className)}>{children}</p>;
}

/** Inline style that delays a reveal by `s` seconds. */
export const delay = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

export function Curl() {
  return (
    <span className="curl" aria-hidden="true">
      ↪
    </span>
  );
}
