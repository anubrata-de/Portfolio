"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { useExperience } from "@/context/Experience";

/**
 * Smooth scrolling plus the scroll-driven effects:
 * - [data-reveal] elements animate in once they enter the viewport
 * - [data-warp] headlines curve and split into colour as they move through the screen
 * - [data-parallax] content drifts against the scroll
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

  // Scroll-linked text. Reads all positions first, then writes, once per frame while scrolling.
  // [data-warp]: headlines curve on a concave cylinder as they enter from below and leave at
  //   the top, splitting into colour while the page moves; flat and untouched mid-screen.
  //   data-warp="exit" only reacts on the way out (used for the hero).
  // [data-parallax]: drifts against the scroll and fades near the edges.
  useEffect(() => {
    const clear = (els: Iterable<HTMLElement>) => {
      for (const el of els) {
        el.style.transform = "";
        el.style.textShadow = "";
        el.style.opacity = "";
      }
    };
    let warps: HTMLElement[] = [];
    let drifts: HTMLElement[] = [];
    const collect = () => {
      warps = Array.from(document.querySelectorAll<HTMLElement>("[data-warp]"));
      drifts = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    };
    collect();
    if (calm) {
      clear(warps);
      clear(drifts);
      return;
    }

    let last = window.scrollY;
    let lastTime = performance.now();
    let velocity = 0;
    let frame = 0;
    let idle = 0;
    const smoothstep = (a: number, b: number, x: number) => {
      const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
      return t * t * (3 - 2 * t);
    };

    const tick = (now: number) => {
      const y = window.scrollY;
      const dt = Math.max(1, now - lastTime);
      velocity += (((y - last) / dt) * 16 - velocity) * 0.18;
      last = y;
      lastTime = now;
      const speed = Math.min(1, Math.abs(velocity) / 45);
      const vh = window.innerHeight;

      const warpRects = warps.map((el) => el.getBoundingClientRect());
      const driftRects = drifts.map((el) => el.getBoundingClientRect());

      warps.forEach((el, i) => {
        const r = warpRects[i];
        if (r.bottom < -vh * 0.5 || r.top > vh * 1.5) return;
        let p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);
        p = Math.max(-1, Math.min(1, p));
        if (el.dataset.warp === "exit") p = Math.min(0, p);
        const strength = smoothstep(0.2, 1, Math.abs(p));
        if (strength < 0.002 && speed < 0.02) {
          if (el.style.transform) {
            el.style.transform = "";
            el.style.textShadow = "";
            el.style.opacity = "";
          }
          return;
        }
        const rotate = Math.sign(p) * strength * 48;
        // Colour split only while moving, so a headline is always sharp once scrolling stops.
        const split = speed * (1.5 + strength * 5.5);
        el.style.transform = `perspective(1100px) rotateX(${rotate.toFixed(2)}deg) scale(${(1 - strength * 0.06).toFixed(4)})`;
        el.style.textShadow =
          split < 0.2 ? "" : `${split.toFixed(1)}px 0 var(--split-a), ${(-split).toFixed(1)}px 0 var(--split-b)`;
        el.style.opacity = (1 - smoothstep(0.55, 1, Math.abs(p))).toFixed(3);
      });

      drifts.forEach((el, i) => {
        const r = driftRects[i];
        if (r.bottom < -vh * 0.5 || r.top > vh * 1.5) return;
        const p = Math.max(-1, Math.min(1, (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2)));
        el.style.transform = Math.abs(p) < 0.01 ? "" : `translate3d(0, ${(p * 48).toFixed(1)}px, 0)`;
        el.style.opacity = (1 - smoothstep(0.6, 1, Math.abs(p))).toFixed(3);
      });

      idle = speed < 0.01 ? idle + 1 : 0;
      frame = idle > 12 ? 0 : requestAnimationFrame(tick);
    };

    const wake = () => {
      idle = 0;
      if (!frame) {
        lastTime = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };
    let collectTimer = 0;
    const mo = new MutationObserver(() => {
      window.clearTimeout(collectTimer);
      collectTimer = window.setTimeout(() => {
        collect();
        wake();
      }, 120);
    });
    const main = document.querySelector("main");
    if (main) mo.observe(main, { childList: true, subtree: true });
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", wake);
    wake();
    return () => {
      cancelAnimationFrame(frame);
      mo.disconnect();
      window.clearTimeout(collectTimer);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", wake);
      clear(warps);
      clear(drifts);
    };
  }, [calm, pathname]);

  return null;
}
