import type { ReactNode } from "react";

const kanji = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];

/**
 * Section label styled like an anime episode card: 第一話 means "episode one".
 * The Japanese is decorative; the English title is what screen readers hear.
 */
export function Episode({ n, children }: { n: number; children: ReactNode }) {
  return (
    <p className="episode">
      <span className="episode__jp" aria-hidden="true">
        第{kanji[n - 1] ?? n}話
      </span>
      <span className="episode__title">{children}</span>
    </p>
  );
}
