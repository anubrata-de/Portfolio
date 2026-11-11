# anubrata.de

Portfolio for Anubrata De: BS in Data Science and Applications at IIT Madras (2023–2027), former Secretary of Nilgiri House, building LLM agents, retrieval apps and full-stack Flask and Vue systems.

The site is a sketchbook with anime touches: grid paper and ink, with colours taken from anime skies and Japanese craft (torii vermilion, sakura, sky blue, matcha). Every drawing is hand-made SVG. Each section is an "episode" labelled in romaji with its English meaning (Konnichiwa, Shinnen, Sakuhin…), and the footer is an anime end card.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

Requires Node 20.9 or later.

## What's on the home page

| Section | What it shows |
| --- | --- |
| Konnichiwa | Name (with the katakana version running down the side), a line that cycles through words ("Data should feel useful, obvious, honest, sugoi"), the local time, and a drawing of a late-night desk under a twilight sky, with a manga sound effect. |
| Shinnen | Three rules on taped sticky notes. |
| Sakuhin | Every project as a sketch of its main screen, pinned on ruled paper. Hover straightens a card; click opens the project. Below them are the machine learning "side quests". |
| Yasumi | A slow strip of small facts with doodles. Pauses on hover. |
| Jikai | What I'm looking for, as a checklist. Ticking each box draws more of the scene next to it. |
| End card | Sunset over rooftops and power lines, a fansub-style subtitle, a signature and a red name seal. |

Motion is kept small: the cycling word, notes settling in once, and the checklist drawing. With *reduce motion* turned on, all of it is still and the strip becomes a static row.

## Editing content

All content lives in `src/data/`:

| File | Holds |
| --- | --- |
| `site.ts` | Name, email, location, social links |
| `home.ts` | Section labels, hero line, beliefs, facts strip, checklist, end card |
| `journey.ts` | Roles and milestones (the About page's story arcs) and languages |
| `projects.ts` | Projects (summary, steps or parts, highlights, stack, links) and smaller side quests |
| `skills.ts` | Toolkit |

Each project's screen sketch is in `src/components/projects/ScreenSketch.tsx`, keyed by the project's `slug`. A new project without a sketch still shows its window frame.

## Environment variables

| Variable | Needed for |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Absolute URLs in metadata, `robots.txt` and the sitemap. On Vercel the production URL is picked up automatically. |
| `NEXT_PUBLIC_FORMSPREE_ID` | Optional. With a [Formspree](https://formspree.io) form ID the contact form sends messages directly; without it, the form opens the visitor's email app with the message filled in. Only plain alphanumeric IDs are accepted. |

## Security

- Security headers on every route (`next.config.ts`): Content Security Policy limited to this origin plus Formspree, `frame-ancestors 'none'` and `X-Frame-Options: DENY`, `nosniff`, a strict referrer policy, `Cross-Origin-Opener-Policy`, HSTS, and a Permissions Policy that blocks microphone, camera, location, payment and USB.
- `script-src` keeps `'unsafe-inline'` because Next.js boots pages with inline scripts; per-request nonces would make every page dynamic.
- No cookies, analytics or browser storage. User input is rendered as text, length-limited, and the form endpoint is validated.
- All new-tab links use `rel="noopener noreferrer"`. The `X-Powered-By` header is off.

## Stack

Next.js 16 (App Router), React 19, TypeScript and plain CSS. No other runtime dependencies.
Fonts: Instrument Sans for all reading text and Nothing You Could Do for handwritten notes, self-hosted by `next/font`. The small Japanese episode labels use the system's Japanese font.
