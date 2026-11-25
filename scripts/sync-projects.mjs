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
 * A new repo needs nothing: without the block, everything is worked out.
 *   title     the README's first heading
 *   tagline   the rest of that heading, or a short About text
 *   summary   the README's opening paragraph, cut at a sentence
 *   category  the repo's topics, then the wording of its title, About text and README
 *   tags      its main language plus the libraries in its dependency files
 *   highlights  the bullets under a Summary / Highlights / Results heading
 * Forks, archived repos and this profile's own repo are left out.
 *
 * Each project also records the day it first appeared here (firstSeen) and is
 * marked new for 30 days after that, so a new project shows up as new on the
 * site and the profile, then quietly stops being new. Projects listed before
 * this was tracked have no date and are never marked new.
 *
 * Usage: GITHUB_TOKEN=... node scripts/sync-projects.mjs
 * Runs twice a day in .github/workflows/sync-projects.yml.
 */
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const OWNER = process.env.GITHUB_OWNER || "anubrata-de";
const OUT = new URL("../src/data/github-projects.json", import.meta.url);
const API = "https://api.github.com";
export const NEW_FOR_DAYS = 30;

export const CATEGORIES = [
  "LLM agents and apps",
  "Full-stack apps",
  "Machine learning",
  "Business and data analysis",
  "Other projects",
];

/** Topic → category. A topic is the clearest signal a repo can give, so it wins. */
const TOPIC_CATEGORY = [
  [["llm", "agents", "agent", "rag", "openai", "genai", "ai"], "LLM agents and apps"],
  [["flask", "vue", "vuejs", "react", "full-stack", "fullstack", "web-app", "django", "fastapi"], "Full-stack apps"],
  [["machine-learning", "deep-learning", "kaggle", "ml", "classification", "regression", "time-series", "anomaly-detection"], "Machine learning"],
  [["data-analysis", "analytics", "business", "case-study", "sql"], "Business and data analysis"],
];

/** Words that point to a category, for repos without topics. Counted in the title and About text, then the README. */
const CATEGORY_WORDS = {
  "LLM agents and apps": [
    "llm", "llms", "large language model", "gpt", "openai", "gemini", "claude", "anthropic", "agent", "agents",
    "rag", "retrieval-augmented", "langchain", "prompt", "prompts", "chatbot", "embeddings", "genai", "generative ai",
  ],
  "Full-stack apps": [
    "flask", "vue", "react", "next.js", "django", "full-stack", "full stack", "frontend", "front end", "backend",
    "back end", "rest api", "crud", "web app", "sqlite", "login", "dashboard for", "role-based",
  ],
  "Machine learning": [
    "machine learning", "deep learning", "neural", "model", "models", "classification", "classifier", "regression",
    "pytorch", "tensorflow", "keras", "scikit-learn", "sklearn", "xgboost", "lightgbm", "kaggle", "anomaly detection",
    "accuracy", "f1", "precision", "recall", "training", "benchmark", "dataset", "datasets", "cnn", "forecast",
    "forecasting", "parser", "parsers", "embedding",
  ],
  "Business and data analysis": [
    "business", "revenue", "sales", "profit", "case study", "stakeholder", "stakeholders", "kpi", "excel", "tableau",
    "power bi", "market", "inventory", "customer", "customers", "pricing",
  ],
};

/** When nothing else decides it, the main language does. */
const LANGUAGE_CATEGORY = { "Jupyter Notebook": "Machine learning", Vue: "Full-stack apps", HTML: "Full-stack apps" };

/**
 * Libraries worth showing as tags: display name, then the package names that mean it.
 * Tier 1 says what the project is (frameworks, distinctive tools); tier 2 is the
 * everyday kit, shown after them if there is room.
 */
const TECH = [
  ["PyTorch", 1, ["torch", "torchvision", "torchaudio"]],
  ["TensorFlow", 1, ["tensorflow"]],
  ["Keras", 1, ["keras"]],
  ["Hugging Face Transformers", 1, ["transformers"]],
  ["LangChain", 1, ["langchain", "langchain-core", "langchain-openai", "langchain-community"]],
  ["OpenAI API", 1, ["openai"]],
  ["Gemini API", 1, ["google-generativeai", "google-genai"]],
  ["Claude API", 1, ["anthropic"]],
  ["FastAPI", 1, ["fastapi"]],
  ["Flask", 1, ["flask"]],
  ["Django", 1, ["django"]],
  ["Streamlit", 1, ["streamlit"]],
  ["Vue.js", 1, ["vue"]],
  ["React", 1, ["react"]],
  ["Next.js", 1, ["next"]],
  ["XGBoost", 1, ["xgboost"]],
  ["LightGBM", 1, ["lightgbm"]],
  ["scikit-learn", 1, ["scikit-learn", "sklearn"]],
  ["statsmodels", 1, ["statsmodels"]],
  ["Drain3", 1, ["drain3"]],
  ["spaCy", 1, ["spacy"]],
  ["OpenCV", 1, ["opencv-python", "opencv-python-headless", "opencv-contrib-python"]],
  ["librosa", 1, ["librosa"]],
  ["DuckDB", 1, ["duckdb"]],
  ["Polars", 1, ["polars"]],
  ["SQLAlchemy", 1, ["sqlalchemy", "flask-sqlalchemy"]],
  ["Celery", 1, ["celery"]],
  ["Redis", 1, ["redis"]],
  ["Playwright", 1, ["playwright"]],
  ["Selenium", 1, ["selenium"]],
  ["BeautifulSoup", 1, ["beautifulsoup4", "bs4"]],
  ["python-pptx", 1, ["python-pptx"]],
  ["pandas", 2, ["pandas"]],
  ["NumPy", 2, ["numpy"]],
  ["SciPy", 2, ["scipy"]],
  ["Matplotlib", 2, ["matplotlib"]],
  ["seaborn", 2, ["seaborn"]],
  ["Plotly", 2, ["plotly"]],
  ["NLTK", 2, ["nltk"]],
  ["Express", 2, ["express"]],
  ["Chart.js", 2, ["chart.js"]],
  ["Bootstrap", 2, ["bootstrap"]],
  ["Tailwind CSS", 2, ["tailwindcss"]],
];
const PACKAGE_TO_TECH = new Map(TECH.flatMap(([name, tier, pkgs]) => pkgs.map((p) => [p, { name, tier }])));

/** Dependency files read for tags, in the repo's top folder. */
export const DEPENDENCY_FILES = ["pyproject.toml", "requirements.txt", "environment.yml", "package.json"];

/** The language GitHub reports, as a tag. Markup and build files aren't worth a tag. */
const LANGUAGE_TAG = { "Jupyter Notebook": "Python", Vue: "Vue.js", HTML: null, CSS: null, Shell: null, Makefile: null, Dockerfile: null };
const MAX_TAGS = 6;

const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": `${OWNER}-portfolio-sync`,
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};

async function gh(path, accept) {
  const res = await fetch(`${API}${path}`, { headers: accept ? { ...headers, Accept: accept } : headers });
  if (res.status === 404 || res.status === 409) return null; // 409: an empty repo
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

/** The dependency files a repo has in its top folder, by name. */
async function dependencyFiles(repo) {
  const tree = await gh(`/repos/${OWNER}/${repo.name}/git/trees/${encodeURIComponent(repo.default_branch || "HEAD")}`);
  const present = new Set((tree?.tree || []).filter((t) => t.type === "blob").map((t) => t.path));
  const files = {};
  for (const name of DEPENDENCY_FILES) {
    if (!present.has(name)) continue;
    const text = await gh(`/repos/${OWNER}/${repo.name}/contents/${name}`, "application/vnd.github.raw+json");
    if (text) files[name] = text;
  }
  return files;
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

/** Keep whole sentences up to `max` characters; cut a single long sentence at a word. */
export function clip(text, max = 280) {
  if (text.length <= max) return text;
  const sentences = text.match(/[^.!?]+(?:[.!?]+(?=\s|$)|$)/g) || [text];
  let out = "";
  for (const s of sentences) {
    if ((out + s).trim().length > max) break;
    out += s;
  }
  out = out.trim();
  if (out) return out;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

/** README text without comments, code, tables and images: what a reader actually reads. */
const prose = (readme) =>
  readme
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/```[\s\S]*?```/g, "")
    .split("\n")
    .filter((l) => !/^\s*\|/.test(l))
    .join("\n");

export function firstHeading(readme) {
  const m = readme.replace(/<!--[\s\S]*?-->/g, "").match(/^#\s+(.+)$/m);
  return m ? stripMarkdown(m[1]) : "";
}

export function firstParagraph(readme) {
  const body = prose(readme)
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .find((p) => p && !/^(#|<|!\[|\||-{3}|\[!\[|[-*] |\d+\. )/.test(p));
  return body ? clip(stripMarkdown(body)) : "";
}

/** Up to four bullets from the first Summary / Highlights / Results / Features section that has a list. */
export function readmeHighlights(readme) {
  const lines = prose(readme).split("\n");
  const wanted = /^#{2,4}\s+(summary|highlights|key (findings|results)|results|findings|features|what it does)\b/i;
  for (let i = 0; i < lines.length; i++) {
    if (!wanted.test(lines[i])) continue;
    const bullets = [];
    for (let j = i + 1; j < lines.length && !/^#{1,4}\s/.test(lines[j]); j++) {
      const m = lines[j].match(/^\s{0,3}(?:[-*]|\d+\.)\s+(.+)/);
      if (m) bullets.push(m[1]);
      else if (bullets.length && /^\s{2,}\S/.test(lines[j])) bullets[bullets.length - 1] += ` ${lines[j].trim()}`;
    }
    const clean = bullets.map((b) => clip(stripMarkdown(b))).filter((b) => b.length >= 20);
    if (clean.length) return clean.slice(0, 4);
  }
  return [];
}

/** Package names listed in the dependency files we read. */
export function packagesIn(files) {
  const names = [];
  const add = (raw) => {
    const name = String(raw).trim().toLowerCase().replace(/_/g, "-").split(/[\s<>=~!;[\]@^]/)[0];
    if (name && !names.includes(name)) names.push(name);
  };
  if (files["requirements.txt"]) {
    for (const line of files["requirements.txt"].split("\n")) if (/^\s*[a-z0-9]/i.test(line)) add(line);
  }
  if (files["pyproject.toml"]) {
    const t = files["pyproject.toml"];
    for (const block of t.match(/dependencies\s*=\s*\[[\s\S]*?\]/g) || []) for (const m of block.matchAll(/["']([^"']+)["']/g)) add(m[1]);
    const poetry = t.match(/\[tool\.poetry(?:\.group\.\w+)?\.dependencies\]([\s\S]*?)(?=\n\[|$)/g) || [];
    for (const section of poetry) for (const m of section.matchAll(/^\s*([A-Za-z0-9_.-]+)\s*=/gm)) if (m[1] !== "python") add(m[1]);
  }
  if (files["environment.yml"]) {
    for (const m of files["environment.yml"].matchAll(/^\s*-\s+([A-Za-z0-9_.-]+)/gm)) add(m[1]);
  }
  if (files["package.json"]) {
    try {
      const pkg = JSON.parse(files["package.json"]);
      for (const name of Object.keys({ ...pkg.dependencies, ...pkg.devDependencies })) add(name);
    } catch {
      /* not valid JSON: skip it */
    }
  }
  return names;
}

/** Libraries for the tags: from dependency files, or failing that, the README's own wording. */
export function techFrom(files, readme) {
  const found = [];
  const push = (name, tier, order) => {
    if (!found.some((f) => f.name === name)) found.push({ name, tier, order });
  };
  packagesIn(files).forEach((pkg, order) => {
    const hit = PACKAGE_TO_TECH.get(pkg);
    if (hit) push(hit.name, hit.tier, order);
  });
  if (!found.length) {
    const text = prose(readme).toLowerCase();
    TECH.forEach(([name, tier, pkgs], order) => {
      const words = [name.toLowerCase(), ...pkgs].filter((w) => w.length > 3 && !["next", "react", "express", "vue"].includes(w));
      if (words.some((w) => new RegExp(`(^|[^a-z0-9])${w.replace(/[.+]/g, "\\$&")}([^a-z0-9]|$)`).test(text))) push(name, tier, order);
    });
  }
  return found.sort((a, b) => a.tier - b.tier || a.order - b.order).map((f) => f.name);
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

const countWord = (text, word) => {
  const re = new RegExp(`(^|[^a-z0-9])${word.replace(/[.+]/g, "\\$&")}(?=[^a-z0-9]|$)`, "g");
  return (text.match(re) || []).length;
};

export function categoryFor(meta, topics, { title = "", about = "", readme = "", language = "" } = {}) {
  if (meta.category) {
    const match = CATEGORIES.find((c) => c.toLowerCase() === meta.category.toLowerCase());
    if (match) return match;
  }
  for (const [keys, category] of TOPIC_CATEGORY) if (topics.some((t) => keys.includes(t))) return category;
  const head = `${title} ${about}`.toLowerCase();
  const body = prose(readme).toLowerCase().slice(0, 12000);
  let best = null;
  let bestScore = 0;
  for (const [category, words] of Object.entries(CATEGORY_WORDS)) {
    const score = words.reduce((sum, w) => sum + 3 * countWord(head, w) + countWord(body, w), 0);
    if (score > bestScore) [best, bestScore] = [category, score];
  }
  if (best && bestScore >= 3) return best;
  return LANGUAGE_CATEGORY[language] || "Other projects";
}

export function buildProject(repo, readme = "", files = {}) {
  const meta = parseMeta(readme);
  const topics = repo.topics || [];
  if (yes(meta.hide) || topics.includes("hide-from-portfolio")) return null;
  const curated = Object.keys(meta).length > 0;
  const about = (repo.description || "").trim();

  let title = meta.title || "";
  let tagline = meta.tagline || "";
  if (!title) {
    const heading = firstHeading(readme) || prettify(repo.name);
    const [head, ...rest] = heading.split(/\s+[–—|:-]\s+/);
    title = head;
    tagline = tagline || rest.join(" ");
  }
  const summary = meta.summary || (curated ? about || firstParagraph(readme) : firstParagraph(readme) || about) || "";
  if (!tagline && !curated && about && about.length <= 100) {
    const same = (a, b) => a.toLowerCase().replace(/\W+/g, "") === b.toLowerCase().replace(/\W+/g, "");
    if (!same(about, title) && !summary.toLowerCase().startsWith(about.toLowerCase().slice(0, 40))) tagline = about;
  }

  let tags;
  if (meta.tags) tags = meta.tags.split(",").map((t) => t.trim()).filter(Boolean);
  else if (topics.length) tags = topics.filter((t) => t !== "portfolio").slice(0, MAX_TAGS).map(prettify);
  else {
    const lang = repo.language in LANGUAGE_TAG ? LANGUAGE_TAG[repo.language] : repo.language;
    tags = [lang, ...techFrom(files, readme)].filter(Boolean);
    tags = [...new Set(tags)].slice(0, MAX_TAGS);
  }

  return {
    repo: repo.name,
    slug: meta.slug || kebab(repo.name),
    title,
    tagline,
    summary,
    category: categoryFor(meta, topics, { title, about, readme, language: repo.language || "" }),
    tags,
    featured: yes(meta.featured),
    url: repo.html_url,
    homepage: repo.homepage || "",
    language: repo.language || "",
    updated: repo.pushed_at,
    // Curated projects get their write-up on the site; new ones get it from their README.
    highlights: curated ? [] : readmeHighlights(readme),
  };
}

/**
 * When each project first appeared (kept from the last run), and whether it is still new.
 * Projects already listed before this was tracked have no date (null) and are never new;
 * so does everything on a very first run with no earlier data.
 */
export function markNew(projects, previous, today) {
  const known = new Map((previous?.projects || []).map((p) => [p.repo, p.firstSeen ?? null]));
  const day = (iso) => Date.parse(`${iso}T00:00:00Z`);
  return projects.map((p) => {
    const firstSeen = !previous ? null : known.has(p.repo) ? known.get(p.repo) : today;
    const isNew = firstSeen !== null && (day(today) - day(firstSeen)) / 86400000 < NEW_FOR_DAYS;
    return { ...p, firstSeen, isNew };
  });
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
    // Dependency files are only needed when the repo doesn't list its own tags.
    const needsTags = !parseMeta(readme).tags && !(repo.topics || []).length;
    const project = buildProject(repo, readme, needsTags ? await dependencyFiles(repo) : {});
    if (project) projects.push(project);
  }
  const current = await readFile(OUT, "utf8").catch(() => "");
  const previous = current ? JSON.parse(current) : null;
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const data = {
    owner: OWNER,
    // The footer's year; it changes once a year, which redeploys the site.
    year: now.getUTCFullYear(),
    categories: CATEGORIES,
    projects: sortProjects(markNew(projects, previous, today)),
  };
  const next = JSON.stringify(data, null, 2) + "\n";
  if (current === next) {
    console.log(`No changes (${projects.length} projects).`);
    return;
  }
  await writeFile(OUT, next);
  const added = data.projects.filter((p) => !previous?.projects?.some((q) => q.repo === p.repo)).map((p) => p.title);
  console.log(`Wrote ${projects.length} projects to src/data/github-projects.json${added.length ? `; new: ${added.join(", ")}` : ""}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
