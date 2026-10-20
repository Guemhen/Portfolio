// Verifies that every image referenced in src/data resolves to a real file,
// that crops and annotation pins stay inside their images, and that every
// asset has alt text. Runs before `next build`; exits non-zero on errors.
//
//   npm run check:assets
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { projects } = await import(path.join(root, "src/data/projects.ts"));
const { profile } = await import(path.join(root, "src/data/profile.ts"));

const errors = [];
const warnings = [];
const referenced = new Set();
const exists = (src) => fs.existsSync(path.join(root, "public", src));
const inRange = (n) => typeof n === "number" && n >= 0 && n <= 100;

function checkAsset(where, a) {
  if (!a) return;
  referenced.add(a.src);
  if (!a.src.startsWith("/")) errors.push(`${where}: path must start with "/" (got ${a.src})`);
  if (!exists(a.src)) errors.push(`${where}: file not found: public${a.src}`);
  if (!a.alt || a.alt.trim().length < 12 || /\.(png|jpe?g|webp|avif)$/i.test(a.alt))
    errors.push(`${where}: needs descriptive alt text`);
  if (a.crop) {
    const { x, y, w, h } = a.crop;
    if (![x, y, w, h].every(inRange) || x + w > 100.01 || y + h > 100.01 || w <= 0 || h <= 0)
      errors.push(`${where}: crop ${JSON.stringify(a.crop)} falls outside the image`);
  }
}

if (profile.photo.src) {
  if (!exists(profile.photo.src)) errors.push(`profile.photo: file not found: public${profile.photo.src}`);
  referenced.add(profile.photo.src);
} else {
  warnings.push("profile.photo.src is null, so the monogram fallback will be shown");
}

const slugs = new Set();
for (const p of projects) {
  const at = `projects/${p.slug}`;
  if (slugs.has(p.slug)) errors.push(`${at}: duplicate slug`);
  slugs.add(p.slug);
  checkAsset(`${at}.cover`, p.cover);
  checkAsset(`${at}.rationale.asset`, p.rationale?.asset);
  (p.rationale?.notes ?? []).forEach((n, i) => {
    if (!inRange(n.x) || !inRange(n.y)) errors.push(`${at}.rationale.notes[${i}]: pin outside the image`);
  });
  (p.gallery ?? []).forEach((a, i) => checkAsset(`${at}.gallery[${i}]`, a));
  checkAsset(`${at}.beforeAfter.before`, p.beforeAfter?.before);
  checkAsset(`${at}.beforeAfter.after`, p.beforeAfter?.after);
  if (!p.cover && !p.gallery?.length && !p.pending?.length)
    warnings.push(`${at}: no visuals and no pending list; a generic placeholder will be shown`);
}

const flagships = projects.filter((p) => p.flagship);
if (flagships.length !== 1) errors.push(`expected exactly one flagship project, found ${flagships.length}`);

// Files sitting in public/images that nothing points at (probably newly added).
const imgDir = path.join(root, "public/images");
const walk = (d) =>
  fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]
  );
for (const f of walk(imgDir)) {
  const src = "/" + path.relative(path.join(root, "public"), f).split(path.sep).join("/");
  if (/\.(png|jpe?g|webp|avif|gif|svg)$/i.test(f) && !referenced.has(src))
    warnings.push(`unused image: public${src} (add it to src/data/projects.ts to show it)`);
}

const real = projects.filter((p) => [p.cover, p.rationale?.asset, ...(p.gallery ?? [])].some((a) => a && exists(a.src)));
console.log(`✓ ${referenced.size} image path(s) checked across ${projects.length} projects`);
console.log(`  with real screens: ${real.map((p) => p.title).join(", ") || "none"}`);
console.log(`  placeholder only:  ${projects.filter((p) => !real.includes(p)).map((p) => p.title).join(", ") || "none"}`);
warnings.forEach((w) => console.warn(`⚠ ${w}`));
if (errors.length) {
  errors.forEach((e) => console.error(`✗ ${e}`));
  process.exit(1);
}
