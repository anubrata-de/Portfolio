import { Label, RevealLines, delay } from "@/components/ui/RevealLines";

export function Hero() {
  return (
    <section className="hero" data-scene="tree" data-scene-side="right" aria-labelledby="hero-title">
      <div className="hero__inner wrap">
        <div data-reveal style={delay(0.1)}>
          <Label>
            Data science student at IIT Madras
            <br />
            Building LLM agents and full-stack apps
          </Label>
        </div>
        <RevealLines
          as="h1"
          id="hero-title"
          className="hero__title"
          delay={0.2}
          lines={[
            <em key="a">Turning</em>,
            "data & models",
            "into systems",
            "people use",
          ]}
        />
      </div>
      <a href="#approach" className="hero__cue" data-reveal style={delay(0.9)}>
        <span>Keep scrolling</span>
        <span className="hero__cue-arrow" aria-hidden="true">
          ↓
        </span>
      </a>
    </section>
  );
}
