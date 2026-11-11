import Link from "next/link";
import { neighbours, type Project } from "@/data/projects";
import { ScreenSketch } from "@/components/projects/ScreenSketch";

/** A single project page: GitHub details, plus extra write-up where one exists. */
export function ProjectFile({ project: p }: { project: Project }) {
  const { previous, next } = neighbours(p.slug);
  const d = p.detail;
  const live = p.homepage ? { href: p.homepage, label: "Open it" } : d?.live;
  const stack = d?.stack ?? p.tags;

  return (
    <article className="page wrap">
      <header className="page__head">
        <p className="project__crumbs">
          <Link href="/projects">Work</Link> / {p.category}
        </p>
        <h1 className="page__title">{p.title}</h1>
        {p.tagline && <p className="project__tagline">{p.tagline}</p>}
        <p className="page__lead">{p.summary}</p>
        {d?.context && <p className="hand project__context">{d.context}</p>}
        <div className="project__links">
          <a href={p.url} className="button" target="_blank" rel="noopener noreferrer">
            Code on GitHub
          </a>
          {live && (
            <a href={live.href} className="button button--ghost" target="_blank" rel="noopener noreferrer">
              {live.label}
            </a>
          )}
        </div>
      </header>

      <figure className="project__shot">
        <span className="tape" aria-hidden="true" />
        <ScreenSketch slug={p.slug} category={p.category} label={p.title} />
      </figure>

      {d?.steps && (
        <section className="project__section" aria-labelledby="how">
          <h2 id="how" className="project__h2">
            How it works
          </h2>
          <ol className="steps">
            {d.steps.map((s) => (
              <li key={s.title}>
                <h3>{s.title}</h3>
                <p>{s.detail}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {d?.parts && (
        <section className="project__section" aria-labelledby="parts">
          <h2 id="parts" className="project__h2">
            What&apos;s inside
          </h2>
          <ul className="parts">
            {d.parts.map((s) => (
              <li key={s.title}>
                <h3>{s.title}</h3>
                <p>{s.detail}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="project__section project__split" aria-label="Details">
        {d?.highlights ? (
          <div>
            <h2 className="project__h2">Worth knowing</h2>
            <ul className="ticks">
              {d.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </div>
        ) : (
          <div>
            <h2 className="project__h2">More on GitHub</h2>
            <p className="project__more">
              The README has the full write-up, how to run it and the results.{" "}
              <a href={p.url} className="text-link" target="_blank" rel="noopener noreferrer">
                Read it on GitHub
              </a>
            </p>
          </div>
        )}
        {stack.length > 0 && (
          <div>
            <h2 className="project__h2">Built with</h2>
            <ul className="stack">
              {stack.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <Pager previous={previous} next={next} />
    </article>
  );
}

function Pager({ previous, next }: { previous: Project; next: Project }) {
  return (
    <nav className="pager" aria-label="More projects">
      <Link href={`/projects/${previous.slug}`} className="pager__link">
        <span className="pager__dir">Previous</span>
        <span className="pager__name">{previous.title}</span>
      </Link>
      <Link href={`/projects/${next.slug}`} className="pager__link pager__link--next">
        <span className="pager__dir">Next</span>
        <span className="pager__name">{next.title}</span>
      </Link>
    </nav>
  );
}
