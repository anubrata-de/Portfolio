/**
 * Roles and milestones, oldest first, shown as "arcs" on the About page.
 * Source: LinkedIn. Update both together.
 */
export type Arc = {
  when: string;
  role: string;
  org: string;
  detail: string;
};

export const arcs: Arc[] = [
  {
    when: "Sep 2023 – Aug 2027",
    role: "BS in Data Science and Applications",
    org: "IIT Madras",
    detail: "Statistics, machine learning and the tools around them. Most of the projects on this site started here.",
  },
  {
    when: "Oct 2023 – Sep 2024",
    role: "Coordinator",
    org: "Heighers eSports, IIT Madras",
    detail: "Organised esports events, including Ranneeti 3.0 at Paradox '24, and volunteered at Marghazhi '24.",
  },
  {
    when: "Jul 2024",
    role: "Meet-Up Coordinator",
    org: "IITM BS Kolkata Meet-Up",
    detail: "Coordinated the Kolkata meet-up organised by Nilgiri House on 28 July 2024.",
  },
  {
    when: "Aug 2024 – Jul 2025",
    role: "Deputy Secretary",
    org: "Code Crafters, IIT Madras BS",
    detail: "Planned events, ran internal communication and helped members learn from each other.",
  },
  {
    when: "Jul 2025 – May 2026",
    role: "Secretary",
    org: "Nilgiri House, IIT Madras BS",
    detail: "Led coordination and communication for the house. Awarded a Certificate of Appreciation for it.",
  },
  {
    when: "Mar – Apr 2026",
    role: "Academic Mentor",
    org: "ODA Class, Bengaluru",
    detail: "Mentored and taught students on-site.",
  },
];

export const languages = {
  fluent: ["Bengali", "Hindi", "English"],
  learning: ["Japanese", "Sanskrit"],
};
