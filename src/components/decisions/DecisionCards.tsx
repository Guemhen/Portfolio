import type { Project } from "@/data/types";
import { resolveImage } from "@/lib/assets";
import { DesignDecisionCard } from "./DesignDecisionCard";

/** Server wrapper: resolves each card's visual, then renders the interactive cards. */
export function DecisionCards({ project, screensHref }: { project: Project; screensHref?: string }) {
  const cards = project.decisionCards ?? [];
  if (!cards.length) return null;
  return (
    <div className="grid gap-10">
      {cards.map((card, i) => (
        <DesignDecisionCard
          key={card.id}
          card={card}
          index={i + 1}
          projectTitle={project.title}
          image={resolveImage(card.visual?.src)}
          screensHref={screensHref}
        />
      ))}
    </div>
  );
}
