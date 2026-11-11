/**
 * Words on the home page. Edit freely: every section reads from here.
 */

export const hero = {
  lead: "Data should feel",
  /** Cycles after the lead line. The first one is shown when motion is reduced. */
  words: ["useful.", "obvious.", "honest.", "a little bit magical."],
  intro:
    "I study data science at IIT Madras and build LLM agents, retrieval systems and the apps that put them in front of people.",
};

export const beliefs = [
  {
    title: "Make answers checkable.",
    body: "If a model says it, show where it read it.",
    colour: "yellow",
  },
  {
    title: "Plan for the model failing.",
    body: "Timeouts, retries and a fallback, sorted before the demo.",
    colour: "pink",
  },
  {
    title: "Ship it, then make it nice.",
    body: "A working thing in someone's hands beats a perfect notebook.",
    colour: "mint",
  },
] as const;

/** Small facts in the scrolling strip. `doodle` picks the drawing next to it. */
export const tiles = [
  { label: "Based in Kolkata", doodle: "tram" },
  { label: "Night owl", doodle: "moon" },
  { label: "Just one more episode", doodle: "play" },
  { label: "Secretary, Nilgiri House", doodle: "badge" },
  { label: "Python first", doodle: "brackets" },
  { label: "Currently in my training arc", doodle: "spark" },
  { label: "Chai breaks", doodle: "cup" },
] as const;

export const lookingFor = [
  "Internships in data science, ML or backend engineering",
  "Problems that real people actually have",
  "A team I can learn a lot from (senpai welcome)",
];

export const endCard = {
  subtitle: "See you in the next episode.",
  signature: "Anubrata",
};
