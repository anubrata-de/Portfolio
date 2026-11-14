/**
 * The About page's record: roles ("arcs"), volunteering ("side quests") and
 * achievements ("trophy shelf"). Sources: LinkedIn and Anubrata's resumes.
 * Keep them in step when either changes.
 */

export type Arc = {
  when: string;
  kind: "Study" | "Leadership" | "Work";
  role: string;
  org: string;
  detail: string;
  /** Concrete results, shown as a short list under the detail. */
  points?: string[];
};

/** Oldest first. */
export const arcs: Arc[] = [
  {
    when: "Sep 2023 – Aug 2027",
    kind: "Study",
    role: "BS in Data Science and Applications",
    org: "IIT Madras",
    detail:
      "Foundation level, the Diploma in Programming and the Diploma in Data Science are done. Most of the projects on this site started here.",
  },
  {
    when: "Oct 2023 – Sep 2024",
    kind: "Leadership",
    role: "Coordinator",
    org: "Heighers eSports, IIT Madras",
    detail: "Ran the competitive gaming side of one of the busiest student societies.",
    points: [
      "Ran weekly tournaments for 500+ players",
      "Handled events end to end, from outreach to partnerships, as the society grew past 3,000 members",
      "Set up the recruitment pipeline for new members",
    ],
  },
  {
    when: "Aug 2024 – Jul 2025",
    kind: "Leadership",
    role: "Deputy Secretary",
    org: "Code Crafters, IIT Madras BS",
    detail: "Part of the senior team running the program's coding society.",
    points: [
      "Helped grow membership from 800 to 2,500+",
      "Organised 8+ coding events and hackathons; participation rose by 250%",
      "Mentored 50+ members on hackathon projects and deploying them",
    ],
  },
  {
    when: "Jul 2025 – May 2026",
    kind: "Leadership",
    role: "Secretary",
    org: "Nilgiri House, IIT Madras BS",
    detail:
      "Led the house and worked with institute leadership on governance and events. Received a Certificate of Appreciation for the term.",
    points: [
      "Ran operations for a house of 5,000+ students",
      "Resolved 300+ student issues a month",
      "Organised networking events that brought together 100+ students from different regions",
    ],
  },
  {
    when: "Mar – Apr 2026",
    kind: "Work",
    role: "Academic Mentor (Inside Sales)",
    org: "ODA Class, Bengaluru",
    detail:
      "Counselled students and parents on course choices, ran demo classes and took students from a trial class to enrolment, keeping the CRM up to date along the way.",
  },
];

export type Quest = {
  role: string;
  event: string;
  when: string;
  detail: string;
};

export const volunteering: Quest[] = [
  {
    role: "Event Coordinator",
    event: "Paradox '24",
    when: "2024",
    detail: "Coordinated esports events, including Ranneeti 3.0, at the annual offline fest of IITM BS.",
  },
  {
    role: "Meet-Up Coordinator",
    event: "IITM BS Kolkata Meet-Up",
    when: "28 Jul 2024",
    detail: "Coordinated the Kolkata meet-up that Nilgiri House organised for students in the region.",
  },
  {
    role: "Volunteer",
    event: "Margazhi '24",
    when: "2024",
    detail: "Volunteered at the annual online fest of IITM BS.",
  },
];

export type Trophy = {
  /** What sits on the medal: a place, a grade or a short word. */
  badge: string;
  tone: "gold" | "silver" | "bronze" | "plain";
  title: string;
  meta: string;
};

export type TrophyGroup = {
  name: string;
  doodle: "pawn" | "gamepad" | "book" | "mic";
  items: Trophy[];
};

export const achievements: TrophyGroup[] = [
  {
    name: "Chess",
    doodle: "pawn",
    items: [
      { badge: "2nd", tone: "silver", title: "India College Chess Championship", meta: "Team IITM BS, hosted by Chess.com, 2025" },
      { badge: "2nd", tone: "silver", title: "Chessmates", meta: "2026" },
      { badge: "3rd", tone: "bronze", title: "Nilgiri Inter-Regional Chess Tournament", meta: "Summer 2025" },
      { badge: "3rd", tone: "bronze", title: "Nilgiri Inter-Regional Chess Tournament", meta: "Winter 2025" },
      { badge: "2nd", tone: "silver", title: "Nadia District Chess Championship", meta: "2016" },
    ],
  },
  {
    name: "Esports",
    doodle: "gamepad",
    items: [
      { badge: "1st", tone: "gold", title: "Free Fire, Aarambh 4.0", meta: "Margazhi '26" },
      { badge: "1st", tone: "gold", title: "Free Fire, Aarambh 3.0", meta: "Margazhi '25" },
      { badge: "Semi", tone: "plain", title: "Free Fire GTVWS", meta: "Semi-finalist, 2021" },
    ],
  },
  {
    name: "Academics",
    doodle: "book",
    items: [
      { badge: "Award", tone: "gold", title: "NPTEL STAR Event Award", meta: "IIT Kharagpur, Jul 2026" },
      { badge: "A", tone: "plain", title: "National Science Talent Search", meta: "Grade A in 2013 and 2014, Grade B in 2012" },
    ],
  },
  {
    name: "Arts and sport",
    doodle: "mic",
    items: [
      { badge: "On air", tone: "plain", title: "Poetry recitation on All India Radio", meta: "Akashvani Kolkata, 2013" },
      { badge: "1st Div", tone: "plain", title: "Britii Pariksha", meta: "2013" },
      { badge: "1st Div", tone: "plain", title: "Arambhik Painting", meta: "Part 1 and Final" },
      { badge: "Played", tone: "plain", title: "Cricket and marathon", meta: "District-level competitions" },
    ],
  },
];

export const languages = {
  fluent: ["Bengali", "Hindi", "English"],
  learning: ["Japanese", "Sanskrit"],
};
