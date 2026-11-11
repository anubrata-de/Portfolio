"use client";

import { useId, useState } from "react";
import { audio } from "@/lib/audio";
import { cn } from "@/lib/cn";

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
    a: "Email anubratade01@gmail.com, message me on LinkedIn, or use the contact form.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();
  return (
    <ul className="faq">
      {items.map((item, i) => {
        const isOpen = open === i;
        const panel = `${base}-${i}`;
        return (
          <li key={item.q} className={cn("faq__item glass", isOpen && "is-open")} data-reveal>
            <button
              type="button"
              className="faq__q"
              aria-expanded={isOpen}
              aria-controls={panel}
              onClick={() => {
                setOpen(isOpen ? null : i);
                audio.click();
              }}
            >
              <span className="faq__num">{String(i + 1).padStart(2, "0")}</span>
              <span>{item.q}</span>
              <span className="faq__icon" aria-hidden="true">
                {isOpen ? "−" : "+"}
              </span>
            </button>
            <div id={panel} className="faq__a" hidden={!isOpen}>
              <p>{item.a}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
