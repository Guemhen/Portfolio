# Joshua Idogun — UI/UX portfolio

Next.js 15 (App Router) site that showcases the real photograph and real project screens.

```bash
npm install
npm run dev            # http://localhost:3000
npm run build          # checks every image path, then builds
npm start
npm run check:assets   # image check on its own
```

Set `SITE_URL` (e.g. `https://joshuaidogun.com`) in your host so social previews use absolute URLs.

## Where things live

```
public/images/
  profile/joshua-idogun-portrait.jpg           ← your photo
  projects/
    real-estate-marketplace-africa/           ← flagship
    learnyx/
    port-dealer/
    dual-theme-landing/
    go-x/  silicon-pay/  meemgen/  trimly/    ← empty: add screens here
src/data/
  profile.ts    ← name, intro, photo path, facts, experience
  projects.ts   ← every project, its images, crops and annotations
  types.ts      ← the content model (with comments)
```

Page components contain no image paths. Change the data files, not the pages.

## Changing the photo

Replace `public/images/profile/joshua-idogun-portrait.jpg`, or point `profile.photo.src` at a new file.
`profile.photo.focus` keeps the face in frame (percent from the left and from the top).
If `src` is `null` or the file is missing, the hero shows a monogram fallback instead.

## Adding screens to a project

1. Export from Figma at 2× (desktop frames ≥ 2400 px wide) as PNG or WebP. Use descriptive names,
   e.g. `go-x/booking-flow-mobile.png`.
2. Put the files in `public/images/projects/<slug>/`.
3. In `src/data/projects.ts`, set `cover`, add `gallery` items, and optionally a `rationale`
   (the "Why I designed it this way" component) or a `beforeAfter` pair.
4. Run `npm run check:assets`. It fails on a wrong path, missing alt text, or a crop or pin outside
   the image, and it lists any image file that nothing references yet.

Width and height are read from the file, so swapping a screenshot never needs a code change.

**`crop`** shows part of a file (for example, one phone from a two-phone mockup) without editing the file.
Values are percentages of the source image: `{ x, y, w, h }`.

**`rationale.notes`** places numbered pins at `x`/`y` percentages of the displayed (cropped) image.
Desktop screenshots get the notes underneath; mobile and multi-screen shots get them alongside.

## Adding a new project

Copy an entry in `projects.ts`, give it a new `slug`, and create `public/images/projects/<slug>/`.
The home page, the card grid and `/work/<slug>` are generated from the list.
Projects without real screens automatically move to "Case studies in preparation".

## Integrity rules built into the site

- Every project has a `contribution` value: `original`, `redesign`, `concept`, `team` or
  `unconfirmed`. Each one shows a badge and a credit line, so concepts and team work are never
  presented as solo, shipped work.
- Missing visuals show a hatched panel labelled **Placeholder**. These panels carry
  `data-placeholder="true"` and are never styled like a real screenshot. Expected file paths are
  shown on them in development only.
- Optional "still to be added" panels for projects that already have screens appear only in
  development.
- The hero facts are limited to verifiable items. The project count is computed from the data.
- No testimonials, research findings or metrics are included. Add them only if they are real and
  you are allowed to publish them.
