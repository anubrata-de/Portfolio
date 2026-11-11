"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { useExperience } from "@/context/Experience";

/**
 * Smooth scrolling plus the scroll-driven effects:
 * - [data-reveal] elements animate in once they enter the viewport
 * - [data-warp] headlines bend backwards and split into colour as they leave the top,
 *   more strongly the faster you scroll
 * Everything is CSS driven from a few custom properties set here.
 */
export function ScrollExperience() {
  const { calm, menuOpen, assistantOpen } = useExperience();
  const pathname = usePathname();

  // Smooth scroll
  useEffect(() => {
    if (calm) return;
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, touchMultiplier: 1.1 });
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, [calm]);

  // Pause smooth scrolling while an overlay is open
  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    if (!lenis) return;
    if (menuOpen || assistantOpen) lenis.stop();
    else lenis.start();
  }, [menuOpen, assistantOpen]);

  // Back to the top on a new page
  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    if (window.location.hash) return;
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname]);

  // Reveals
  useEffect(() => {
    const root = document.documentElement;
    if (calm) {
      root.classList.remove("fx");
      return;
    }
    root.classList.add("fx");
    const seen = new WeakSet<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    const scan = () => {
      document.querySelectorAll("[data-reveal]:not(.is-revealed)").forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        io.observe(el);
      });
    };
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [calm, pathname]);

  // Scroll velocity and headline exit
  useEffect(() => {
    if (calm) return;
    const root = document.documentElement;
    let last = window.scrollY;
    let lastTime = performance.now();
    let velocity = 0;
    let frame = 0;
    let idle = 0;

    const tick = (now: number) => {
      const y = window.scrollY;
      const dt = Math.max(1, now - lastTime);
      const instant = ((y - last) / dt) * 16; // px per frame
      velocity += (instant - velocity) * 0.2;
      last = y;
      lastTime = now;
      const v = Math.max(-1, Math.min(1, velocity / 40));
      root.style.setProperty("--vel", v.toFixed(3));
      root.style.setProperty("--vel-abs", Math.abs(v).toFixed(3));

      const header = 72;
      document.querySelectorAll<HTMLElement>("[data-warp]").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > window.innerHeight) return;
        const exit = Math.max(0, Math.min(1, (header + r.height * 0.15 - r.top) / (r.height * 1.1 + 120)));
        el.style.setProperty("--exit", exit.toFixed(3));
      });

      idle = Math.abs(v) < 0.002 ? idle + 1 : 0;
      frame = idle > 20 ? 0 : requestAnimationFrame(tick);
    };

    const wake = () => {
      idle = 0;
      if (!frame) {
        lastTime = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };
    window.addEventListener("scroll", wake, { passive: true });
    wake();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", wake);
    };
  }, [calm, pathname]);

  return null;
}
