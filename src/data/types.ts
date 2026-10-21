/**
 * Content model for the portfolio.
 *
 * Every image path and every piece of case-study copy lives in `src/data/`,
 * never in page components. Swap a screenshot by dropping a new file into
 * `public/images/...` and updating one string. Paths are relative to `/public`.
 */

/**
 * How the work relates to you. Drives the badge on every entry, so a concept
 * is never mistaken for a shipped product and team work is never presented as
 * solo work.
 */
export type Contribution =
  | "original" // You designed it for a real product
  | "redesign" // You reworked an existing product (adoption/launch not implied)
  | "concept" // Self-initiated or speculative
  | "team" // Designed as part of a team; credit is shared
  | "unconfirmed"; // Your role has not been written up yet

export type AssetKind = "desktop" | "mobile" | "multi-screen" | "detail" | "flow" | "wireframe" | "before" | "after";

/** A rectangle inside the source image, in percent (0–100) of its width/height. */
export interface Crop {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface ProjectAsset {
  /** Path under /public, e.g. "/images/projects/learnyx/dashboard.png" */
  src: string;
  /** Describe what the screen shows, for screen-reader users. */
  alt: string;
  kind: AssetKind;
  caption?: string;
  /** Show only part of the file (e.g. one phone from a two-phone mockup). The file is never modified. */
  crop?: Crop;
  /** Focal point (percent) when the image is cover-fitted into a fixed frame. */
  focus?: { x: number; y: number };
  /** Colour behind the image while it loads and around transparent edges. */
  background?: string;
}

/** Something a case study needs but that has not been supplied yet. Rendered as a labelled placeholder. */
export interface PendingAsset {
  label: string;
  /** Where the file is expected to go. Shown in development only. */
  expectedPath: string;
  kind: AssetKind;
}

/**
 * One entry in the "Why I designed it this way" component.
 * Leave a field out when you have nothing true to say; it then shows as a
 * labelled gap (see `site.showContentPlaceholders`) instead of invented copy.
 */
export interface DesignDecision {
  /** Short label, shown on the panel header. */
  title: string;
  /** Pin position on the project's rationale screenshot, in percent of the displayed frame. */
  pin?: { x: number; y: number };
  /** What was designed. */
  decision: string;
  /** The user problem or design challenge it addresses. */
  userNeed?: string;
  /** Technical, business or time constraints. */
  constraints?: string;
  /** Other options you considered. */
  alternatives?: string;
  /** Why this option won. */
  rationale?: string;
  /** What you prioritised and what you gave up. */
  tradeoffs?: string;
  /** Only verified results: testing, stakeholder feedback, shipped status. */
  outcome?: string;
  /**
   * true = drafted from what is visible in the screenshot, not from your
   * notes. `npm run check:assets` lists these until you review them and
   * remove the flag.
   */
  draft?: boolean;
}

export interface Project {
  slug: string;
  title: string;
  /** One line, shown in the work index and on cards. */
  tagline: string;
  /** Leave undefined if unknown; it shows as "To be confirmed". */
  sector?: string;
  platforms: string[];
  contribution: Contribution;
  /** e.g. "Product design (redesign)". */
  role?: string;
  /** For team projects: exactly what you did. Shown prominently on the case study. */
  contributionDetail?: string;
  liveUrl?: string;
  flagship?: boolean;

  /** Intro paragraphs. Keep to facts you can stand behind. */
  overview: string[];
  /** The problem and design challenge. */
  challenge?: string;
  /** Research insights you actually gathered. Never invented. */
  research?: string[];
  /** Your process, as steps you actually took. */
  process?: { step: string; detail: string }[];
  /** Verified outcome only. */
  outcome?: string;
  /** One line introducing the final UI screens. */
  finalUiNote?: string;

  cover?: ProjectAsset;
  /** Screenshot that the design-decision pins sit on. */
  rationaleAsset?: ProjectAsset;
  decisions?: DesignDecision[];
  /** Final UI screens. */
  gallery?: ProjectAsset[];
  /** Information architecture and user-flow diagrams. */
  flows?: ProjectAsset[];
  wireframes?: ProjectAsset[];
  beforeAfter?: { before: ProjectAsset; after: ProjectAsset; caption?: string };
  pending?: PendingAsset[];

  /** Accent colour for this project's details. */
  accent: string;
  /** Copy fields written from the screenshots that you should review. Listed by the asset check. */
  review?: string[];
}
