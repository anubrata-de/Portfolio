/**
 * Words on the home page. Edit freely: every section reads from here.
 */

/** Section labels: a romaji word with its English meaning. */
export const episodes = {
  hello: { jp: "Konnichiwa", en: "hello" },
  beliefs: { jp: "Shinnen", en: "what I believe" },
  work: { jp: "Sakuhin", en: "the work" },
  offClock: { jp: "Yasumi", en: "off the clock" },
  next: { jp: "Jikai", en: "next episode" },
  about: { jp: "Jikoshōkai", en: "self-introduction" },
  contact: { jp: "Renraku", en: "get in touch" },
  lost: { jp: "Maigo", en: "lost" },
} as const;

export const hero = {
  lead: "Data should feel",
  /** Cycles after the lead line. The first one is shown when motion is reduced. */
  words: ["useful.", "obvious.", "honest.", "sugoi."],
  intro:
    "I study data science at IIT Madras and build LLM agents, retrieval systems and the apps that put them in front of people.",
};

export const beliefs = [
  {
    title: "Make answers checkable.",
    body: "If a model says it, show where it read it.",
    colour: "sakura",
  },
  {
    title: "Plan for the model failing.",
    body: "Timeouts, retries and a fallback, sorted before the demo.",
    colour: "sora",
  },
  {
    title: "Ship it, then make it nice.",
    body: "A working thing in someone's hands beats a perfect notebook.",
    colour: "matcha",
  },
] as const;

/** Small facts in the scrolling strip. `doodle` picks the drawing next to it. */
export const tiles = [
  { label: "From West Bengal", doodle: "tram" },
  { label: "Learning Japanese, slowly", doodle: "kana" },
  { label: "Chess: 1670 rapid", doodle: "pawn" },
  { label: "Ex-Secretary, Nilgiri House", doodle: "badge" },
  { label: "Night owl", doodle: "moon" },
  { label: "Ex esports event coordinator", doodle: "gamepad" },
  { label: "Python first", doodle: "brackets" },
  { label: "Just one more episode", doodle: "play" },
  { label: "Currently in my training arc", doodle: "spark" },
] as const;

export const lookingFor = [
  "Internships in data science, ML or backend engineering",
  "Problems that real people actually have",
  "A team I can learn a lot from (senpai welcome)",
];

export const endCard = {
  subtitle: "Mata ne! See you in the next episode.",
  signature: "Anubrata",
  /** Katakana for the name, used on the red seal. */
  seal: "アヌ",
};
