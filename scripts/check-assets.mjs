// Verifies that every image referenced in src/data resolves to a real file,
// that crops and decision pins stay inside their images, and that every asset
// has alt text. Also lists copy still marked as draft. Runs before
// `next build`; exits non-zero on errors.
//
//   npm run check:assets
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { projects } = await import(path.join(root, "src/data/projects.ts"));
const { site } = await import(path.join(root, "src/data/site.ts"));

const errors = [];
const warnings = [];
const drafts = [];
const referenced = new Set();
const exists = (src) => fs.existsSync(path.join(root, "public", src));
const inRange = (n) => typeof n === "number" && n >= 0 && n <= 100;

function checkAsset(where, a) {
  if (!a) return;
  referenced.add(a.src);
  if (!a.src.startsWith("/")) errors.push(`${where}: path must start with "/" (got ${a.src})`);
  if (!exists(a.src)) errors.push(`${where}: file not found: public${a.src}`);
  if (!a.alt || a.alt.trim().length < 12 || /\.(png|jpe?g|webp|avif)$/i.test(a.alt)) errors.push(`${where}: needs descriptive alt text`);
  if (a.crop) {
    const { x, y, w, h } = a.crop;
    if (![x, y, w, h].every(inRange) || x + w > 100.01 || y + h > 100.01 || w <= 0 || h <= 0)
      errors.push(`${where}: crop ${JSON.stringify(a.crop)} falls outside the image`);
  }
}

for (const key of ["cutout", "original"]) {
  const src = site.portrait[key];
  if (!src) continue;
  referenced.add(src);
  if (!exists(src)) (key === "cutout" ? warnings : errors).push(`site.portrait.${key}: file not found: public${src}${key === "cutout" ? " (hero shows a monogram fallback)" : ""}`);
}

const slugs = new Set();
for (const p of projects) {
  const at = `projects/${p.slug}`;
  if (slugs.has(p.slug)) errors.push(`${at}: duplicate slug`);
  slugs.add(p.slug);
  checkAsset(`${at}.cover`, p.cover);
  checkAsset(`${at}.rationaleAsset`, p.rationaleAsset);
  for (const k of ["gallery", "flows", "wireframes"]) (p[k] ?? []).forEach((a, i) => checkAsset(`${at}.${k}[${i}]`, a));
  checkAsset(`${at}.beforeAfter.before`, p.beforeAfter?.before);
  checkAsset(`${at}.beforeAfter.after`, p.beforeAfter?.after);
  (p.decisions ?? []).forEach((d, i) => {
    if (d.pin && (!inRange(d.pin.x) || !inRange(d.pin.y))) errors.push(`${at}.decisions[${i}]: pin outside the image`);
    if (d.pin && !p.rationaleAsset) errors.push(`${at}.decisions[${i}]: has a pin but the project has no rationaleAsset`);
    if (d.draft) drafts.push(`${p.title}: decision "${d.title}"`);
  });
  (p.review ?? []).forEach((f) => drafts.push(`${p.title}: ${f}`));
  if (p.contribution === "team" && !p.contributionDetail) warnings.push(`${at}: team project without contributionDetail (shows a placeholder)`);
}

const flagships = projects.filter((p) => p.flagship);
if (flagships.length !== 1) errors.push(`expected exactly one flagship project, found ${flagships.length}`);

const imgDir = path.join(root, "public/images");
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
for (const f of walk(imgDir)) {
  const src = "/" + path.relative(path.join(root, "public"), f).split(path.sep).join("/");
  if (/\.(png|jpe?g|webp|avif|gif|svg)$/i.test(f) && !referenced.has(src)) warnings.push(`unused image: public${src} (reference it in src/data to show it)`);
}

const real = projects.filter((p) => [p.cover, ...(p.gallery ?? [])].some((a) => a && exists(a.src)));
console.log(`✓ ${referenced.size} image path(s) checked across ${projects.length} projects`);
console.log(`  with real screens: ${real.map((p) => p.title).join(", ") || "none"}`);
console.log(`  placeholder only:  ${projects.filter((p) => !real.includes(p)).map((p) => p.title).join(", ") || "none"}`);
if (drafts.length) {
  console.log(`✎ ${drafts.length} item(s) drafted from screenshots; review and rewrite in your own words, then remove the draft flag:`);
  drafts.forEach((d) => console.log(`    - ${d}`));
}
warnings.forEach((w) => console.warn(`⚠ ${w}`));
if (errors.length) {
  errors.forEach((e) => console.error(`✗ ${e}`));
  process.exit(1);
}
