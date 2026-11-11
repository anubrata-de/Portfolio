import Link from "next/link";
import { areas, neighbours, type Project } from "@/data/projects";
import { ScreenSketch } from "@/components/projects/ScreenSketch";

/** A single project page: what it does, how it works, and where the code is. */
export function ProjectFile({ project: p }: { project: Project }) {
  const { previous, next } = neighbours(p.slug);
  return (
    <article className="page wrap">
      <header className="page__head">
        <p className="project__crumbs">
          <Link href="/projects">Work</Link> / {areas[p.area].label}
        </p>
        <h1 className="page__title">{p.name}</h1>
        <p className="page__lead">{p.summary}</p>
        {p.context && <p className="hand project__context">{p.context}</p>}
        <div className="project__links">
          <a href={p.code} className="button" target="_blank" rel="noopener noreferrer">
            Code on GitHub
          </a>
          {p.live && (
            <a href={p.live.href} className="button button--ghost" target="_blank" rel="noopener noreferrer">
              {p.live.label}
            </a>
          )}
        </div>
      </header>

      <figure className="project__shot">
        <span className="tape" aria-hidden="true" />
        <ScreenSketch slug={p.slug} label={p.name} />
      </figure>

      {p.steps && (
        <section className="project__section" aria-labelledby="how">
          <h2 id="how" className="project__h2">
            How it works
          </h2>
          <ol className="steps">
            {p.steps.map((s) => (
              <li key={s.title}>
                <h3>{s.title}</h3>
                <p>{s.detail}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {p.parts && (
        <section className="project__section" aria-labelledby="parts">
          <h2 id="parts" className="project__h2">
            What&apos;s inside
          </h2>
          <ul className="parts">
            {p.parts.map((s) => (
              <li key={s.title}>
                <h3>{s.title}</h3>
                <p>{s.detail}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="project__section project__split" aria-label="Details">
        <div>
          <h2 className="project__h2">Worth knowing</h2>
          <ul className="ticks">
            {p.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="project__h2">Built with</h2>
          <ul className="stack">
            {p.stack.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </section>

      <nav className="pager" aria-label="More projects">
        <Link href={`/projects/${previous.slug}`} className="pager__link">
          <span className="pager__dir">Previous</span>
          <span className="pager__name">{previous.name}</span>
        </Link>
        <Link href={`/projects/${next.slug}`} className="pager__link pager__link--next">
          <span className="pager__dir">Next</span>
          <span className="pager__name">{next.name}</span>
        </Link>
      </nav>
    </article>
  );
}
