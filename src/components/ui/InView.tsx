"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/** Adds `is-in` once the element scrolls into view, so CSS can play its entrance once. */
export function InView({
  as: Tag = "div",
  className,
  children,
  ...rest
}: { as?: ElementType; className?: string; children: ReactNode } & Record<string, unknown>) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-in");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
