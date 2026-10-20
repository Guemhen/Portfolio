/**
 * Content model for the portfolio.
 *
 * Every image path lives in `src/data/*.ts`, never in page components, so a
 * screenshot can be swapped by dropping a new file into `public/images/...`
 * and updating one string. Paths are relative to `/public` and start with `/`.
 */

/**
 * How the work relates to you. Shown as a badge on every card and case study,
 * so a concept is never mistaken for a shipped product, and a team project is
 * never presented as solo work.
 */
export type Contribution =
  | "original" // You designed it for a real product
  | "redesign" // You reworked an existing product (say whether it was adopted)
  | "concept" // Self-initiated / speculative, not commissioned or shipped
  | "team" // Designed as part of a team, credit is shared
  | "unconfirmed"; // Your role has not been written up yet

export type AssetKind =
  | "desktop" // Full-width desktop interface
  | "mobile" // Phone screen or phone mockup
  | "multi-screen" // Composition of several screens
  | "detail" // Close-up of a specific interaction
  | "before"
  | "after";

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
  /**
   * Show only part of the source file (e.g. one phone out of a two-phone
   * mockup). The file itself is never modified.
   */
  crop?: Crop;
  /** Focal point (percent) used when the image is cover-fitted into a card. */
  focus?: { x: number; y: number };
  /** Colour shown behind the image while it loads and around transparent edges. */
  background?: string;
}

/** A numbered pin on a screenshot, used by the "Why I designed it this way" component. */
export interface Annotation {
  /** Position of the pin in percent of the displayed (cropped) frame. */
  x: number;
  y: number;
  title: string;
  body: string;
}

export interface Rationale {
  asset: ProjectAsset;
  notes: Annotation[];
}

/** Something the case study needs but you have not supplied yet. */
export interface PendingAsset {
  label: string;
  /** Where the file is expected to go. Shown in development only. */
  expectedPath: string;
  kind: AssetKind;
}

export interface Project {
  slug: string;
  title: string;
  /** One-line description shown on cards. */
  tagline: string;
  /** Short paragraphs for the case study intro. Keep to facts you can stand behind. */
  summary: string[];
  sector: string;
  platforms: string[];
  contribution: Contribution;
  /** Optional free text, e.g. "UI/UX design · team of 4". */
  role?: string;
  liveUrl?: string;
  /** Exactly one project should be the flagship. */
  flagship?: boolean;
  /** Card / hero image. Omit it and a labelled placeholder is shown instead. */
  cover?: ProjectAsset;
  rationale?: Rationale;
  gallery?: ProjectAsset[];
  beforeAfter?: { before: ProjectAsset; after: ProjectAsset; caption?: string };
  pending?: PendingAsset[];
  /** Accent colour used for this project's panels. */
  accent: string;
  /** Text colour that is readable on top of `accent`. */
  onAccent: string;
}
