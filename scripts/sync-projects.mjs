#!/usr/bin/env node
/**
 * Builds src/data/github-projects.json from the owner's public GitHub repos.
 * The website and the GitHub profile README are both generated from that file,
 * so a project only ever has to be described once: in its own repo.
 *
 * Each repo can describe itself with an invisible block anywhere in its README:
 *
 *   <!-- portfolio
 *   title: Data Analyst Agent
 *   tagline: Automated Data Analysis & Visualization API
 *   category: LLM agents and apps
 *   summary: One or two sentences about what it does.
 *   tags: Python, FastAPI, pandas
 *   slug: data-analyst-agent      (optional, keeps the website address stable)
 *   featured: yes                 (optional, pins it on the home page)
 *   hide: yes                     (optional, leaves the repo out)
 *   -->
 *
 * Repos without the block are still included, using the README's first heading,
 * the repo's About text, its topics and its main language.
 *
 * Usage: GITHUB_TOKEN=... node scripts/sync-projects.mjs
 * Runs daily in .github/workflows/sync-projects.yml.
 */
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const OWNER = process.env.GITHUB_OWNER || "anubrata-de";
const OUT = new URL("../src/data/github-projects.json", import.meta.url);
const API = "https://api.github.com";

export const CATEGORIES = [
  "LLM agents and apps",
  "Full-stack apps",
  "Machine learning",
  "Business and data analysis",
  "Other projects",
];

/** Topic → category, used when a repo has no portfolio block. */
const TOPIC_CATEGORY = [
  [["llm", "agents", "agent", "rag", "openai", "genai", "ai"], "LLM agents and apps"],
  [["flask", "vue", "vuejs", "react", "full-stack", "fullstack", "web-app", "django", "fastapi"], "Full-stack apps"],
  [["machine-learning", "deep-learning", "kaggle", "ml", "classification", "regression", "time-series"], "Machine learning"],
  [["data-analysis", "analytics", "business", "case-study", "sql"], "Business and data analysis"],
];

const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": `${OWNER}-portfolio-sync`,
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};

async function gh(path, accept) {
  const res = await fetch(`${API}${path}`, { headers: accept ? { ...headers, Accept: accept } : headers });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub ${res.status} for ${path}: ${await res.text()}`);
  return accept?.includes("raw") ? res.text() : res.json();
}

async function listRepos() {
  const repos = [];
  for (let page = 1; ; page++) {
    const batch = await gh(`/users/${OWNER}/repos?type=owner&per_page=100&page=${page}`);
    repos.push(...batch);
    if (batch.length < 100) return repos;
  }
}

// ---------- parsing (pure, unit-testable) ----------

export function parseMeta(readme) {
  const block = readme.match(/<!--\s*portfolio\b([\s\S]*?)-->/i);
  if (!block) return {};
  const meta = {};
  for (const line of block[1].split("\n")) {
    const m = line.match(/^\s*([a-z]+)\s*:\s*(.+?)\s*$/i);
    if (m) meta[m[1].toLowerCase()] = m[2];
  }
  return meta;
}

const stripMarkdown = (s) =>
  s
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/[*_`~]/g, "")
    .replace(/\s+/g, " ")
    .trim();

export function firstHeading(readme) {
  const m = readme.replace(/<!--[\s\S]*?-->/g, "").match(/^#\s+(.+)$/m);
  return m ? stripMarkdown(m[1]) : "";
}

export function firstParagraph(readme) {
  const body = readme
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/```[\s\S]*?```/g, "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .find((p) => p && !/^(#|<|!\[|\||-{3}|\[!\[)/.test(p));
  if (!body) return "";
  const text = stripMarkdown(body);
  if (text.length <= 240) return text;
  const cut = text.slice(0, 240);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

const prettify = (name) =>
  name
    .replace(/[-_]+/g, " ")
    .replace(/\b([a-z])/g, (c) => c.toUpperCase())
    .trim();

const kebab = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const yes = (v) => /^(yes|true|1)$/i.test(v || "");

function categoryFor(meta, topics) {
  if (meta.category) {
    const match = CATEGORIES.find((c) => c.toLowerCase() === meta.category.toLowerCase());
    if (match) return match;
  }
  for (const [keys, category] of TOPIC_CATEGORY) if (topics.some((t) => keys.includes(t))) return category;
  return "Other projects";
}

export function buildProject(repo, readme = "") {
  const meta = parseMeta(readme);
  const topics = repo.topics || [];
  if (yes(meta.hide) || topics.includes("hide-from-portfolio")) return null;

  let title = meta.title || "";
  let tagline = meta.tagline || "";
  if (!title) {
    const heading = firstHeading(readme) || prettify(repo.name);
    const [head, ...rest] = heading.split(/\s+[–—|:-]\s+/);
    title = head;
    tagline = tagline || rest.join(" ");
  }
  const tags = meta.tags
    ? meta.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : topics.length
      ? topics.filter((t) => t !== "portfolio").slice(0, 6).map(prettify)
      : repo.language
        ? [repo.language]
        : [];

  return {
    repo: repo.name,
    slug: meta.slug || kebab(repo.name),
    title,
    tagline,
    summary: meta.summary || repo.description || firstParagraph(readme) || "",
    category: categoryFor(meta, topics),
    tags,
    featured: yes(meta.featured),
    url: repo.html_url,
    homepage: repo.homepage || "",
    language: repo.language || "",
    updated: repo.pushed_at,
  };
}

export function sortProjects(projects) {
  return projects.sort(
    (a, b) =>
      CATEGORIES.indexOf(a.category) - CATEGORIES.indexOf(b.category) ||
      Number(b.featured) - Number(a.featured) ||
      b.updated.localeCompare(a.updated),
  );
}

// ---------- main ----------

async function main() {
  const repos = (await listRepos()).filter((r) => !r.fork && !r.archived && !r.private && r.name !== OWNER);
  const projects = [];
  for (const repo of repos) {
    const readme = (await gh(`/repos/${OWNER}/${repo.name}/readme`, "application/vnd.github.raw+json")) || "";
    const project = buildProject(repo, readme);
    if (project) projects.push(project);
  }
  const next = JSON.stringify({ owner: OWNER, categories: CATEGORIES, projects: sortProjects(projects) }, null, 2) + "\n";
  const current = await readFile(OUT, "utf8").catch(() => "");
  if (current === next) {
    console.log(`No changes (${projects.length} projects).`);
    return;
  }
  await writeFile(OUT, next);
  console.log(`Wrote ${projects.length} projects to src/data/github-projects.json`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
