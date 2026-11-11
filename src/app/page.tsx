import type { CSSProperties } from "react";
import Link from "next/link";
import { site } from "@/data/site";
import { areas, models, projects } from "@/data/projects";
import { episodes, hero, lookingFor, tiles } from "@/data/home";
import { Episode } from "@/components/ui/Episode";
import { CyclingWord } from "@/components/home/CyclingWord";
import { LocalTime } from "@/components/home/LocalTime";
import { Checklist } from "@/components/home/Checklist";
import { Notes } from "@/components/home/Notes";
import { HeroScene } from "@/components/doodles/HeroScene";
import { Arrow, Petal, TileDoodle } from "@/components/doodles/Doodles";
import { ScreenSketch } from "@/components/projects/ScreenSketch";

/** Fixed tilts for the pinboard so it looks hand-placed but never shifts between renders. */
const tilts = [-3, 2.5, -1.5, 3, -2.5, 1.5, -2];

export default function Home() {
  return (
    <>
      <section className="hero wrap" aria-labelledby="hero-title">
        <div className="hero__text">
          <p className="hero__kana" lang="ja" aria-hidden="true">
            アヌブラタ・デ
          </p>
          <Episode n={1} {...episodes.hello} />
          <h1 id="hero-title" className="hero__name">
            {site.name}
          </h1>
          <p className="hero__line">
            <span className="visually-hidden">
              {hero.lead} {hero.words.join(" ")}
            </span>
            <span aria-hidden="true">{hero.lead} </span>
            <CyclingWord words={hero.words} />
          </p>
          <p className="hero__intro">{hero.intro}</p>
          <p className="hero__where">
            {site.location}
            <br />
            <LocalTime />
          </p>
        </div>
        <div className="hero__art">
          <HeroScene className="hero__scene" />
          <p className="hand hero__note" aria-hidden="true">
            <Arrow className="hero__arrow" />
            my desk, most nights
          </p>
        </div>
      </section>

      <div className="nami" aria-hidden="true" />

      <section className="section wrap" aria-labelledby="beliefs-title">
        <Episode n={2} {...episodes.beliefs} />
        <h2 id="beliefs-title" className="section__title">
          Three rules I build by
        </h2>
        <Notes />
      </section>

      <section className="section ruled" aria-labelledby="work-title">
        <div className="wrap">
          <Episode n={3} {...episodes.work} />
          <h2 id="work-title" className="section__title">
            Things I&apos;ve built, pinned where I can see them
          </h2>
          <ul className="board">
            {projects.map((p, i) => (
              <li key={p.slug} className="pin" style={{ "--tilt": `${tilts[i % tilts.length]}deg` } as CSSProperties}>
                <Link href={`/projects/${p.slug}`} className="pin__link">
                  <span className="tape" aria-hidden="true" />
                  <ScreenSketch slug={p.slug} label={p.name} className="pin__shot" />
                  <span className="pin__name">{p.name}</span>
                  <span className="pin__area">{areas[p.area].label}</span>
                </Link>
              </li>
            ))}
            <li className="pin pin--note" style={{ "--tilt": "3deg" } as CSSProperties}>
              <a href={site.social[0].href} className="pin__sticky" target="_blank" rel="noopener noreferrer">
                <span className="tape" aria-hidden="true" />
                <span className="hand">All the code lives on GitHub</span>
                <span className="text-link">github.com/anubrata-de</span>
              </a>
            </li>
          </ul>
          <p className="section__more">
            <Link href="/projects" className="button button--ghost">
              See every project in detail
            </Link>
            <Link href="/projects#models" className="section__aside">
              plus {models.length} side quests in ML, deep learning and business
            </Link>
          </p>
        </div>
      </section>

      <section className="section strip" aria-labelledby="tiles-title">
        <div className="wrap">
          <Episode n={4} {...episodes.offClock} />
          <h2 id="tiles-title" className="section__title">
            A few things about me
          </h2>
        </div>
        <div className="marquee">
          {[0, 1].map((copy) => (
            <ul key={copy} className="marquee__track" aria-hidden={copy === 1 ? true : undefined}>
              {tiles.map((t, i) => (
                <li key={t.label} className="tile" style={{ "--tilt": `${i % 2 ? 2 : -2}deg` } as CSSProperties}>
                  <TileDoodle name={t.doodle} className="tile__doodle" />
                  <span>{t.label}</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </section>

      <section className="section wrap" aria-labelledby="looking-title">
        <Episode n={5} {...episodes.next} />
        <h2 id="looking-title" className="section__title">
          What I&apos;m looking for
        </h2>
        <Checklist items={lookingFor} />
        <Petal className="float-petal float-petal--a" />
        <Petal className="float-petal float-petal--b" />
      </section>
    </>
  );
}
