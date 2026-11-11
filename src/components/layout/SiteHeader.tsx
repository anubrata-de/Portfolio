"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/data/site";
import { SocialDoodle, type SocialName } from "@/components/doodles/Doodles";
import { cn } from "@/lib/cn";

const links = [
  { label: "about", href: "/about" },
  { label: "work", href: "/projects" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const wrap = useRef<HTMLDivElement>(null);

  // Close the connect menu when the route changes.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [open]);

  const connect: { label: SocialName; text: string; href: string }[] = [
    ...site.social.map((s) => ({ label: s.label as SocialName, text: s.label, href: s.href })),
    { label: "Email", text: "Email", href: `mailto:${site.email}` },
  ];

  return (
    <header className="header">
      <div className="wrap header__inner">
        <Link href="/" className="header__home" aria-label={`${site.name}, home`}>
          anubrata<span>.de</span>
        </Link>
        <nav aria-label="Main">
          <ul className="header__nav">
            {links.map((l) => {
              const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
              return (
                <li key={l.href}>
                  <Link href={l.href} className={cn("header__link", active && "is-active")} aria-current={active ? "page" : undefined}>
                    {l.label}
                  </Link>
                </li>
              );
            })}
            <li className="connect" ref={wrap}>
              <button
                type="button"
                className={cn("header__link", open && "is-active")}
                aria-expanded={open}
                aria-controls="connect-menu"
                onClick={() => setOpen((o) => !o)}
              >
                connect
              </button>
              <ul id="connect-menu" className={cn("connect__menu", open && "is-open")} hidden={!open}>
                {connect.map((c, i) => (
                  <li key={c.label} style={{ "--i": i } as CSSProperties}>
                    <a href={c.href} {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                      <SocialDoodle name={c.label} className="connect__icon" />
                      {c.text}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
