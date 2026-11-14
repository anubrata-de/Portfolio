<!-- portfolio
hide: yes
-->

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
| Sakuhin | Featured projects as sketches of their main screen, pinned on ruled paper. Hover straightens a card; click opens the project. Every project is on the Work page. |
| Yasumi | A slow strip of small facts with doodles. Pauses on hover. |
| Jikai | What I'm looking for, as a checklist. Ticking each box draws more of the scene next to it. |
| End card | Sunset over rooftops and power lines, a fansub-style subtitle, a signature and a red name seal. |

Motion is kept small: the cycling word, notes settling in once, and the checklist drawing. With *reduce motion* turned on, all of it is still and the strip becomes a static row.

## Projects update themselves from GitHub

The project list on the site, and on the GitHub profile README, is built from the public repos on this account:

1. `scripts/sync-projects.mjs` reads every public repo (forks, archived repos and this one are skipped) and writes `src/data/github-projects.json`.
2. `.github/workflows/sync-projects.yml` runs it every morning, and on demand from the **Actions** tab. When something changed it commits the file, and Vercel redeploys.
3. The profile repo (`anubrata-de/anubrata-de`) rebuilds its README from the same file half an hour later.

So a new public repo appears on its own. To control how a repo is shown, put this anywhere in its README; GitHub doesn't display it:

```
<!-- portfolio
title: Data Analyst Agent
tagline: Automated Data Analysis & Visualization API
category: LLM agents and apps
summary: One or two sentences about what it does.
tags: Python, FastAPI, pandas
featured: yes
-->
```

- **category** is one of: LLM agents and apps, Full-stack apps, Machine learning, Business and data analysis, Other projects.
- **featured: yes** pins the project on the home page.
- **hide: yes** leaves a repo out.
- **slug** (optional) fixes the page address, e.g. `slug: data-analyst-agent` → `/projects/data-analyst-agent`.

Without the block, the title comes from the README's first heading, the summary from the repo's About text, and the tags from its topics or main language.

Extra write-up for a project page (steps, highlights) lives in `src/data/projects.ts`, keyed by slug. It's optional.

## Editing content

Everything else lives in `src/data/`:

| File | Holds |
| --- | --- |
| `site.ts` | Name, email, location, social links |
| `home.ts` | Section labels, hero line, beliefs, facts strip, checklist, end card |
| `journey.ts` | Roles and milestones (the About page's story arcs) and languages |
| `projects.ts` | Optional extra detail for project pages (steps, highlights), keyed by slug |
| `github-projects.json` | Generated from GitHub. Don't edit by hand |
| `skills.ts` | Toolkit |

Each project's screen sketch is in `src/components/projects/ScreenSketch.tsx`, keyed by the project's `slug`. A project without its own sketch gets a generic one for its category.

## Environment variables

| Variable | Needed for |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Absolute URLs in metadata, `robots.txt` and the sitemap. On Vercel the production URL is picked up automatically. |

The contact form has no variable: to send messages straight to your inbox, put a [Formspree](https://formspree.io) form ID in `formspreeId` in `src/data/site.ts` (it's public by design, since it appears in the address the form posts to). Left empty, the form opens the visitor's email app with the message filled in. Only plain alphanumeric IDs are accepted.

## Security

- Security headers on every route (`next.config.ts`): Content Security Policy limited to this origin plus Formspree, `frame-ancestors 'none'` and `X-Frame-Options: DENY`, `nosniff`, a strict referrer policy, `Cross-Origin-Opener-Policy`, HSTS, and a Permissions Policy that blocks microphone, camera, location, payment and USB.
- `script-src` keeps `'unsafe-inline'` because Next.js boots pages with inline scripts; per-request nonces would make every page dynamic.
- No cookies, analytics or browser storage. User input is rendered as text, length-limited, and the form endpoint is validated.
- All new-tab links use `rel="noopener noreferrer"`. The `X-Powered-By` header is off.
- No secrets anywhere: the site has no API keys, no server endpoints and no Vercel environment variables. The browser bundle names no environment variable; the site address is worked out in `src/data/site-url.ts`, which only server files import.
- No source maps in production, so the original source files can't be rebuilt from the browser. What the browser runs (HTML, CSS and minified JavaScript) is always visible in DevTools, as on any website, so nothing secret should ever be put in a browser component.
- Also on: no frames, no workers, `upgrade-insecure-requests` in production, and `Cross-Origin-Resource-Policy: same-origin` so other sites can't embed this site's files.

## Stack

Next.js 16 (App Router), React 19, TypeScript and plain CSS. No other runtime dependencies.
Fonts: Instrument Sans for all reading text and Nothing You Could Do for handwritten notes, self-hosted by `next/font`. The small Japanese episode labels use the system's Japanese font.
