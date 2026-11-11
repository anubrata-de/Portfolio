import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

// A fixed date keeps the sitemap static. Update it when the content changes.
const lastModified = "2026-11-11";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/projects", "/about", "/contact"].map((path) => ({
    url: `${site.url}${path || "/"}`,
    lastModified,
  }));
  const caseStudies = projects.map((p) => ({ url: `${site.url}/projects/${p.slug}`, lastModified }));
  return [...pages, ...caseStudies];
}
