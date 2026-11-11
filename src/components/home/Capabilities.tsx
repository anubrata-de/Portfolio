import { capabilities } from "@/data/skills";
import { RevealLines, delay } from "@/components/ui/RevealLines";

export function Capabilities() {
  return (
    <section className="capabilities" data-scene="wave" data-scene-side="right" aria-labelledby="capabilities-title">
      <div className="wrap">
        <div className="section-intro">
          <RevealLines id="capabilities-title" lines={["What I work on"]} />
          <p data-reveal style={delay(0.15)}>
            From agents and retrieval to the Flask and Vue apps around them. Each one is something I&apos;ve shipped in a
            project.
          </p>
        </div>
        <ol className="caps">
          {capabilities.map((c, i) => (
            <li key={c.name} className="caps__item" data-reveal style={delay(0.03 * i)}>
              <span className="caps__num">({String(i + 1).padStart(3, "0")})</span>
              <span className="caps__name">{c.name}</span>
              <span className="caps__proof">{c.proof}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
