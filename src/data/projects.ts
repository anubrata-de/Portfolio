import { github } from "./site";

/**
 * Project write-ups are drawn from each repository's README and source.
 * If a detail changes in a repo, change it here too.
 */

export type AreaKey = "agents" | "llm" | "web" | "analysis";

export const areas: Record<AreaKey, { label: string }> = {
  agents: { label: "Agents" },
  llm: { label: "LLM apps" },
  web: { label: "Full-stack apps" },
  analysis: { label: "Analysis" },
};

/** Order of the groups on the Work page. */
export const areaOrder: AreaKey[] = ["agents", "llm", "web", "analysis"];

type Step = { title: string; detail: string };

export type Project = {
  slug: string;
  name: string;
  area: AreaKey;
  /** One sentence, what it does for the person using it. */
  summary: string;
  /** Where it came from, if it was built for a course. */
  context?: string;
  /** Ordered pipeline for systems that process a request in stages. */
  steps?: Step[];
  /** Unordered building blocks for apps that are not a pipeline. */
  parts?: Step[];
  highlights: string[];
  stack: string[];
  code: string;
  live?: { href: string; label: string };
};

export const projects: Project[] = [
  {
    slug: "data-analyst-agent",
    name: "Data Analyst Agent",
    area: "agents",
    context: "Built for Tools in Data Science at IIT Madras",
    summary:
      "An API that takes a question in plain English plus whatever data comes with it, finds and scrapes the sources it needs, works out the analysis and returns the answers as JSON.",
    steps: [
      {
        title: "Read the request",
        detail:
          "Accepts the question with attachments: CSV, Excel, PDF, SQL dumps, images, and zip or tar archives, which are unpacked with path-traversal checks.",
      },
      {
        title: "Find the sources",
        detail:
          "Gemini 2.0 Flash pulls the URLs and files the question depends on out of the text, with a regex fallback when the model misses.",
      },
      {
        title: "Collect the data",
        detail:
          "Web tables are scraped with httpx and BeautifulSoup, PDF tables come out through pdfplumber with tabula as backup, and images go through OCR.",
      },
      {
        title: "Work out the analysis",
        detail:
          "Gemini 2.5 Pro generates the analysis code; pandas and DuckDB do the number work and matplotlib draws charts.",
      },
      {
        title: "Answer and clean up",
        detail:
          "Returns the answers as JSON and deletes every temporary file the request created.",
      },
    ],
    highlights: [
      "Falls back from Claude to GPT to Gemini models when a provider is slow or down, with per-model timeouts and retries",
      "Rotates between two Gemini keys across retries",
      "Configured for deployment on Railway",
    ],
    stack: ["Python", "FastAPI", "pandas", "DuckDB", "BeautifulSoup", "httpx", "pdfplumber", "matplotlib", "Gemini, Claude and GPT APIs"],
    code: github("tds_p2"),
  },
  {
    slug: "tds-virtual-ta",
    name: "TDS Virtual TA",
    area: "llm",
    context: "Built for Tools in Data Science at IIT Madras",
    summary:
      "Answers student questions for the Tools in Data Science course using the course notes and the discussion forum, and links the posts it drew on.",
    steps: [
      {
        title: "Take the question",
        detail: "A POST to /query carries the question and, optionally, a screenshot as base64.",
      },
      {
        title: "Read the screenshot",
        detail: "gpt-4o-mini describes the image and the description is added to the question before search.",
      },
      {
        title: "Embed the question",
        detail: "The combined text is embedded with OpenAI's text-embedding-3-small.",
      },
      {
        title: "Retrieve context",
        detail:
          "Cosine similarity against forum and course-note chunks stored in SQLite. Matches must score at least 0.50, and each one brings its neighbouring chunks along for context.",
      },
      {
        title: "Answer with sources",
        detail: "gpt-4o-mini writes the answer from the retrieved text, and the cited links are returned alongside it.",
      },
    ],
    highlights: [
      "GET /health reports database status and how many chunks have embeddings",
      "Backs off and retries when the API rate-limits (HTTP 429)",
      "Falls back to the top retrieved URLs when the model does not cite its sources",
    ],
    stack: ["Python", "FastAPI", "SQLite", "OpenAI embeddings", "gpt-4o-mini", "AI Pipe"],
    code: github("TDS-VIRTUAL-TA"),
    live: { href: "https://tds-virtual-ta-steel.vercel.app", label: "Deployed API" },
  },
  {
    slug: "prompt2ppt",
    name: "Prompt2PPT",
    area: "llm",
    summary:
      "Turns long text or Markdown into a PowerPoint deck that keeps the fonts, colours and layouts of a template you upload.",
    steps: [
      {
        title: "Bring the content",
        detail: "Paste text or Markdown, add an optional note on the deck's purpose, and upload a .pptx or .potx template.",
      },
      {
        title: "Bring your own key",
        detail: "Works with OpenAI, Anthropic or Gemini. The key is used in memory for that one request and never stored or logged.",
      },
      {
        title: "Plan the slides",
        detail: "The model splits the content into slides and bullet points and returns them as structured JSON.",
      },
      {
        title: "Fill the template",
        detail: "python-pptx fills the template's own layouts and placeholders, and reuses the pictures already in it.",
      },
      {
        title: "Download the deck",
        detail: "The finished .pptx downloads straight from the page.",
      },
    ],
    highlights: [
      "Truncates very large inputs to stay inside model token limits",
      "Runs anywhere a Procfile or Docker image runs",
    ],
    stack: ["Python", "FastAPI", "python-pptx", "OpenAI, Anthropic and Gemini APIs", "HTML, CSS, JavaScript"],
    code: github("Promt2PPT"),
  },
  {
    slug: "browser-llm-agent",
    name: "Browser LLM Agent",
    area: "agents",
    summary:
      "A chat agent that runs entirely in the browser and can search the web, consult a second model and execute JavaScript on its way to an answer.",
    steps: [
      {
        title: "Pick a model",
        detail: "Choose OpenAI, Anthropic, Gemini or AI Pipe, then a model from that provider.",
      },
      {
        title: "Let the model decide",
        detail: "Each turn sends the conversation and the tool definitions; the model answers or asks for tools.",
      },
      {
        title: "Run the tools",
        detail:
          "web_search, aipipe_proxy and js_exec, which runs code in a Web Worker and captures its console output.",
      },
      {
        title: "Loop until done",
        detail: "Tool results go back to the model, for up to eight turns, until it answers without asking for a tool.",
      },
    ],
    highlights: [
      "Translates Anthropic and Gemini tool formats to and from the OpenAI schema",
      "Falls back to DuckDuckGo and Wikipedia when no Google search key is set",
      "Exports the whole conversation as JSON",
    ],
    stack: ["JavaScript", "Web Workers", "Bootstrap 5", "OpenAI, Anthropic and Gemini APIs", "Vercel"],
    code: github("LLM_Agent"),
  },
  {
    slug: "parkease",
    name: "ParkEase",
    area: "web",
    summary:
      "A vehicle parking app where drivers book spots, slots are allocated automatically and a scheduled job emails a daily summary.",
    parts: [
      { title: "Flask API", detail: "Booking and slot allocation, with JWT authentication." },
      { title: "Vue.js front end", detail: "Booking and availability screens that talk to the Flask API." },
      { title: "Redis", detail: "Caching, and the message broker for background jobs." },
      { title: "Celery worker and beat", detail: "Sends the daily summary email on a schedule, tested locally against MailHog." },
      { title: "pytest suite", detail: "Tests live alongside the app." },
    ],
    highlights: ["Background jobs run outside the request cycle, so booking stays fast"],
    stack: ["Python", "Flask", "Vue.js", "SQLite", "Redis", "Celery", "JWT", "pytest"],
    code: github("ParkEase"),
  },
  {
    slug: "placement-portal",
    name: "Placement Portal",
    area: "web",
    summary:
      "Runs campus placements for three roles: admins approve companies and drives, companies shortlist and schedule interviews, and students apply to drives they are eligible for.",
    parts: [
      {
        title: "Admins",
        detail: "Approve or reject companies and drives, search records, blacklist users and see placement statistics.",
      },
      {
        title: "Companies",
        detail: "Create drives once approved, review applicants, shortlist, schedule interviews and generate offer letters.",
      },
      {
        title: "Students",
        detail: "Browse drives, apply when eligibility checks pass, track status, upload a résumé and export history as CSV.",
      },
      {
        title: "Background jobs",
        detail: "Celery sends daily deadline reminders and monthly placement reports, and builds CSV exports asynchronously.",
      },
    ],
    highlights: ["Redis caching in front of SQLAlchemy models", "Flask-Migrate for schema changes"],
    stack: ["Python", "Flask", "SQLAlchemy", "Vue 3", "Bootstrap 5", "Celery", "Redis", "SQLite"],
    code: github("placement_portal"),
  },
  {
    slug: "quiz-master-v1",
    name: "Quiz Master V1",
    area: "web",
    summary:
      "Exam practice across several courses: an admin builds subjects, chapters and timed quizzes, and students take them against a live countdown and review their scores.",
    parts: [
      { title: "Admin dashboard", detail: "Create subjects, chapters and multiple-choice quizzes, manage users and see attempt statistics." },
      { title: "Student dashboard", detail: "Filter quizzes by subject and chapter, take them timed, and review results and history." },
      { title: "Timer", detail: "A live countdown auto-submits the quiz when time runs out and scores it immediately." },
      { title: "Data model", detail: "User, Subject, Chapter, Quiz, Question, Option and Result tables in SQLite." },
    ],
    highlights: ["Hashed passwords, role-based access and server-side input validation"],
    stack: ["Python", "Flask", "Jinja2", "SQLite", "Bootstrap"],
    code: github("Quiz-Master-V1"),
  },
  {
    slug: "portcast-take-home",
    name: "Portcast take-home",
    area: "analysis",
    context: "Take-home for Portcast's Data Analyst Intern role",
    summary:
      "A three-part analysis: why a container reached Rotterdam a week late, what inaccurate ETAs cost a manufacturer each year, and what's wrong with an AI-written plan to integrate 50+ tracking feeds.",
    parts: [
      {
        title: "Root cause",
        detail:
          "Compared the booked routing with actual tracking events. The ocean leg took the planned 35 days; the week was lost at Singapore, where the container missed its booked vessel and left on a later one.",
      },
      {
        title: "Guesstimate",
        detail:
          "Split the cost of ETA error into safety stock, expedited freight and detention or demurrage, with stated assumptions and low, base and high cases.",
      },
      {
        title: "AI sanity check",
        detail:
          "Found six claims to push back on in an AI-drafted integration plan and rewrote it around source adapters, a data-quality layer and a phased rollout.",
      },
    ],
    highlights: [
      "Traced the 7-day delay to a missed connection at Singapore, not slower ocean transit",
      "Wrote an SQL early-warning rule that would have flagged it about five weeks before the promised ETA",
      "Estimated about $2.3M a year (range $0.7M to $5.8M), with expedited freight as the biggest lever",
      "Said exactly where AI review changed the answer, part by part",
    ],
    stack: ["SQL", "Python", "Root-cause analysis", "Estimation", "Data quality"],
    code: `${github}/portcast-data-analyst-take-home`,
    live: {
      href: `${github}/portcast-data-analyst-take-home/blob/main/solution/Anubrata_De_Portcast_Take_Home_Solution.pdf`,
      label: "Read the write-up",
    },
  },
];

type Model = {
  name: string;
  /** What kind of problem it is, in a few words. */
  taskLabel: string;
  /** The question it answers. */
  question: string;
};

/** Smaller course projects: machine learning, deep learning and a business case. */
export const models: Model[] = [
  {
    name: "Cinema audience forecasting",
    taskLabel: "Time-series forecasting",
    question: "How many people will come to each theatre on a given day?",
  },
  {
    name: "Messy Mashup (DLGenAI)",
    taskLabel: "Deep learning, audio",
    question: "Which genre is this noisy mashup of mixed instrument stems?",
  },
  {
    name: "Hotel booking cancellation",
    taskLabel: "Binary classification",
    question: "Will this booking be cancelled?",
  },
  {
    name: "House price prediction",
    taskLabel: "Regression",
    question: "What will this house sell for?",
  },
  {
    name: "Movie review sentiment",
    taskLabel: "Multiclass classification",
    question: "Is this review negative, neutral or positive?",
  },
  {
    name: "Clothing shop strategy (BDM capstone)",
    taskLabel: "Business analysis",
    question: "How can a readymade garments shop fix its working capital and grow?",
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function neighbours(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  return {
    previous: projects[(i - 1 + projects.length) % projects.length],
    next: projects[(i + 1) % projects.length],
  };
}
