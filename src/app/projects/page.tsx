import type { Metadata } from "next";
import Link from "next/link";
import { categories, projects } from "@/data/projects";
import { episodes } from "@/data/home";
import { Episode } from "@/components/ui/Episode";
import { ScreenSketch } from "@/components/projects/ScreenSketch";

export const metadata: Metadata = {
  title: "Work",
  description: "LLM agents, full-stack apps, machine learning models and analysis by Anubrata De.",
};

const kebab = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

export default function WorkPage() {
  return (
    <div className="page wrap">
      <header className="page__head">
        <Episode n={3} {...episodes.work} />
        <h1 className="page__title">Everything I&apos;ve built</h1>
        <p className="page__lead">
          {projects.length} projects, each with its code on GitHub. This list updates itself from my repositories every day.
        </p>
      </header>

      {categories
        .filter((c) => projects.some((p) => p.category === c))
        .map((category) => (
          <section key={category} className="work-group" aria-labelledby={`cat-${kebab(category)}`}>
            <h2 id={`cat-${kebab(category)}`} className="work-group__title">
              {category}
            </h2>
            <ul className="cards">
              {projects
                .filter((p) => p.category === category)
                .map((p) => (
                  <li key={p.slug}>
                    <Link href={`/projects/${p.slug}`} className="card">
                      <ScreenSketch slug={p.slug} category={p.category} label={p.title} className="card__shot" />
                      <span className="card__name">{p.title}</span>
                      {p.tagline && <span className="card__tagline">{p.tagline}</span>}
                      <span className="card__summary">{p.summary}</span>
                      {p.tags.length > 0 && <span className="card__stack">{p.tags.join(", ")}</span>}
                    </Link>
                  </li>
                ))}
            </ul>
          </section>
        ))}
    </div>
  );
}
