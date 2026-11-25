import type { MetadataRoute } from "next";
import { lastUpdated, projects } from "@/data/projects";
import { siteUrl } from "@/data/site-url";

// The latest change to any project, from the daily sync, so the sitemap stays static and current.
const lastModified = lastUpdated;

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/projects", "/about", "/contact"].map((path) => ({
    url: `${siteUrl}${path || "/"}`,
    lastModified,
  }));
  const caseStudies = projects.map((p) => ({ url: `${siteUrl}/projects/${p.slug}`, lastModified }));
  return [...pages, ...caseStudies];
}
