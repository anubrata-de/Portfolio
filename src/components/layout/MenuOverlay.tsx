"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { site } from "@/data/site";
import { useExperience } from "@/context/Experience";
import { audio } from "@/lib/audio";
import { cn } from "@/lib/cn";
import { SettingsMenu } from "./SettingsMenu";

const links = [{ label: "Home", href: "/" }, ...site.nav];

export function MenuOverlay() {
  const { menuOpen, setMenuOpen } = useExperience();
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);

  // Close after navigating, including back and forward
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname, setMenuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    audio.open();
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, setMenuOpen]);

  return (
    <div id="menu-overlay" className={cn("menu", menuOpen && "is-open")} aria-hidden={!menuOpen} inert={!menuOpen}>
      <div className="menu__backdrop" onClick={() => setMenuOpen(false)} />
      <div className="menu__panel" ref={panelRef} role="dialog" aria-modal="true" aria-label="Menu">
        <nav aria-label="Menu">
          <ol className="menu__links">
            {links.map((item, i) => (
              <li key={item.href} style={{ transitionDelay: menuOpen ? `${120 + i * 70}ms` : "0ms" }}>
                <Link
                  href={item.href}
                  className="menu__link"
                  aria-current={pathname === item.href ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="menu__index">{String(i + 1).padStart(2, "0")}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
        <div className="menu__foot">
          <SettingsMenu inline />
          <Link href="/contact" className="pill pill--solid" onClick={() => setMenuOpen(false)}>
            Let&apos;s talk <span aria-hidden="true">↳</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
