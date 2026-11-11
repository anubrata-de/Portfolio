import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/data/site";
import { toolkit } from "@/data/skills";
import { FAQ } from "@/components/about/FAQ";
import { Curl, Label, RevealLines, delay } from "@/components/ui/RevealLines";

export const metadata: Metadata = {
  title: "About",
  description:
    "Anubrata De is a BS Data Science and Applications student at IIT Madras, Secretary of Nilgiri House, and builds LLM agents and full-stack apps.",
};

const habits = [
  {
    title: "Plan for the model failing",
    body: "Providers time out and rate-limit. The Data Analyst Agent falls back across Claude, GPT and Gemini; the TDS Virtual TA backs off on HTTP 429 and reports its own health.",
    href: "/projects/data-analyst-agent",
  },
  {
    title: "Make answers checkable",
    body: "The Virtual TA returns the forum posts and notes it drew on, and falls back to the top matches when the model forgets to cite.",
    href: "/projects/tds-virtual-ta",
  },
  {
    title: "Keep other people's keys out of storage",
    body: "Prompt2PPT uses a visitor's own API key in memory for one request and never writes it anywhere.",
    href: "/projects/prompt2ppt",
  },
  {
    title: "Do slow work in the background",
    body: "Reminder emails, monthly reports and CSV exports run as Celery jobs in ParkEase and the Placement Portal, so pages stay fast.",
    href: "/projects/placement-portal",
  },
];

export default function AboutPage() {
  return (
    <div className="page about">
      <section className="about-hero wrap" data-scene="globe" data-scene-side="right">
        <div data-reveal>
          <Label>
            Hi, I&apos;m {site.name}, and I care about
            <br />
            one thing more than most
          </Label>
        </div>
        <RevealLines
          as="h1"
          className="page-title about-hero__title"
          lines={[
            "Models don't matter",
            <>
              <Curl /> in a notebook.
            </>,
            "They matter when",
            <>
              <em>someone</em> uses them
            </>,
          ]}
        />
      </section>

      <section className="wrap about-facts" data-scene="globe" data-scene-side="left" aria-label="Background">
        {[
          {
            title: "Studying",
            body: `BS in Data Science and Applications at IIT Madras. The Data Analyst Agent and the TDS Virtual TA both started as work for the Tools in Data Science course.`,
          },
          { title: "Serving", body: "Secretary of Nilgiri House, one of the student houses of the IIT Madras BS programme, for 2025–26." },
          { title: "Looking for", body: "Internships in data science, machine learning or backend engineering." },
        ].map((f, i) => (
          <div key={f.title} className="about-fact glass" data-reveal style={delay(0.08 * i)}>
            <p className="label">{f.title}</p>
            <p>{f.body}</p>
          </div>
        ))}
      </section>

      <section className="wrap habits" data-scene="knot" data-scene-side="right" aria-labelledby="habits-title">
        <RevealLines id="habits-title" lines={["How I like", <em key="b">to build</em>]} />
        <ul className="habits__list">
          {habits.map((h, i) => (
            <li key={h.title} className="habit glass" data-reveal style={delay(0.06 * i)}>
              <h3 className="habit__title">{h.title}</h3>
              <p>{h.body}</p>
              <Link href={h.href} className="text-link">
                See the project
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="wrap toolkit" id="toolkit" data-scene="wave" data-scene-side="left" aria-labelledby="toolkit-title">
        <RevealLines id="toolkit-title" lines={["Toolkit"]} />
        <dl className="toolkit__list glass" data-reveal>
          {toolkit.map((row) => (
            <div key={row.group} className="toolkit__row">
              <dt>{row.group}</dt>
              <dd>{row.items.join(", ")}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="wrap about-faq" data-scene="clusters" data-scene-side="right" aria-labelledby="faq-title">
        <RevealLines id="faq-title" lines={["FAQ"]} />
        <FAQ />
      </section>
    </div>
  );
}
