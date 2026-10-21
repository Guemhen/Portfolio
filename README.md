# Joshua Idogun — Product Design Portfolio

A dark, motion-led portfolio built with **Next.js 15 (App Router), TypeScript, Tailwind CSS v4 and Anime.js v4**.
All content (copy, images, design decisions) lives in `src/data/`, so you can update the site without
touching components.

## Preview locally

Requires **Node.js 22.18 or newer**.

```bash
npm install
npm run dev          # http://localhost:3000, with hot reload
```

Production preview:

```bash
npm run build        # runs the asset check, then builds
npm start            # http://localhost:3000
```

`npm run check:assets` on its own verifies every image path, crop, pin and alt text. It also lists copy
that is still marked as a draft (see "Before you publish").

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. In Vercel, choose **Add New → Project**, import the repository and keep the detected **Next.js**
   settings (build command `npm run build`). No environment variables or API keys are required.
3. Click **Deploy**. Every later push to the main branch redeploys automatically.
4. Optional: add a custom domain under **Settings → Domains**, then set the environment variable
   `SITE_URL=https://your-domain.com` so social previews use your domain.

Or from the command line: `npx vercel` (preview) and `npx vercel --prod` (production).

## Project structure

```
public/images/
  profile/
    joshua-idogun-original.jpg     original photo (used for social previews)
    joshua-idogun-cutout.png       transparent cutout (hero)
  projects/<slug>/                 one folder per project
scripts/
  check-assets.mjs                 image + content check, runs before every build
  remove-background.py             makes the transparent cutout from a photo
src/
  data/
    site.ts                        name, statement, email, links, skills, about, highlights
    projects.ts                    every project, its images and design decisions
    types.ts                       the content model, with comments
  app/
    page.tsx                       home: hero, highlights, work index, featured case,
                                   more case studies, design rationale, about, contact
    work/[slug]/page.tsx           generated case-study page for every project
  components/
    home/       Hero, HeroMotion (Anime.js timeline + parallax), DotGrid, Highlights, About, Contact
    work/       WorkIndex (cursor preview), FeaturedCase, CaseEntries
    rationale/  DecisionExplorer ("Why I designed it this way")
    media/      Frame (crops), Placeholder, Gallery (lightbox), BeforeAfter
    motion/     Reveal, SplitHeading, Parallax, reduced-motion helpers
    site/       Nav, Footer, Badge, SectionHeader
```

## Updating content

### Your photo
The hero uses `site.portrait.cutout`, a PNG with real transparency. To use a new photo:

```bash
python3 -m venv .venv
.venv/bin/pip install "rembg[cpu]" pillow numpy scipy
.venv/bin/python scripts/remove-background.py new-photo.jpg public/images/profile/joshua-idogun-cutout.png
```

The script segments the person with the BiRefNet portrait model, removes background colour spill
from the edges (no halo on dark backgrounds) and trims the empty space. Check the result on a dark
background before committing. If the cutout file is missing, the hero shows a labelled monogram instead.

**Without Python:** remove.bg, Photoroom or Figma's "Remove background" all export a transparent
PNG. Save it to the same path. Never flatten it onto a solid background.

### Project screens
1. Export from Figma at 2× (desktop frames 2400 px wide or more) as PNG or WebP, with descriptive
   names, e.g. `go-x/booking-flow-mobile.png`.
2. Put them in `public/images/projects/<slug>/`.
3. In `src/data/projects.ts`, point `cover`, `gallery`, `flows`, `wireframes` or `beforeAfter` at them,
   then remove the matching entry from `pending`.
4. Run `npm run check:assets`.

`crop` shows part of a file (e.g. one phone from a mockup) without editing it: `{ x, y, w, h }` in
percent of the image. Width and height are read from each file, so swapping a screenshot never needs a
code change.

### Design decisions ("Why I designed it this way")
Each project can have a `rationaleAsset` (the screenshot) and `decisions`. Each decision uses the
template: decision, user need, constraints, alternatives considered, rationale, trade-offs, and
validation/outcome. `pin: { x, y }` places its number on the screenshot (in percent).
Missing fields show as labelled gaps. A missing outcome always reads "No verified outcome recorded yet".

### A new project
Copy an entry in `projects.ts`, give it a new `slug` and create `public/images/projects/<slug>/`.
It appears in the work index, the case-study list and at `/work/<slug>` automatically.
Projects without screens go to the "In preparation" group, with placeholders.

## Before you publish

- **Review the drafts.** The build lists every decision marked `draft: true` and every field named in
  `review`. These were written from what is visible in your screenshots, not from your notes. Rewrite
  them in your own words, then remove the flag.
- **Team projects:** add `contributionDetail` (your exact pages, components or responsibilities) for
  Port Dealer and Trimly.
- **Placeholders:** to hide empty case-study sections instead of showing labelled gaps, set
  `showContentPlaceholders: false` in `src/data/site.ts`.
- **Links and status:** add LinkedIn, Behance or Dribbble URLs in `site.links`. Set `site.status`
  (e.g. "Open to product design roles") only if it is true.

## Integrity rules built in

- Every project carries a `contribution` badge: Original design, Redesign, Concept, Team project or
  Write-up pending. Real-Estate Marketplace Africa is labelled as a redesign. Nothing claims it
  launched or produced business results.
- Missing assets are hatched panels labelled **Placeholder** (`data-placeholder="true"`), never
  stand-in images. Expected file paths appear on them in development only.
- The highlight row contains only verifiable items. The project count is computed from the data.
- No testimonials, research findings, metrics or outcomes are included. Add them only when they are
  real and you are allowed to publish them.

## Motion and accessibility

- Anime.js drives the hero timeline (split-character name, portrait rise, ring draw), the dot-grid
  ripple, pointer parallax, the work-index cursor preview, section reveals, split headings,
  the decision-panel and pin animations, and the count-up.
- All motion respects `prefers-reduced-motion`. Content is never hidden without JavaScript.
- Pointer-only effects (cursor preview, grid ripple, parallax) are off on touch devices.
- Semantic landmarks, a skip link, keyboard-operable menus, tabs, accordions and lightbox, visible
  focus rings and alt text on every image.
