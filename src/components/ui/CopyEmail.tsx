"use client";

import { useEffect, useState } from "react";
import { site } from "@/data/site";
import { cn } from "@/lib/cn";

/** The address as a mailto link, with a button that copies it. */
export function CopyEmail({ large = false }: { large?: boolean }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    if (state === "idle") return;
    const id = window.setTimeout(() => setState("idle"), 2200);
    return () => window.clearTimeout(id);
  }, [state]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(site.email);
      setState("copied");
    } catch {
      setState("failed");
    }
  }

  return (
    <div className={cn("copy-email", large && "copy-email--large")}>
      <a href={`mailto:${site.email}`} className="copy-email__address">
        {site.email}
      </a>
      <button type="button" className="copy-email__button" onClick={copy}>
        {state === "copied" ? "Copied" : "Copy address"}
      </button>
      <span className="visually-hidden" role="status">
        {state === "copied" && "Email address copied"}
        {state === "failed" && "Couldn't copy. Select the address and copy it manually."}
      </span>
    </div>
  );
}
