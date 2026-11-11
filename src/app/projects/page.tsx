import type { Metadata } from "next";
import Link from "next/link";
import { areaOrder, areas, models, projects } from "@/data/projects";
import { toolkit } from "@/data/skills";
import { episodes } from "@/data/home";
import { Episode } from "@/components/ui/Episode";
import { ScreenSketch } from "@/components/projects/ScreenSketch";

export const metadata: Metadata = {
  title: "Work",
  description: "LLM agents, retrieval systems, full-stack apps and machine learning models by Anubrata De.",
};

export default function WorkPage() {
  return (
    <div className="page wrap">
      <header className="page__head">
        <Episode n={3} {...episodes.work} />
        <h1 className="page__title">Everything I&apos;ve built</h1>
        <p className="page__lead">
          {projects.length} projects with public code, from agents that do the analysis themselves to apps with logins, roles and
          background jobs.
        </p>
      </header>

      {areaOrder
        .filter((a) => projects.some((p) => p.area === a))
        .map((area) => (
          <section key={area} className="work-group" aria-labelledby={`area-${area}`}>
            <h2 id={`area-${area}`} className="work-group__title">
              {areas[area].label}
            </h2>
            <ul className="cards">
              {projects
                .filter((p) => p.area === area)
                .map((p) => (
                  <li key={p.slug}>
                    <Link href={`/projects/${p.slug}`} className="card">
                      <ScreenSketch slug={p.slug} label={p.name} className="card__shot" />
                      <span className="card__name">{p.name}</span>
                      <span className="card__summary">{p.summary}</span>
                      <span className="card__stack">{p.stack.slice(0, 4).join(", ")}</span>
                    </Link>
                  </li>
                ))}
            </ul>
          </section>
        ))}

      <section id="models" className="work-group" aria-labelledby="models-title">
        <h2 id="models-title" className="work-group__title">
          Side quests
        </h2>
        <ul className="quests__list quests__list--wide">
          {models.map((m) => (
            <li key={m.name}>
              <strong>{m.name}</strong>
              <span>
                {m.taskLabel}. {m.question}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="work-group" aria-labelledby="toolkit-title">
        <h2 id="toolkit-title" className="work-group__title">
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
    </div>
  );
}
