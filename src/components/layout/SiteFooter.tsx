import Link from "next/link";
import { site } from "@/data/site";
import { endCard } from "@/data/home";
import { EndCardScene } from "@/components/doodles/Scenes";

export function SiteFooter() {
  return (
    <footer className="endcard">
      <div className="endcard__frame">
        <EndCardScene />
        <p className="endcard__sub">{endCard.subtitle}</p>
      </div>
      <div className="wrap endcard__meta">
        <p className="endcard__sign hand" aria-label={`Signed, ${endCard.signature}`}>
          {endCard.signature}
        </p>
        <nav aria-label="Footer">
          <ul className="endcard__links">
            <li>
              <Link href="/projects">Work</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
            {site.social.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="endcard__small">
          © {site.year} {site.name}. <Link href="/legal/privacy-policy">Privacy</Link>
        </p>
      </div>
    </footer>
  );
}
