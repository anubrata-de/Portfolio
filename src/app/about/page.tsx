import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/data/site";
import { toolkit } from "@/data/skills";
import { Episode } from "@/components/ui/Episode";
import { FAQ } from "@/components/about/FAQ";
import { Ring } from "@/components/doodles/Doodles";

export const metadata: Metadata = {
  title: "About",
  description:
    "Anubrata De is a BS Data Science and Applications student at IIT Madras, Secretary of Nilgiri House, and builds LLM agents and full-stack apps.",
};

const facts = [
  {
    title: "Studying",
    body: "BS in Data Science and Applications at IIT Madras. The Data Analyst Agent and the TDS Virtual TA both started as work for the Tools in Data Science course.",
  },
  { title: "Serving", body: "Secretary of Nilgiri House, one of the student houses of the IIT Madras BS programme, for 2025–26." },
  { title: "Looking for", body: "Internships in data science, machine learning or backend engineering." },
];

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
    <div className="page wrap about">
      <header className="page__head">
        <Episode n={1}>About</Episode>
        <h1 className="page__title">
          Hi, I&apos;m{" "}
          <span className="ringed">
            Anubrata
            <Ring className="ringed__ring" />
          </span>
          .
        </h1>
        <p className="page__lead">
          I like the part where a model leaves the notebook and someone actually uses it. So I build the whole path: the data
          cleaning, the model or LLM, the API around it and the screen on top.
        </p>
      </header>

      <ul className="index-cards">
        {facts.map((f) => (
          <li key={f.title} className="index-card">
            <h2 className="index-card__title">{f.title}</h2>
            <p>{f.body}</p>
          </li>
        ))}
      </ul>

      <section className="project__section" aria-labelledby="habits-title">
        <h2 id="habits-title" className="project__h2">
          How I like to build
        </h2>
        <ul className="parts">
          {habits.map((h) => (
            <li key={h.title}>
              <h3>{h.title}</h3>
              <p>{h.body}</p>
              <Link href={h.href} className="text-link">
                See the project
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="project__section" aria-labelledby="toolkit-title">
        <h2 id="toolkit-title" className="project__h2">
          Toolkit
        </h2>
        <dl className="toolkit">
          {toolkit.map((g) => (
            <div key={g.group}>
              <dt>{g.group}</dt>
              <dd>{g.items.join(", ")}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="project__section" aria-labelledby="faq-title">
        <h2 id="faq-title" className="project__h2">
          Questions people ask
        </h2>
        <FAQ />
      </section>

      <p className="about__end">
        <Link href="/contact" className="button">
          Get in touch
        </Link>
        <a href={site.social[0].href} className="button button--ghost" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </p>
    </div>
  );
}
