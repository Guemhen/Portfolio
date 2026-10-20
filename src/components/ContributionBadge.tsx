import type { Contribution } from "@/data/types";

export const contributionCopy: Record<Contribution, { label: string; note: string }> = {
  original: {
    label: "Original design",
    note: "I designed this product's interface.",
  },
  redesign: {
    label: "Redesign",
    note: "A redesign of an existing product.",
  },
  concept: {
    label: "Concept",
    note: "Self-initiated exploration, not a commissioned or launched product.",
  },
  team: {
    label: "Team contribution",
    note: "Designed as part of a team. Credit is shared.",
  },
  unconfirmed: {
    label: "Write-up in progress",
    note: "Role details and visuals are still being prepared.",
  },
};

export function ContributionBadge({ value }: { value: Contribution }) {
  const c = contributionCopy[value];
  return (
    <span className={`badge badge--${value}`} title={c.note}>
      {c.label}
    </span>
  );
}
