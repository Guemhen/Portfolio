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

/**
 * Where a part of a decision came from. Shown as a tag on each answer so
 * personal aesthetic choices are never mistaken for research findings.
 */
export type DecisionSource =
  | "company-brief" // What the client or company asked for
  | "stakeholder-feedback"
  | "aesthetic-preference" // Your personal visual taste
  | "designer-judgement" // Your reasoning, not tested
  | "user-research" // Interviews, surveys, field studies you ran
  | "usability-testing"
  | "analytics";

/** Sources that count as evidence from users. Everything else is judgement or brief. */
export const EVIDENCE_SOURCES: DecisionSource[] = ["user-research", "usability-testing", "analytics"];

export type DecisionCardSection = "question" | "problem" | "reasoning" | "tradeoff" | "principle";

/** A region of the card's visual to zoom into while a section is open. */
export interface VisualFocus {
  /** Point to centre on, in percent of the displayed (cropped) visual. */
  x: number;
  y: number;
  /** Zoom factor, e.g. 1.8. Keep it under ~2.2 for low-resolution screenshots. */
  scale: number;
  /** Short caption shown while zoomed, e.g. "Jura headings on the listing page". */
  label: string;
}

/**
 * Design Decision Card: the thinking behind one design decision, in five
 * short answers. Add more cards to any project's `decisionCards` array.
 */
export interface DesignDecisionCard {
  /** Unique within the project; used for anchors, e.g. /work/<slug>#visual-identity */
  id: string;
  /** Defaults to the project's title. */
  project?: string;
  /** The UI element or screen the decision is about. */
  element: string;
  /** 1. The question the viewer should ask. */
  question: string;
  /** 2. What needed to be solved. */
  problem: string;
  /** 3. Why you made this decision. */
  reasoning: string;
  /** 4. What you prioritised, and what you gave up. */
  tradeoff: string;
  /** 5. The principle, as one memorable line. */
  principle: string;
  /** Optional sentence expanding the principle. */
  principleDetail?: string;
  /** Short chips shown at the top of the card. */
  keywords?: string[];
  /** Phrases emphasised wherever they appear in the answers (case-insensitive). */
  emphasis?: string[];
  /** Where each answer comes from. Untagged answers show no source. */
  sources?: Partial<Record<Exclude<DecisionCardSection, "principle">, DecisionSource>>;
  /** Optional screenshot or visual reference shown beside the answers. */
  visual?: ProjectAsset;
  /** Zoom targets on `visual`, per section. Sections without one show the whole visual. */
  focus?: Partial<Record<DecisionCardSection, VisualFocus>>;
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
  /** Design Decision Cards for this project (see `DesignDecisionCard`). */
  decisionCards?: DesignDecisionCard[];
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
