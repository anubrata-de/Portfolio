"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { site } from "@/data/site";
import { useExperience } from "@/context/Experience";
import { cn } from "@/lib/cn";
import { SettingsMenu } from "./SettingsMenu";
import { SoundButton } from "./SoundButton";
import { Wordmark } from "./Wordmark";

let lastY = 0;
let hidden = false;
function subscribeScroll(onChange: () => void) {
  const handler = () => {
    const y = window.scrollY;
    hidden = y > lastY + 4 && y > 160 ? true : y < lastY - 4 ? false : hidden;
    lastY = y;
    onChange();
  };
  window.addEventListener("scroll", handler, { passive: true });
  return () => window.removeEventListener("scroll", handler);
}
const getHeaderState = () => (hidden ? "hidden" : window.scrollY > 24 ? "solid" : "top");

export function SiteHeader() {
  const pathname = usePathname();
  const { setMenuOpen, menuOpen } = useExperience();
  const state = useSyncExternalStore(subscribeScroll, getHeaderState, () => "top");

  return (
    <header className={cn("header", `header--${menuOpen ? "top" : state}`)}>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="header__inner">
        <Wordmark />
        <nav aria-label="Primary" className="header__nav">
          <ul>
            {site.nav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link href={item.href} className="header__link" aria-current={active ? "page" : undefined}>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="header__tools">
          <div className="header__settings">
            <SettingsMenu />
          </div>
          <SoundButton />
        </div>
        <Link href="/contact" className="pill header__cta" data-magnetic>
          Let&apos;s talk <span aria-hidden="true">↳</span>
        </Link>
        <button
          type="button"
          className="header__menu"
          aria-expanded={menuOpen}
          aria-controls="menu-overlay"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </div>
    </header>
  );
}
