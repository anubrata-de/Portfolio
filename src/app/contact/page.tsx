import type { Metadata } from "next";
import { site } from "@/data/site";
import { episodes } from "@/data/home";
import { Episode } from "@/components/ui/Episode";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { ContactForm } from "@/components/contact/ContactForm";
import { SocialDoodle, type SocialName } from "@/components/doodles/Doodles";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Anubrata De about internships, data science roles or a project.",
};

export default function ContactPage() {
  return (
    <div className="page wrap">
      <header className="page__head">
        <Episode n={5} {...episodes.contact} />
        <h1 className="page__title">Let&apos;s talk</h1>
        <p className="page__lead">Tell me about the role or the project and I&apos;ll reply by email.</p>
        <p className="hand page__note">yoroshiku onegaishimasu!</p>
      </header>
      <div className="contact__grid">
        <aside>
          <h2 className="project__h2">Write to me directly</h2>
          <CopyEmail />
          <ul className="contact__social">
            {site.social.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer">
                  <SocialDoodle name={s.label as SocialName} className="contact__icon" />
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </aside>
        <div>
          <h2 className="project__h2">Or leave a note</h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
