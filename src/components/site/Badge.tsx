import type { Contribution } from "@/data/types";

export const contributionCopy: Record<Contribution, { label: string; note: string }> = {
  original: { label: "Original design", note: "I designed this product's interface." },
  redesign: { label: "Redesign", note: "A redesign of an existing product. Launch and results are not claimed." },
  concept: { label: "Concept", note: "Self-initiated exploration, not a commissioned or launched product." },
  team: { label: "Team project", note: "Designed and built as part of a team. Credit is shared." },
  unconfirmed: { label: "Write-up pending", note: "Role details and visuals are still being prepared." },
};

const styles: Record<Contribution, string> = {
  original: "border-fg/30 text-fg",
  redesign: "border-amber/50 text-amber",
  concept: "border-dashed border-fg/30 text-fg-muted",
  team: "border-accent/50 text-accent-soft",
  unconfirmed: "border-dotted border-fg/25 text-fg-dim",
};

export function Badge({ value, className = "" }: { value: Contribution; className?: string }) {
  const c = contributionCopy[value];
  return (
    <span title={c.note} className={`inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.12em] ${styles[value]} ${className}`}>
      {c.label}
    </span>
  );
}
