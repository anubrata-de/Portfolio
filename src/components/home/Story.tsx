import Link from "next/link";
import { Curl, RevealLines, delay } from "@/components/ui/RevealLines";
import type { ShapeName } from "@/lib/scene/shapes";
import type { ReactNode } from "react";

type Chapter = {
  id: string;
  pill: string;
  scene: ShapeName;
  side: "left" | "right";
  lines: ReactNode[];
  body: string;
  link?: { href: string; label: string };
};

const chapters: Chapter[] = [
  {
    id: "approach",
    pill: "Approach",
    scene: "wave",
    side: "left",
    lines: [
      <>
        <em>I</em> build <Curl />
      </>,
      "more than",
      "notebooks",
    ],
    body: "Scraping and cleaning the data, modelling it, then the API, the background jobs and the screen someone actually uses. I like owning the whole path.",
  },
  {
    id: "agents",
    pill: "Agents",
    scene: "knot",
    side: "right",
    lines: [
      "Models",
      <>
        <em>that</em> finish
      </>,
      <>
        <Curl /> the job
      </>,
    ],
    body: "The Data Analyst Agent reads a question, finds its own sources, scrapes and parses them, works out the analysis and answers in JSON. When one model stalls, it falls back to the next.",
    link: { href: "/projects/data-analyst-agent", label: "How the agent works" },
  },
  {
    id: "retrieval",
    pill: "Retrieval",
    scene: "clusters",
    side: "left",
    lines: [
      "Answers",
      <>
        <em>you can</em>
      </>,
      <>
        check <Curl />
      </>,
    ],
    body: "The TDS Virtual TA embeds a student's question, finds the closest forum posts and course notes, and links them under its answer. If nothing scores high enough, it says so instead of guessing.",
    link: { href: "/projects/tds-virtual-ta", label: "See the Virtual TA" },
  },
];

export function Story() {
  return (
    <>
      {chapters.map((c) => (
        <section
          key={c.id}
          id={c.id}
          className={`chapter chapter--${c.side === "left" ? "right-text" : "left-text"}`}
          data-scene={c.scene}
          data-scene-side={c.side}
          aria-labelledby={`${c.id}-title`}
        >
          <div className="chapter__inner wrap">
            <div className="chapter__copy">
              <span className="tag" data-reveal>
                {c.pill}
              </span>
              <RevealLines id={`${c.id}-title`} className="chapter__title" lines={c.lines} />
              <div data-parallax>
                <p className="chapter__body" data-reveal style={delay(0.25)}>
                  {c.body}
                </p>
                {c.link && (
                  <p data-reveal style={delay(0.35)}>
                    <Link href={c.link.href} className="text-link">
                      {c.link.label}
                    </Link>
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
