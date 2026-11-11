import { areas, featuredProjects, models, projects } from "@/data/projects";
import { site } from "@/data/site";
import { toolkit } from "@/data/skills";

/**
 * What the assistant knows: short notes generated from the site's own data,
 * searched with TF-IDF and cosine similarity. No language model involved,
 * so every answer can point to where it came from.
 */

export type Note = {
  id: string;
  question: string;
  answer: string;
  href?: string;
  source: string;
  keywords: string;
  /** Summary notes that mention many projects are matched on their keywords only. */
  summary?: boolean;
};

const list = (items: readonly string[]) =>
  items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

export const notes: Note[] = [
  {
    id: "who",
    question: "Who is Anubrata?",
    answer: `${site.name} is a student in IIT Madras' BS in Data Science and Applications, based in ${site.location}. He builds LLM agents, retrieval apps and the Flask and Vue systems around them, and serves as Secretary of Nilgiri House for 2025–26.`,
    href: "/about",
    source: "About",
    keywords: "who about background introduce yourself tell me anubrata de person profile summary",
  },
  {
    id: "education",
    question: "Where does he study?",
    answer:
      "He's doing the BS in Data Science and Applications at the Indian Institute of Technology Madras. Two of his projects, the Data Analyst Agent and the TDS Virtual TA, started as work for the Tools in Data Science course.",
    href: "/about",
    source: "About",
    keywords: "study education college university degree iit madras iitm bs data science applications course student",
  },
  {
    id: "nilgiri",
    question: "What does he do at Nilgiri House?",
    answer:
      "He's the Secretary of Nilgiri House, one of the student houses of the IIT Madras BS programme, for 2025–26.",
    href: "/about",
    source: "About",
    keywords: "nilgiri house secretary leadership council student community role position",
  },
  {
    id: "open",
    question: "Is he open to internships?",
    answer: `Yes. He's looking for internships in data science, machine learning and backend engineering. The quickest way to reach him is ${site.email}.`,
    href: "/contact",
    source: "Contact",
    keywords: "hire hiring internship intern job role opportunity available open work offer recruit",
  },
  {
    id: "contact",
    question: "How do I contact him?",
    answer: `Email ${site.email}, or find him on LinkedIn (anubratade) and GitHub (anubrata-de). The contact page has a form too.`,
    href: "/contact",
    source: "Contact",
    keywords: "contact email reach message linkedin github touch connect mail social",
  },
  {
    id: "stack",
    question: "What's his tech stack?",
    answer: `Mostly Python: ${list(toolkit[1].items)} for data, ${list(toolkit[3].items.slice(0, 5))} on the back end, and the OpenAI, Anthropic and Gemini APIs for LLM work. Front ends in Vue 3, Jinja2 and Bootstrap.`,
    href: "/about",
    source: "Toolkit",
    keywords: "stack skills tools technologies languages frameworks python sql javascript know use tech",
  },
  ...toolkit.map((row) => ({
    id: `toolkit-${row.group}`,
    question: `What does he use for ${row.group.toLowerCase()}?`,
    answer: `${row.group}: ${list(row.items)}.`,
    href: "/about",
    source: "Toolkit",
    keywords: `${row.group} ${row.items.join(" ")}`,
  })),
  {
    id: "featured",
    question: "What are his best projects?",
    answer: `Start with ${list(featuredProjects.map((p) => p.name))}. ${featuredProjects
      .map((p) => `${p.name}: ${p.summary.charAt(0).toLowerCase()}${p.summary.slice(1)}`)
      .join(" ")}`,
    href: "/projects",
    source: "Work",
    keywords: "best projects featured top work portfolio showcase built proud highlight show me",
    summary: true,
  },
  {
    id: "all-projects",
    question: "What has he built?",
    answer: `${projects.length} projects with code on GitHub: ${list(projects.map((p) => p.name))}, plus four machine learning models.`,
    href: "/projects",
    source: "Work",
    keywords: "projects list all built made repos repositories github work",
    summary: true,
  },
  ...projects.map((p) => ({
    id: p.slug,
    question: `What is ${p.name}?`,
    answer: `${p.summary} It's built with ${list(p.stack.slice(0, 5))}.${p.context ? ` ${p.context}.` : ""}`,
    href: `/projects/${p.slug}`,
    source: p.name,
    keywords: `${p.name} ${areas[p.area].label} ${p.stack.join(" ")} ${(p.steps ?? p.parts ?? []).map((s) => `${s.title} ${s.detail}`).join(" ")} ${p.highlights.join(" ")}`,
  })),
  {
    id: "ml",
    question: "What machine learning has he done?",
    answer: `Four supervised learning problems: ${list(models.map((m) => `${m.name.toLowerCase()} (${m.taskLabel.toLowerCase()})`))}.`,
    href: "/projects#models",
    source: "Machine learning",
    keywords: "machine learning ml models classification regression forecasting time series sentiment scikit-learn prediction",
  },
  {
    id: "llms",
    question: "Which LLMs has he worked with?",
    answer:
      "OpenAI (gpt-4o-mini and embeddings), Anthropic Claude and Google Gemini, called directly and through AI Pipe and OpenRouter. The Data Analyst Agent falls back between them, and the Browser LLM Agent lets you switch providers.",
    href: "/projects/data-analyst-agent",
    source: "Data Analyst Agent",
    keywords: "llm llms gpt openai claude anthropic gemini google models ai language rag agents provider",
  },
  {
    id: "resume",
    question: "Can I see his résumé?",
    answer: site.resume
      ? "Yes, there's a résumé link in the footer."
      : `There isn't a résumé on the site yet. Email ${site.email} and he'll send one.`,
    href: site.resume ?? "/contact",
    source: site.resume ? "Résumé" : "Contact",
    keywords: "resume cv curriculum vitae pdf download experience",
  },
  {
    id: "site",
    question: "How was this site built?",
    answer:
      "Next.js and TypeScript. The landscape and particle sculpture are hand-written WebGL, the soundtrack is generated live with the Web Audio API, and I answer by matching your question against notes from the site.",
    href: "/about",
    source: "About",
    keywords: "site website built made portfolio webgl three animation sound music audio design how",
  },
  {
    id: "anu",
    question: "Who are you?",
    answer:
      "I'm Anu, a small guide to this site. I'm not a language model: I compare your question with notes about Anubrata's work and show you where the answer came from, the same idea as his TDS Virtual TA.",
    source: "Anu",
    keywords: "who are you anu assistant bot ai chatbot how do you work",
  },
];

const STOP = new Set(
  "a an the is are was were be been of to in on for and or with what whats which who whom how does do did can could his he him me my i you your about tell show it its this that there their at by from as any some has have".split(
    " ",
  ),
);

const SYNONYMS: Record<string, string[]> = {
  hire: ["internship", "role", "open"],
  job: ["internship", "role", "open"],
  cv: ["resume"],
  college: ["education", "study"],
  university: ["education", "study"],
  school: ["education", "study"],
  skill: ["stack", "tools"],
  tech: ["stack", "tools"],
  rag: ["retrieval", "embeddings", "virtual"],
  chatbot: ["agent", "assistant"],
  ai: ["llm", "agent"],
  email: ["contact"],
  reach: ["contact"],
  ppt: ["prompt2ppt", "powerpoint", "slides"],
  powerpoint: ["prompt2ppt"],
  parking: ["parkease"],
  quiz: ["quiz", "master"],
  placement: ["placement", "portal"],
  ta: ["virtual", "tds"],
};

function stem(word: string) {
  return word.replace(/(ing|ed|es|s)$/u, "").replace(/é/g, "e");
}

function tokenize(text: string) {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9é+.#\s-]/g, " ")
    .split(/[\s.-]+/)
    .filter((w) => w.length > 1 && !STOP.has(w));
  const out: string[] = [];
  for (const w of words) {
    out.push(stem(w));
    for (const s of SYNONYMS[w] ?? []) out.push(stem(s));
  }
  return out;
}

type Vector = Map<string, number>;

function termFreq(tokens: string[]) {
  const tf: Vector = new Map();
  for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
  return tf;
}

const docTokens = notes.map((n) => [
  ...tokenize(n.question),
  ...tokenize(n.question),
  ...tokenize(n.keywords),
  ...(n.summary ? [] : tokenize(n.answer)),
]);

/** Names people use for each project; mentioning one strongly favours its note. */
const ALIASES: Record<string, RegExp> = {
  "data-analyst-agent": /\b(data analyst|analyst agent|tds_?p2|project 2)\b/i,
  "tds-virtual-ta": /\b(virtual ta|tds ta|teaching assistant|\bta\b|vta)\b/i,
  prompt2ppt: /\b(prompt ?2 ?ppt|presentify|ppt|powerpoint|slides?|deck)\b/i,
  "browser-llm-agent": /\b(browser (llm )?agent|llm agent|llm_agent|js_exec)\b/i,
  parkease: /\b(park ?ease|parking)\b/i,
  "placement-portal": /\b(placement)\b/i,
  "quiz-master-v1": /\b(quiz)\b/i,
  ml: /\b(ml|machine learning)\b/i,
  llms: /\b(llms?|language models?|gpt|claude|gemini)\b/i,
};
const df = new Map<string, number>();
docTokens.forEach((tokens) => new Set(tokens).forEach((t) => df.set(t, (df.get(t) ?? 0) + 1)));
const idf = (t: string) => Math.log((notes.length + 1) / ((df.get(t) ?? 0) + 1)) + 1;

function weigh(tf: Vector) {
  const v: Vector = new Map();
  let norm = 0;
  tf.forEach((count, t) => {
    const w = (1 + Math.log(count)) * idf(t);
    v.set(t, w);
    norm += w * w;
  });
  norm = Math.sqrt(norm) || 1;
  v.forEach((w, t) => v.set(t, w / norm));
  return v;
}

const docVectors = docTokens.map((tokens) => weigh(termFreq(tokens)));

type Match = { note: Note; score: number };

export function search(query: string, limit = 3): Match[] {
  const q = weigh(termFreq(tokenize(query)));
  if (q.size === 0) return [];
  return docVectors
    .map((doc, i) => {
      let dot = 0;
      q.forEach((w, t) => {
        dot += w * (doc.get(t) ?? 0);
      });
      const alias = ALIASES[notes[i].id];
      if (alias?.test(query)) dot = Math.min(1, dot + 0.35);
      return { note: notes[i], score: dot };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

const MIN_SCORE = 0.12;

const GREETING = /^(hi|hey|hello|yo|hola|namaste|good (morning|afternoon|evening))\b/i;
const THANKS = /\b(thanks|thank you|thx|cheers)\b/i;

export type Reply = { text: string; match?: Match; related: Note[] };

export function answer(query: string): Reply {
  const trimmed = query.trim();
  if (GREETING.test(trimmed) && trimmed.split(/\s+/).length <= 3) {
    return {
      text: "Hi! Ask me about Anubrata's projects, what he works with, where he studies, or how to reach him.",
      related: [notes[0], notes.find((n) => n.id === "featured")!, notes.find((n) => n.id === "contact")!],
    };
  }
  if (THANKS.test(trimmed) && trimmed.split(/\s+/).length <= 4) {
    return { text: "Happy to help. Anything else you'd like to know?", related: [] };
  }
  const matches = search(trimmed, 4);
  const best = matches[0];
  if (!best || best.score < MIN_SCORE) {
    return {
      text: "I don't have notes on that. I can tell you about his projects, skills, education, or how to get in touch.",
      related: [notes[0], notes.find((n) => n.id === "featured")!, notes.find((n) => n.id === "stack")!],
    };
  }
  return {
    text: best.note.answer,
    match: best,
    related: matches
      .slice(1)
      .filter((m) => m.score >= MIN_SCORE * 0.8)
      .map((m) => m.note),
  };
}
