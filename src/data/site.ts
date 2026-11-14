/**
 * Everything personal on the site lives here, so updating the portfolio
 * never means hunting through components.
 */

export const site = {
  name: "Anubrata De",
  email: "anubrata.2016@gmail.com",
  /**
   * Formspree form ID for the contact form. It is public by design (it appears
   * in the address the form posts to), so it lives here rather than in an env
   * var. Leave it empty and the form opens the visitor's email app instead.
   */
  formspreeId: "" as string,
  location: "West Bengal, India",
  year: 2026,
  description:
    "Anubrata De studies data science at IIT Madras and builds LLM agents, retrieval systems and the full-stack apps around them.",
  social: [
    { label: "GitHub", handle: "anubrata-de", href: "https://github.com/anubrata-de" },
    { label: "LinkedIn", handle: "anubratade", href: "https://www.linkedin.com/in/anubratade/" },
    { label: "Instagram", handle: "anubrata.de", href: "https://www.instagram.com/anubrata.de/" },
  ],
} as const;

export const github = (repo: string) => `https://github.com/anubrata-de/${repo}`;
