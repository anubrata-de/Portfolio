import Link from "next/link";
import { site } from "@/data/site";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { Wordmark } from "./Wordmark";

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="footer__grid wrap">
        <div className="footer__brand">
          <Wordmark />
          <p>Data science, LLM agents and the systems around them.</p>
        </div>
        <div>
          <p className="label">Social</p>
          <ul>
            {site.social.map((item, i) => (
              <li key={item.label}>
                <a href={item.href} target="_blank" rel="noopener noreferrer">
                  <span className="footer__idx">[{String(i + 1).padStart(2, "0")}]</span> {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="label">Pages</p>
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
            {site.resume && (
              <li>
                <a href={site.resume}>Résumé</a>
              </li>
            )}
          </ul>
        </div>
        <div>
          <p className="label">Location</p>
          <p>{site.location}</p>
          <p className="label footer__email-label">E-mail</p>
          <CopyEmail />
        </div>
      </div>
      <div className="footer__bottom wrap">
        <p>
          © {site.year} {site.name}
        </p>
        <Link href="/legal/privacy-policy">Privacy</Link>
      </div>
    </footer>
  );
}
