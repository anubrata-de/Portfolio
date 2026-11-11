import { site } from "@/data/site";

const items = [
  {
    q: "Which project should I look at first?",
    a: "The Data Analyst Agent for agents and data handling, the Virtual Teaching Assistant for retrieval, the Placement Portal Application for a full-stack app with roles and background jobs, and the Portcast take-home for analysis.",
  },
  {
    q: "Do you actually speak Japanese?",
    a: "A little. I'm at an elementary level, enough for the episode labels on this site and to follow along with subtitles off for a few lines at a time.",
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
    <div>
      {items.map((item, i) => (
        <details key={item.q} className="faq__item" open={i === 0}>
          <summary>{item.q}</summary>
          <p>{item.a}</p>
        </details>
      ))}
    </div>
  );
}
