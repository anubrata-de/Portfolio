import Link from "next/link";
import { models, projects } from "@/data/projects";
import { site } from "@/data/site";
import { RevealLines, delay } from "@/components/ui/RevealLines";

const groups = [
  {
    name: "IIT Madras",
    href: "https://study.iitm.ac.in/ds/",
    items: [
      { label: "BS in Data Science and Applications", value: "Studying" },
      { label: "Secretary, Nilgiri House", value: "2025–26" },
      { label: "Projects started in Tools in Data Science", value: "2" },
    ],
  },
  {
    name: "On GitHub",
    href: site.social[0].href,
    items: [
      { label: "Projects with public code", value: String(projects.length) },
      { label: "Agents and LLM apps", value: String(projects.filter((p) => p.area === "agents" || p.area === "llm").length) },
      { label: "Full-stack apps", value: String(projects.filter((p) => p.area === "web").length) },
    ],
  },
  {
    name: "Models and APIs",
    href: "/projects#models",
    items: [
      { label: "Supervised ML models", value: String(models.length) },
      { label: "LLM providers integrated", value: "4" },
      { label: "Background job schedulers shipped", value: "2" },
    ],
  },
];

export function Milestones() {
  return (
    <section className="milestones" data-scene="globe" data-scene-side="left" aria-labelledby="milestones-title">
      <div className="wrap milestones__inner">
        <div className="section-intro" data-parallax>
          <RevealLines id="milestones-title" lines={["Milestones"]} />
          <p data-reveal style={delay(0.15)}>
            Studying, running a student house and shipping code.
          </p>
        </div>
        <div className="milestones__groups">
          {groups.map((g, gi) => (
            <div key={g.name} className="milestones__group glass" data-reveal style={delay(0.08 * gi)}>
              {g.href.startsWith("/") ? (
                <Link href={g.href} className="milestones__name">
                  <span>{g.name}</span>
                  <span className="milestones__count">[{g.items.length}]</span>
                </Link>
              ) : (
                <a href={g.href} className="milestones__name" target="_blank" rel="noopener noreferrer">
                  <span>{g.name}</span>
                  <span className="milestones__count">[{g.items.length}]</span>
                </a>
              )}
              <ul>
                {g.items.map((item) => (
                  <li key={item.label}>
                    <span>{item.label}</span>
                    <span className="milestones__value">{item.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
