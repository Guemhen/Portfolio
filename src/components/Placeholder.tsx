import type { AssetKind } from "@/data/types";

const ratios: Record<AssetKind, string> = {
  desktop: "16 / 10",
  mobile: "3 / 4",
  "multi-screen": "4 / 3",
  detail: "1 / 1",
  before: "16 / 10",
  after: "16 / 10",
};

interface PlaceholderProps {
  label: string;
  kind: AssetKind;
  /** Where the real file should go. Only shown while developing. */
  expectedPath?: string;
  accent?: string;
  aspect?: string;
  compact?: boolean;
}

/**
 * Stands in for an asset that has not been supplied yet. It is deliberately
 * unmistakable (hatched, labelled "Placeholder") so it can never be read as
 * real work, and it carries data-placeholder for the automated checks.
 */
export function Placeholder({ label, kind, expectedPath, accent, aspect, compact }: PlaceholderProps) {
  const showPath = process.env.NODE_ENV !== "production" && expectedPath;
  return (
    <div
      className={`placeholder ${compact ? "placeholder--compact" : ""}`}
      style={{ aspectRatio: aspect ?? ratios[kind], ["--ph-accent" as string]: accent }}
      role="img"
      aria-label={`Placeholder: ${label}. Visuals not yet supplied.`}
      data-placeholder="true"
    >
      <span className="placeholder__tag">Placeholder</span>
      <div className="placeholder__body">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M3 16l5-5 4 4 3-3 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="16" cy="9" r="1.6" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <p className="placeholder__label">{label}</p>
        <p className="placeholder__note">Visuals coming soon</p>
        {showPath ? <code className="placeholder__path">public{expectedPath}</code> : null}
      </div>
    </div>
  );
}
