import type { AssetKind } from "@/data/types";

const ratios: Record<AssetKind, string> = {
  desktop: "16 / 10",
  mobile: "3 / 4",
  "multi-screen": "4 / 3",
  detail: "16 / 9",
  flow: "16 / 9",
  wireframe: "4 / 3",
  before: "16 / 10",
  after: "16 / 10",
};

/**
 * Stands in for an asset that has not been supplied yet. Deliberately
 * unmistakable (hatched, labelled "Placeholder") so it can never be read as
 * real work, and it carries data-placeholder for the automated checks.
 */
export function Placeholder({
  label,
  kind,
  expectedPath,
  accent,
  aspect,
  className = "",
}: {
  label: string;
  kind: AssetKind;
  expectedPath?: string;
  accent?: string;
  aspect?: string;
  className?: string;
}) {
  const showPath = process.env.NODE_ENV !== "production" && expectedPath;
  return (
    <div
      role="img"
      aria-label={`Placeholder: ${label}. Not yet supplied.`}
      data-placeholder="true"
      className={`hatch relative grid w-full place-items-center overflow-hidden rounded-2xl border border-dashed border-line-strong text-center ${className}`}
      style={{ aspectRatio: aspect ?? ratios[kind], ["--ph" as string]: accent }}
    >
      <span className="label absolute left-3 top-3 rounded-md border border-line-strong bg-ink-900/90 px-2 py-1 text-fg-muted!">
        Placeholder
      </span>
      <div className="grid max-w-[34ch] justify-items-center gap-2 px-6 py-10">
        <span className="h-2 w-2 rounded-full" style={{ background: accent ?? "var(--color-fg-dim)" }} aria-hidden="true" />
        <p className="text-sm font-medium text-fg">{label}</p>
        <p className="label normal-case! tracking-normal!">Not supplied yet</p>
        {showPath ? <code className="mt-1 break-all font-mono text-[11px] text-fg-dim">public{expectedPath}</code> : null}
      </div>
    </div>
  );
}

/** Inline text placeholder for case-study copy that has not been written yet. */
export function TextPlaceholder({ children }: { children: React.ReactNode }) {
  return (
    <span data-placeholder="true" className="inline-flex items-center gap-2 rounded-md border border-dashed border-line-strong px-2.5 py-1 font-mono text-[11px] tracking-wide text-fg-dim">
      <span className="h-1.5 w-1.5 rounded-full bg-fg-dim" aria-hidden="true" />
      {children}
    </span>
  );
}
