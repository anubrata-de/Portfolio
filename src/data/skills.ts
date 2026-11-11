/** Grouped by what the tools are used for. Every entry appears in at least one project. */
export const toolkit = [
  { group: "Languages", items: ["Python", "SQL", "JavaScript"] },
  { group: "Data and ML", items: ["pandas", "NumPy", "scikit-learn", "DuckDB", "matplotlib"] },
  {
    group: "LLM work",
    items: ["OpenAI, Anthropic and Gemini APIs", "Embeddings and retrieval", "Tool calling", "Structured JSON output"],
  },
  { group: "Back end", items: ["FastAPI", "Flask", "SQLAlchemy", "Celery", "Redis", "SQLite", "REST APIs"] },
  { group: "Front end", items: ["Vue 3", "Jinja2", "Bootstrap", "HTML and CSS"] },
  { group: "Shipping", items: ["Vercel", "Railway", "Docker", "pytest", "Git"] },
] as const;
