# Shahmeer Ali — personal portfolio

A working, local first version of Shahmeer’s portfolio. Designed primarily for desktop and adapted for phones: monochrome typography, personal photographs, short experience summaries, brief experience rows and future project detail templates, smooth scrolling, and an animated portfolio companion.

## Preview

Open http://127.0.0.1:3000 while the development server is running.

```sh
npm install
npm run dev
```

Requires Node.js 20.9 or newer. Run commands inside this folder.

## Content

Edit `src/content/portfolio.ts` to change the introduction, email, experience, projects, slideshow captions, or the companion’s greetings. Seven experiences appear as compact summaries on the homepage, with supplied dates, locations, and brand logos. Each company name and logo links directly to its supplied website in a new tab. BMC and RBC each have two separate roles using the same respective logo. There are no experience subpages. Project templates generate pages from their slugs.

The public email is `shvhmeer@gmail.com`. Shahmeer is based in Seattle & Toronto. The footer includes a large name banner, a personal seal, copyright, and a live Toronto clock using America/Toronto (EST in winter, EDT during daylight saving time). Roles supplied by Shahmeer are CTO & Co-founder at Orena, Applied Scientist at Microsoft, ML Researcher / Innovation Lead at Remmie Health, AI Engineer at BMC Helix, Machine Learning Engineer at BMC, and Data Scientist and Data Engineer at RBC. Waterloo remains education in the introduction: he studies Systems Design Engineering. His overall identity is an applied scientist and researcher; the site uses the broader research and applied AI focus.

The homepage follows introduction and photos → experience → personal section → contact. The large Selected work block has been removed. Two project detail templates remain as explicitly labelled samples for future use; they are not featured on the homepage. A compact Projects list can be added once real project stories are supplied. The slideshow uses all seven photographs supplied by Shahmeer, with a three-second interval and a 650 ms crossfade. JPEGs in `public/images/personal/` are exact copies of the full-resolution originals, served without Next.js re-encoding. The HEIC is converted to a full-resolution lossless PNG with its Display P3 profile; its original is retained locally in `source-photos/` (excluded from Git). The copy checksums and conversion details are in `public/images/personal/photo-manifest.json`. Photographs retain their colours. The visible frame smoothly adapts its width to each photograph’s native proportions, with no letterbox strips and a stable height so the page and controls do not jump between slides. The caption and photo counter follow the same animated width and stay aligned with the photograph’s edges.

The companion currently uses local, factual portfolio responses in `src/lib/portfolio-assistant.ts`, served by `/api/chat`. It does not connect to an external language model. It handles the supplied roles, research focus, and contact information; missing details receive an honest fallback. Role descriptions, dates, and locations are drawn from the same experience data as the page; current employment and unprovided facts receive an honest fallback. A richer AI integration can be added later with a server-only API key.

## Motion and interactions

- Gentle continuous floating, wandering, blinking, and pointer-following eyes.
- Short companion greetings or thinking bubbles every 15–20 seconds.
- The companion rests in the viewport’s bottom-right corner during normal scrolling. Its size is about 20% larger than the original. On a first visit in a browser session or a full refresh, a skippable 2.1-second hello appears, followed by an 800 ms glide to the corner and an optional tour invitation. Reduced-motion visitors get the invitation directly. Ordinary navigation does not replay the intro.
- The optional four-stop tour introduces photographs, Orena, Microsoft, and contact. The bot moves alongside the highlighted section, with Back, Next, Ask about this, and End controls in a compact card. Manual scrolling ends the tour and restores the normal anchor.
- Chat understands local navigation requests such as “Show me his Microsoft experience” and “Take me back to the photos.” “Take the tour” restarts the tour any time. These actions only navigate known sections of this portfolio.
- Slideshow advances every three seconds when active, with previous/next, direct selection, pause, and touch swipe. It waits for the next photograph to load before advancing and pauses on mouse hover or keyboard focus.
- Motion pauses or stops appropriately for reduced-motion preferences and hidden pages.
- Companion includes pause controls, Escape to close, keyboard access, and linked answers.
- Smooth scrolling preserves native touch scrolling and independent chat scrolling.

## Validation

```sh
npm run typecheck
npm test
npm run build
```

Seventeen tests cover factual companion responses, missing information, contact details, animation timing bounds, navigation intent, and guide positioning. The production build includes the home page, two sample project templates, a not-found page, and the chat route.

## Next content session

1. Refine the supplied photographs’ short captions if desired.
2. Refine the supplied experience one-liners if desired.
3. Choose one or two actual projects and supply a question, approach, result, and links or images.
4. Add a short personal paragraph plus any public LinkedIn, GitHub, or CV links.

## Vercel later

This is a standard Next.js project. When ready, use this folder as the project root in Vercel and select its Next.js preset. No external AI credentials are required for the current companion. The website has not been deployed or connected to a domain.

The hero includes LinkedIn, GitHub, email, and X links. The header alternates between English and Arabic every three seconds, pausing when the tab is hidden and respecting reduced motion. Experience rows share a moving outline that also follows keyboard focus.

The footer record plays “Intimidated (feat. H.E.R.)” by KAYTRANADA using Spotify's official iFrame API, without a client secret or API key. The player loads on request, and the record spins only when Spotify reports active playback. Playback availability is controlled by Spotify and the visitor’s session. Visitors can also open the track on Spotify. The Spotify player stays visible while playing, and closing it pauses playback.
