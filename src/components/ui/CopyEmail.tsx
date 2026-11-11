"use client";

import { useEffect, useState } from "react";
import { site } from "@/data/site";

/** The address as a mailto link, with a button that copies it. */
export function CopyEmail() {
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
    <div className="copy-email">
      <a href={`mailto:${site.email}`} className="copy-email__address">
        {site.email}
      </a>
      <button type="button" className="button button--ghost" onClick={copy}>
        {state === "copied" ? "Copied!" : "Copy"}
      </button>
      <span className="visually-hidden" role="status">
        {state === "copied" && "Email address copied"}
        {state === "failed" && "Couldn't copy. Select the address and copy it manually."}
      </span>
    </div>
  );
}
