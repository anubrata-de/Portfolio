import type { Metadata } from "next";
import Link from "next/link";
import { areas, projects } from "@/data/projects";
import { Carousel } from "@/components/projects/Carousel";
import { Models } from "@/components/home/Models";
import { Label, RevealLines, delay } from "@/components/ui/RevealLines";

export const metadata: Metadata = {
  title: "Work",
  description:
    "LLM agents, retrieval apps, full-stack Flask and Vue projects and machine learning models by Anubrata De.",
};

export default function ProjectsPage() {
  return (
    <div className="page">
      <section className="work-hero wrap" data-scene="clusters" data-scene-side="right">
        <div data-reveal>
          <Label>Work, {projects.length} projects</Label>
        </div>
        <RevealLines as="h1" className="page-title" lines={["Things I've", <em key="b">built</em>]} />
      </section>

      <section className="wrap" data-scene="clusters" data-scene-side="center" aria-label="Project carousel">
        <Carousel />
      </section>

      <section className="wrap work-index" data-scene="knot" data-scene-side="right" aria-labelledby="index-title">
        <h2 id="index-title" className="section-title" data-reveal>
          Every project
        </h2>
        <ul className="index glass">
          {projects.map((p, i) => (
            <li key={p.slug} data-reveal style={delay(0.03 * i)}>
              <Link href={`/projects/${p.slug}`} className="index__row" data-area={p.area}>
                <span className="index__name">{p.name}</span>
                <span className="index__summary">{p.summary}</span>
                <span className="index__kind">
                  <span className="swatch" aria-hidden="true" />
                  {areas[p.area].label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="wrap" data-scene="wave" data-scene-side="left">
        <Models headingLevel={2} />
      </div>
    </div>
  );
}
