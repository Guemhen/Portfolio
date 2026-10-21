import type { Project } from "@/data/types";
import { site } from "@/data/site";
import { resolveImage } from "@/lib/assets";
import { DecisionExplorer, type ExplorerProject } from "./DecisionExplorer";

export function toExplorer(p: Project): ExplorerProject {
  return {
    slug: p.slug,
    title: p.title,
    accent: p.accent,
    asset: p.rationaleAsset,
    image: resolveImage(p.rationaleAsset?.src),
    decisions: p.decisions ?? [],
  };
}

/** Server wrapper: resolves screenshots, then hands over to the interactive explorer. */
export function RationaleBlock({ projects, tabs = true, stacked = false }: { projects: Project[]; tabs?: boolean; stacked?: boolean }) {
  const withDecisions = projects.filter((p) => p.decisions?.length);
  if (!withDecisions.length) return null;
  return <DecisionExplorer projects={withDecisions.map(toExplorer)} showPlaceholders={site.showContentPlaceholders} showTabs={tabs} forceStacked={stacked} />;
}
