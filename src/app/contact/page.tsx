import type { Metadata } from "next";
import { site } from "@/data/site";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { ContactForm } from "@/components/contact/ContactForm";
import { Curl, Label, RevealLines, delay } from "@/components/ui/RevealLines";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Anubrata De about internships, data science roles or a project.",
};

export default function ContactPage() {
  return (
    <div className="contact" data-scene="plane" data-scene-side="left">
      <div className="contact__scene" aria-hidden="true" />
      <div className="contact__panel">
        <div data-reveal>
          <Label>Stay in touch</Label>
        </div>
        <RevealLines
          as="h1"
          className="contact__title"
          lines={[
            <>
              Let&apos;s build
            </>,
            <>
              <Curl /> something
            </>,
            <em key="u">useful</em>,
          ]}
        />
        <p className="contact__lede" data-reveal style={delay(0.2)}>
          Tell me about the role or the project and I&apos;ll reply by email.
        </p>
        <div className="contact__direct" data-reveal style={delay(0.25)}>
          <CopyEmail />
          <ul>
            {site.social.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="pill">
                  {s.label} <Icon name="external" />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
