import type { Step } from "@/data/projects";

/** Ordered stages of a request, each with a short title and a sentence of detail. */
export function Pipeline({ steps }: { steps: Step[] }) {
  return (
    <ol className="pipeline">
      {steps.map((step, i) => (
        <li key={step.title} className="pipeline__step">
          <span className="pipeline__index" aria-hidden="true">
            {i + 1}
          </span>
          <span className="pipeline__title">{step.title}</span>
          <p className="pipeline__detail">{step.detail}</p>
        </li>
      ))}
    </ol>
  );
}
