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

The homepage follows introduction and photos → experience → personal section → contact. The large Selected work block has been removed. Two project detail templates remain as explicitly labelled samples for future use; they are not featured on the homepage. A compact Projects list can be added once real project stories are supplied. The slideshow uses all seven photographs supplied by Shahmeer, with a three-second interval and a 650 ms crossfade. JPEGs in `public/images/personal/` are exact copies of the full-resolution originals, retained as source assets. The HEIC is converted to a full-resolution lossless PNG with its Display P3 profile; its original is retained locally in `source-photos/` (excluded from Git). The copy checksums and conversion details are in `public/images/personal/photo-manifest.json`. Photographs retain their colours. The gallery serves pre-generated responsive lossless WebP copies with the original ICC profiles, prioritizes the first photo before fetching the other slides, and caches content-versioned assets for a year. No image encoding happens during a visit. Run `npm run optimize:photos` after replacing source photographs; commit the generated assets and manifest. Originals remain unchanged. The visible frame smoothly adapts its width to each photograph’s native proportions, with no letterbox strips and a stable height so the page and controls do not jump between slides. The caption and photo counter follow the same animated width and stay aligned with the photograph’s edges.

The companion currently uses local, factual portfolio responses in `src/lib/portfolio-assistant.ts`, served by `/api/chat`. It does not connect to an external language model. It handles the supplied roles, research focus, and contact information; missing details receive an honest fallback. Role descriptions, dates, and locations are drawn from the same experience data as the page; current employment and unprovided facts receive an honest fallback. A richer AI integration can be added later with a server-only API key.

## Motion and interactions

- Gentle continuous floating, wandering, blinking, and pointer-following eyes.
- Short companion greetings or thinking bubbles every 15–20 seconds.
- The companion rests in the viewport’s bottom-right corner during normal scrolling. Every homepage entry, refresh, or revisit opens a skippable 2.25-second painted sequence: Orena, Seattle, Waterloo, then waves, with image changes every 280 ms. Returning from a project page or restoring the homepage with the browser’s Back button also replays it. The images gather into a signature before two charcoal curtains reveal the page. The companion stays in its corner and offers the optional tour afterward. Reduced-motion visitors and section links bypass the opening. Slow or failed artwork loads bypass it within one second; the page keeps loading underneath.
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

Twenty-one tests cover factual companion responses, missing information, contact details, animation timing bounds, navigation intent, guide positioning, entrance replay/accessibility decisions, and rotated postcard drag bounds. The production build includes the home page, two sample project templates, a not-found page, and the chat route.

## Next content session

1. Refine the supplied photographs’ short captions if desired.
2. Refine the supplied experience one-liners if desired.
3. Choose one or two actual projects and supply a question, approach, result, and links or images.
4. Add a short personal paragraph plus any public LinkedIn, GitHub, or CV links.

## Vercel later

This is a standard Next.js project, deployed to https://shahmeerali.com/ through Vercel. No external AI credentials are required for the current companion.

The hero includes LinkedIn, GitHub, email, and X links. The header alternates between English and Arabic every three seconds, pausing when the tab is hidden and respecting reduced motion. Experience rows share a moving outline that also follows keyboard focus.

The footer record plays “Intimidated (feat. H.E.R.)” by KAYTRANADA using Spotify's official iFrame API, without a client secret or API key. The player loads on request, and the record spins only when Spotify reports active playback. Playback availability is controlled by Spotify and the visitor’s session. Visitors can also open the track on Spotify. The Spotify player stays visible while playing, and closing it pauses playback.

## Opening artwork

The built-in image-generation tool transformed the four supplied sources into matte, grainy painted artwork. Full-resolution results and the exact style-transfer prompts are saved in `artwork/entrance/`. Only pre-generated 480 px and 840 px WebP versions are served to visitors, from content-hashed URLs with immutable caching. Run `npm run optimize:entrance` after changing the source art. The opening uses CSS transforms and opacity, shares image requests between its sequential and gathered views, and downloads no video or animation library.

## Typography

The original font pairing is restored: Geist for body text, headings, and controls; Newsreader for the English header name. Locally bundled Latin subsets use swap loading, with the original regular and medium Geist weights; added bold overrides have been removed while the current text sizes and contrast are retained. Noto Naskh Arabic supplies the Arabic name. The footer signature stays in Arabic, with no language change on hover or focus. The previously supplied Michelangelus source files and license remain archived in `src/fonts/michelangelus/` but are no longer loaded by the website.

The four painted entrance images also appear as small draggable postcards in the footer. Their frame starts at the divider below “Say hello” and ends above the copyright line. Pointer capture and animation-frame updates keep dragging smooth; rotated corners remain inside the frame. Arrow keys move a focused image (Shift moves farther), and Home restores its initial placement. Moved positions stay within the frame after resizing. The footer uses the existing cached 480 px WebP assets with lazy, low-priority loading, without new image files or animation dependencies.
