const kanji = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];

/**
 * Section label styled like an anime episode card: 第一話 means "episode one",
 * followed by a Japanese word in romaji and its English meaning.
 */
export function Episode({ n, jp, en }: { n: number; jp: string; en: string }) {
  return (
    <p className="episode">
      <span className="episode__no" aria-hidden="true">
        第{kanji[n - 1] ?? n}話
      </span>
      <span className="episode__jp" lang="ja-Latn">
        {jp}
      </span>
      <span className="episode__en">({en})</span>
    </p>
  );
}
