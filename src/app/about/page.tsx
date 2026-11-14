import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/data/site";
import { toolkit } from "@/data/skills";
import { episodes } from "@/data/home";
import { achievements, arcs, languages, volunteering } from "@/data/journey";
import { Episode } from "@/components/ui/Episode";
import { FAQ } from "@/components/about/FAQ";
import { Ring, TileDoodle } from "@/components/doodles/Doodles";
import { BunnyBuddy } from "@/components/doodles/Buddies";

export const metadata: Metadata = {
  title: "About",
  description:
    "Anubrata De studies data science at IIT Madras (BS, 2023–2027), builds LLM agents and full-stack apps, led Nilgiri House as Secretary, and placed 2nd at the India College Chess Championship.",
};

const facts = [
  {
    title: "Studying",
    body: "BS in Data Science and Applications at IIT Madras, Sep 2023 to Aug 2027. The Data Analyst Agent and the Virtual Teaching Assistant both started as course work there.",
  },
  {
    title: "Languages",
    body: `${languages.fluent.join(", ")} fluently. ${languages.learning.join(" and ")} at a beginner level, so I can read the episode labels on this site.`,
  },
  { title: "Looking for", body: "Internships in data science, machine learning or backend engineering." },
];

const habits = [
  {
    title: "Plan for the model failing",
    body: "Providers time out and rate-limit. The Data Analyst Agent falls back across Claude, GPT and Gemini; the Virtual Teaching Assistant backs off on HTTP 429 and reports its own health.",
    href: "/projects/data-analyst-agent",
  },
  {
    title: "Make answers checkable",
    body: "The Virtual Teaching Assistant returns the forum posts and notes it drew on, and falls back to the top matches when the model forgets to cite.",
    href: "/projects/tds-virtual-ta",
  },
  {
    title: "Keep other people's keys out of storage",
    body: "Your Text, Your Style (Prompt2PPT) uses a visitor's own API key in memory for one request and never writes it anywhere.",
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
      <header className="page__head page__head--buddy">
        <div className="page__head-text">
          <Episode n={1} {...episodes.about} />
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
            cleaning, the model or LLM, the API around it and the screen on top. Outside of code I&apos;ve spent most of my time
            running student communities at IIT Madras.
          </p>
        </div>
        <div className="page__buddy">
          <BunnyBuddy />
        </div>
      </header>

      <ul className="index-cards">
        {facts.map((f) => (
          <li key={f.title} className="index-card">
            <h2 className="index-card__title">{f.title}</h2>
            <p>{f.body}</p>
          </li>
        ))}
      </ul>

      <section className="project__section" aria-labelledby="arcs-title">
        <h2 id="arcs-title" className="project__h2">
          Leadership and experience <span className="h2-note">story arcs so far</span>
        </h2>
        <ol className="arcs">
          {arcs.map((a, i) => (
            <li key={`${a.role}-${a.when}`} className="arc">
              <p className="arc__no">Arc {i + 1}</p>
              <div>
                <p className="arc__when">
                  {a.when}
                  <span className={`arc__kind arc__kind--${a.kind.toLowerCase()}`}>{a.kind}</span>
                </p>
                <h3 className="arc__role">
                  {a.role}, <span>{a.org}</span>
                </h3>
                <p className="arc__detail">{a.detail}</p>
                {a.points && (
                  <ul className="arc__points">
                    {a.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="project__section" aria-labelledby="quests-title">
        <h2 id="quests-title" className="project__h2">
          Volunteering <span className="h2-note">side quests</span>
        </h2>
        <ul className="quests">
          {volunteering.map((v) => (
            <li key={v.event} className="quest">
              <span className="tape" aria-hidden="true" />
              <p className="quest__when">{v.when}</p>
              <h3 className="quest__role">{v.role}</h3>
              <p className="quest__event">{v.event}</p>
              <p className="quest__detail">{v.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="project__section" aria-labelledby="trophies-title">
        <h2 id="trophies-title" className="project__h2">
          Achievements <span className="h2-note">trophy shelf</span>
        </h2>
        <div className="shelf">
          {achievements.map((g) => (
            <section key={g.name} className="shelf__group" aria-labelledby={`shelf-${g.doodle}`}>
              <h3 id={`shelf-${g.doodle}`} className="shelf__name">
                <TileDoodle name={g.doodle} className="shelf__doodle" />
                {g.name}
              </h3>
              <ul className="shelf__items">
                {g.items.map((t) => (
                  <li key={`${t.title}-${t.meta}`} className="trophy">
                    <span className={`medal medal--${t.tone}`}>{t.badge}</span>
                    <span>
                      <span className="trophy__title">{t.title}</span>
                      <span className="trophy__meta">{t.meta}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>

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
        <a href={site.social[1].href} className="button button--ghost" target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
        <a href={site.social[0].href} className="button button--ghost" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </p>
    </div>
  );
}
