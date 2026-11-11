import Link from "next/link";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { Curl, Label, RevealLines, delay } from "@/components/ui/RevealLines";

export function ContactCTA() {
  return (
    <section className="cta" data-scene="plane" data-scene-side="right" aria-labelledby="cta-title">
      <div className="wrap">
        <div data-reveal>
          <Label>Stay in touch</Label>
        </div>
        <RevealLines
          id="cta-title"
          className="cta__title"
          lines={[
            <>
              Let&apos;s build <Curl />
            </>,
            <>
              something <Curl />
            </>,
            <em key="u">useful</em>,
          ]}
        />
        <p className="cta__text" data-reveal style={delay(0.2)}>
          Open to internships in data science, machine learning and backend engineering.
        </p>
        <div className="cta__actions" data-reveal style={delay(0.3)}>
          <Link href="/contact" className="pill pill--solid pill--large" data-magnetic>
            Get in touch <span aria-hidden="true">↳</span>
          </Link>
          <CopyEmail />
        </div>
      </div>
    </section>
  );
}
