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

/** What I can do, each backed by a project. Shown as the numbered capabilities list. */
export const capabilities = [
  { name: "LLM agents and tool calling", proof: "Data Analyst Agent, Browser LLM Agent" },
  { name: "Retrieval and embeddings", proof: "TDS Virtual TA" },
  { name: "Web scraping and data cleaning", proof: "Data Analyst Agent" },
  { name: "Analysis with pandas and DuckDB", proof: "Data Analyst Agent" },
  { name: "Machine learning with scikit-learn", proof: "Four supervised models" },
  { name: "Time-series forecasting", proof: "Cinema audience forecasting" },
  { name: "FastAPI and Flask back ends", proof: "Six projects" },
  { name: "Background jobs with Celery and Redis", proof: "ParkEase, Placement Portal" },
  { name: "SQL and data modelling", proof: "Quiz Master V1, Placement Portal" },
  { name: "Vue 3 front ends", proof: "ParkEase, Placement Portal" },
  { name: "Prompting for structured JSON", proof: "Prompt2PPT" },
  { name: "Shipping to Vercel, Railway and Docker", proof: "Four deployments" },
] as const;
