import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { siteUrl } from "@/data/site-url";

// A fixed date keeps the sitemap static. Update it when the content changes.
const lastModified = "2026-11-11";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/projects", "/about", "/contact"].map((path) => ({
    url: `${siteUrl}${path || "/"}`,
    lastModified,
  }));
  const caseStudies = projects.map((p) => ({ url: `${siteUrl}/projects/${p.slug}`, lastModified }));
  return [...pages, ...caseStudies];
}
