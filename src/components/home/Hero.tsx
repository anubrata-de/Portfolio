import { Label, RevealLines, delay } from "@/components/ui/RevealLines";
import { Icon } from "@/components/ui/Icon";

export function Hero() {
  return (
    <section className="hero" data-scene="tree" data-scene-side="right" aria-labelledby="hero-title">
      <div className="hero__inner wrap">
        <div data-reveal style={delay(0.1)}>
          <Label className="hero__label">
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
          warp="exit"
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
        <Icon name="down" className="hero__cue-arrow" />
      </a>
    </section>
  );
}
