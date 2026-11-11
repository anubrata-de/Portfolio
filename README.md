# anubrata.de

Portfolio for Anubrata De: BS in Data Science and Applications at IIT Madras, Secretary of Nilgiri House (2025–26), building LLM agents, retrieval apps and full-stack Flask and Vue systems.

A night (or dawn) landscape rendered live in WebGL, a particle sculpture that re-forms for every section, a generative soundtrack, a custom cursor, scroll-driven type, and an on-site assistant. There is also a simple version with no animation, which anyone can switch to.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

Requires Node 20.9 or later.

## The experience

| Piece | What it does |
| --- | --- |
| Intro | The wordmark in the centre and a loading line across the bottom that tracks real progress (fonts, the scene compiling, page load). Then **Enter with sound**, **Enter without sound**, or **Simple version, no animation**, with the simple one marked as recommended on slow devices. Shown once per browser session. |
| Scene | Hand-written WebGL 2: sky, moon or sun haze, clouds, stars, three hill layers, a reflective lake, grass, fireflies at night and petals at dawn. A particle sculpture is scrubbed by the scroll position: between two sections it bursts apart, the camera flies through the particles, and the next shape forms (tree, data wave, agent loop, retrieval clusters, globe, paper plane). It also moves away from the pointer, and the hills, moon and clouds drift with the page. |
| Sound | Generated live with the Web Audio API: an evolving chord pad, wind and the odd bell, plus interface sounds. No audio files. The header's equaliser bars follow the real output. Pauses when the tab is hidden. |
| Cursor | A glowing orb that trails the pointer, grows over links, shows **View**, **Drag** or **Ask** labels, and pulls buttons marked `data-magnetic` towards it. Mouse and trackpad only. |
| Scroll | Smooth scrolling (Lenis), headlines that slide up line by line, headlines that bend on a curve as they enter and leave the screen (and split into colour only while the page is moving, so they are always sharp at rest), and section text that drifts against the scroll. |
| Work | A curved 3D carousel (drag, arrow keys or buttons) with a filter, plus a full list. |
| Anu | The orb in the corner. Answers questions from notes generated from this site's data using TF-IDF retrieval, shows the source and match score, reads answers aloud when sound is on, and accepts voice questions where the browser supports it. No AI service, nothing leaves the browser. |
| Themes | Night and dawn, following the system until the visitor chooses. The scene crossfades between palettes. |

### Two versions

**Settings → Animations** (also offered in the intro, the menu, and automatically when needed) switches between:

- **Full**: everything above.
- **Simple**: the same pages and content. The scene is drawn once as a still image; no smooth scrolling, reveals, cursor, warping or idle motion. Chosen automatically for visitors who have *reduce motion* or *data saver* turned on, browsers without WebGL 2, and software-only graphics.

## Performance

Built to stay smooth rather than to look good only on a fast machine:

- **Quality tiers**: High (8,000 particles, up to 2× pixel density) on capable desktops and laptops; Low (3,000 particles, 1.25×) on phones, tablets and weaker machines. Detected on first visit, changeable under Settings → Quality.
- **Adaptive rendering**: frame rate is measured every second. Below 45 fps, resolution and particle count step down (four steps, to 55%); with headroom they step back up. If a device still can't hold 24 fps, a notice offers the simple version.
- **Cheap where it doesn't show**: the landscape (the expensive shader) renders at 0.75 pixels per CSS pixel into a texture and is scaled up; particles render at full resolution on top.
- **Idle when hidden**: nothing renders behind the intro, the menu or the assistant, or in a background tab. Cursor and hover animations sleep when still.
- **Low quality** also turns off backdrop blur over the moving scene, the most expensive CSS effect.
- **Dependencies**: Next.js, React and Lenis. No 3D, animation or CSS framework libraries.

Rough requirements for the full version: any GPU from the last six or so years with WebGL 2 (integrated graphics are fine). Anything else gets the simple version.

## Editing content

All content lives in `src/data/`:

| File | Holds |
| --- | --- |
| `site.ts` | Name, email, location, social links, optional résumé link |
| `projects.ts` | Projects (summary, pipeline steps or parts, highlights, stack, links) and ML models |
| `skills.ts` | Toolkit and the numbered capabilities list |

The assistant's knowledge (`src/lib/assistant/knowledge.ts`) is generated from these files, so it stays in sync. Section shapes are set per section with `data-scene` and `data-scene-side`.

To add a résumé, create a `public/` folder, put the PDF in it, and set `resume` in `site.ts` to its path (for example `"/anubrata-de-resume.pdf"`).

## Environment variables

| Variable | Needed for |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Absolute URLs in metadata, `robots.txt` and the sitemap. On Vercel the production URL is picked up automatically. |
| `NEXT_PUBLIC_FORMSPREE_ID` | Optional. With a [Formspree](https://formspree.io) form ID the contact form sends messages directly; without it, the form opens the visitor's email app with the message filled in. Only plain alphanumeric IDs are accepted. |

## Security

- Security headers on every route (`next.config.ts`): Content Security Policy limited to this origin plus Formspree, `frame-ancestors 'none'` and `X-Frame-Options: DENY`, `nosniff`, a strict referrer policy, `Cross-Origin-Opener-Policy`, HSTS, and a Permissions Policy that allows the microphone only on this site (for voice questions) and blocks camera, location, payment and USB.
- `script-src` keeps `'unsafe-inline'` because Next.js boots pages with inline scripts; per-request nonces would make every page dynamic.
- No secrets in the code. User input is rendered as text, length-limited, and the form endpoint is validated.
- All new-tab links use `rel="noopener noreferrer"`. The `X-Powered-By` header is off.

## Stack

Next.js 16 (App Router), React 19, TypeScript, plain CSS, WebGL 2, Web Audio, Lenis.
Fonts: Instrument Serif (display), Geist (text) and IBM Plex Mono (labels), self-hosted by `next/font`. No text is set below 12px, and text meets 4.5:1 contrast in both themes. Arrows and icons are inline SVG, so they look the same on every system.
