import { site } from "@/data/site";

const items = [
  {
    q: "What kind of roles are you looking for?",
    a: "Internships in data science, machine learning or backend engineering, ideally where I can ship something people use rather than only a notebook.",
  },
  {
    q: "What's your main stack?",
    a: "Python first: pandas, scikit-learn and DuckDB for data; FastAPI and Flask with SQLAlchemy, Celery and Redis on the back end; Vue 3 on the front end; and the OpenAI, Anthropic and Gemini APIs for LLM work.",
  },
  {
    q: "Which project should I look at first?",
    a: "The Data Analyst Agent for agents and data handling, the TDS Virtual TA for retrieval, and the Placement Portal for a full-stack app with roles and background jobs.",
  },
  {
    q: "Where can I see your code?",
    a: "Every project on this site links to its repository on GitHub at github.com/anubrata-de.",
  },
  {
    q: "How do I reach you?",
    a: `Email ${site.email}, message me on LinkedIn, or use the contact form.`,
  },
];

/** Native disclosure widgets: keyboard and screen-reader friendly with no script. */
export function FAQ() {
  return (
    <div className="faq">
      {items.map((item, i) => (
        <details key={item.q} className="faq__item" open={i === 0}>
          <summary>{item.q}</summary>
          <p>{item.a}</p>
        </details>
      ))}
    </div>
  );
}
