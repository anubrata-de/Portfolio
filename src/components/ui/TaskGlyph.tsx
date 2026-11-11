import type { ReactNode } from "react";
import type { Model } from "@/data/projects";

/** Small drawings of what each kind of model does. Illustrative, not results. */
export function TaskGlyph({ task }: { task: Model["task"] }) {
  return (
    <svg className="task-glyph" viewBox="0 0 120 72" role="img" aria-label={labels[task]}>
      <path className="task-glyph__axis" d="M8 64 H114 M8 64 V6" />
      {drawings[task]}
    </svg>
  );
}

const labels: Record<Model["task"], string> = {
  classification: "Two groups of points separated by a decision boundary",
  regression: "Points trending upward with a fitted line",
  multiclass: "A three by three confusion matrix, strongest along the diagonal",
  forecast: "A history line continuing as a dashed forecast with an uncertainty band",
};

const a = [
  [22, 18], [30, 26], [18, 32], [34, 14], [26, 40], [40, 30],
] as const;
const b = [
  [78, 46], [88, 38], [70, 54], [96, 50], [84, 56], [100, 40], [64, 44],
] as const;
const scatter = [
  [16, 56], [24, 50], [30, 54], [38, 44], [46, 46], [52, 38], [60, 40], [68, 30], [76, 34], [84, 24], [92, 26], [102, 16],
] as const;
const matrix = [
  [0.9, 0.15, 0.1],
  [0.2, 0.8, 0.25],
  [0.1, 0.2, 0.85],
];

const drawings: Record<Model["task"], ReactNode> = {
  classification: (
    <g>
      <path className="task-glyph__line" d="M52 6 C 58 26, 46 40, 62 64" />
      {a.map(([x, y]) => (
        <circle key={`a${x}${y}`} className="task-glyph__dot task-glyph__dot--hollow" cx={x} cy={y} r={3.2} />
      ))}
      {b.map(([x, y]) => (
        <circle key={`b${x}${y}`} className="task-glyph__dot" cx={x} cy={y} r={3.2} />
      ))}
    </g>
  ),
  regression: (
    <g>
      <path className="task-glyph__line" d="M12 58 L108 14" />
      {scatter.map(([x, y]) => (
        <circle key={`${x}${y}`} className="task-glyph__dot" cx={x} cy={y} r={3} />
      ))}
    </g>
  ),
  multiclass: (
    <g transform="translate(30 8)">
      {matrix.flatMap((row, r) =>
        row.map((value, c) => (
          <rect
            key={`${r}${c}`}
            className="task-glyph__cell"
            x={c * 19}
            y={r * 18}
            width={17}
            height={16}
            rx={2}
            style={{ opacity: 0.12 + value * 0.88 }}
          />
        )),
      )}
    </g>
  ),
  forecast: (
    <g>
      <path className="task-glyph__band" d="M70 30 L112 14 L112 46 L70 38 Z" />
      <path className="task-glyph__line" d="M10 50 L20 44 L30 48 L40 36 L50 40 L60 30 L70 34" />
      <path className="task-glyph__line task-glyph__line--dashed" d="M70 34 L80 30 L90 32 L100 26 L112 28" />
    </g>
  ),
};
