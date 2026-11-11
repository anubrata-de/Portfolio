import { models } from "@/data/projects";
import { TaskGlyph } from "@/components/ui/TaskGlyph";
import { delay } from "@/components/ui/RevealLines";

export function Models({ headingLevel = 2 }: { headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const ItemHeading = headingLevel === 2 ? "h3" : "h4";
  return (
    <section className="models" id="models" aria-labelledby="models-heading">
      <Heading id="models-heading" className="section-title" data-reveal>
        Machine learning
      </Heading>
      <p className="models__intro" data-reveal>
        Four supervised learning problems, one of each common kind.
      </p>
      <ul className="models__grid">
        {models.map((model, i) => (
          <li key={model.name} className="model glass" data-reveal style={delay(0.06 * i)}>
            <TaskGlyph task={model.task} />
            <ItemHeading className="model__name">{model.name}</ItemHeading>
            <p className="model__task">{model.taskLabel}</p>
            <p className="model__question">{model.question}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
