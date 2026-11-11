import Link from "next/link";
import { areas, neighbours, type Project } from "@/data/projects";
import { ProjectCover } from "./ProjectCover";
import { Pipeline } from "./Pipeline";
import { Label, RevealLines, delay } from "@/components/ui/RevealLines";
import { Icon } from "@/components/ui/Icon";

export function CaseStudy({ project }: { project: Project }) {
  const { previous, next } = neighbours(project.slug);
  const words = project.name.split(" ");
  const titleLines = words.length > 2 ? [words.slice(0, 2).join(" "), words.slice(2).join(" ")] : [project.name];

  return (
    <article className="page case" data-area={project.area}>
      <header className="case__hero wrap" data-scene="knot" data-scene-side="right">
        <nav className="case__crumb" aria-label="Breadcrumb" data-reveal>
          <Link href="/projects" className="text-link">
            <Icon name="left" /> All work
          </Link>
        </nav>
        <div data-reveal>
          <Label>
            <span className="swatch" aria-hidden="true" /> {areas[project.area].label}
            {project.context ? `, ${project.context}` : ""}
          </Label>
        </div>
        <RevealLines as="h1" className="page-title" lines={titleLines} />
        <p className="page-lede" data-reveal style={delay(0.2)}>
          {project.summary}
        </p>
        <div className="case__actions" data-reveal style={delay(0.3)}>
          <a href={project.code} className="pill pill--solid" target="_blank" rel="noopener noreferrer" data-magnetic>
            Code on GitHub <Icon name="external" />
          </a>
          {project.live && (
            <a href={project.live.href} className="pill" target="_blank" rel="noopener noreferrer">
              {project.live.label} <Icon name="external" />
            </a>
          )}
        </div>
      </header>

      <div className="case__cover wrap" data-reveal>
        <div className="case__cover-frame glass">
          <ProjectCover project={project} />
        </div>
      </div>

      <div className="case__body wrap" data-scene={project.steps ? "wave" : "globe"} data-scene-side="left">
        <section className="case__main glass" aria-labelledby="how-heading" data-reveal>
          <h2 id="how-heading" className="section-title">
            {project.steps ? "How it works" : "What's inside"}
          </h2>
          {project.steps && <Pipeline steps={project.steps} />}
          {project.parts && (
            <dl className="parts">
              {project.parts.map((part) => (
                <div key={part.title} className="parts__row">
                  <dt>{part.title}</dt>
                  <dd>{part.detail}</dd>
                </div>
              ))}
            </dl>
          )}
        </section>

        <aside className="case__side glass" data-reveal style={delay(0.1)}>
          <h2 className="side-title">Worth noting</h2>
          <ul className="notes">
            {project.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <h2 className="side-title">Built with</h2>
          <ul className="stack-list">
            {project.stack.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </aside>
      </div>

      <nav className="case__pager wrap" aria-label="More projects" data-scene="clusters" data-scene-side="center">
        <Link href={`/projects/${previous.slug}`} className="pager-link" data-cursor="view" data-cursor-label="Prev">
          <span className="label">Previous</span>
          <span className="pager-link__name">{previous.name}</span>
        </Link>
        <Link href={`/projects/${next.slug}`} className="pager-link pager-link--next" data-cursor="view" data-cursor-label="Next">
          <span className="label">Next</span>
          <span className="pager-link__name">{next.name}</span>
        </Link>
      </nav>
    </article>
  );
}
