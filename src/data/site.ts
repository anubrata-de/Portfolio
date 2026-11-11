/**
 * Everything personal on the site lives here, so updating the portfolio
 * never means hunting through components.
 */

function resolveSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "http://localhost:3000";
}

export const site = {
  name: "Anubrata De",
  url: resolveSiteUrl(),
  email: "anubrata.2016@gmail.com",
  location: "Kolkata, India",
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
