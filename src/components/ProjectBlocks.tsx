import Link from "next/link";
import type { Project } from "@/data/types";
import { resolveImage } from "@/lib/assets";
import { AnnotatedShot } from "./AnnotatedShot";
import { BeforeAfter } from "./BeforeAfter";
import { ContributionBadge } from "./ContributionBadge";
import { Gallery } from "./Gallery";
import { Placeholder } from "./Placeholder";
import { ProjectImage } from "./ProjectImage";

/** True when at least one real image for the project exists on disk. */
export function hasVisuals(p: Project) {
  return [p.cover, p.rationale?.asset, ...(p.gallery ?? [])].some((a) => a && resolveImage(a.src));
}

export function RationaleBlock({ project, tone }: { project: Project; tone?: "light" | "dark" }) {
  const r = project.rationale;
  if (!r) return null;
  const image = resolveImage(r.asset.src);
  if (!image) {
    return <Placeholder label={`${project.title}: annotated screen`} kind={r.asset.kind} expectedPath={r.asset.src} accent={project.accent} />;
  }
  return (
    <AnnotatedShot
      image={image}
      alt={r.asset.alt}
      crop={r.asset.crop}
      background={r.asset.background}
      notes={r.notes}
      title="Why I designed it this way"
      tone={tone}
      layout={r.asset.kind === "desktop" ? "stacked" : "side"}
    />
  );
}

export function GalleryBlock({ project }: { project: Project }) {
  if (!project.gallery?.length) return null;
  const items = project.gallery.map((asset) => ({ asset, image: resolveImage(asset.src) }));
  return <Gallery items={items} accent={project.accent} />;
}

export function BeforeAfterBlock({ project }: { project: Project }) {
  const ba = project.beforeAfter;
  if (!ba) return null;
  const before = resolveImage(ba.before.src);
  const after = resolveImage(ba.after.src);
  if (!before || !after) {
    return <Placeholder label={`${project.title}: before and after`} kind="after" expectedPath={(before ? ba.after : ba.before).src} accent={project.accent} />;
  }
  return (
    <BeforeAfter
      before={{ image: before, alt: ba.before.alt }}
      after={{ image: after, alt: ba.after.alt }}
      caption={ba.caption}
    />
  );
}

export function ProjectCard({
  project,
  aspect,
  sizes = "(min-width: 900px) 40vw, 100vw",
  className,
}: {
  project: Project;
  /** Omit to show the cover at its natural proportions. */
  aspect?: string;
  sizes?: string;
  className?: string;
}) {
  const visuals = hasVisuals(project);
  return (
    <Link href={`/work/${project.slug}`} className={`card ${visuals ? "" : "card--pending"} ${className ?? ""}`} style={{ ["--accent" as string]: project.accent, ["--on-accent" as string]: project.onAccent }}>
      <div className="card__media">
        {visuals ? (
          <ProjectImage
            asset={project.cover}
            fallbackLabel={project.title}
            sizes={sizes}
            aspect={aspect}
            accent={project.accent}
          />
        ) : (
          <Placeholder label={project.title} kind="multi-screen" accent={project.accent} aspect="4 / 3" compact expectedPath={project.pending?.[0]?.expectedPath} />
        )}
      </div>
      <div className="card__body">
        <div className="card__meta">
          <span>{project.sector}</span>
          <ContributionBadge value={project.contribution} />
        </div>
        <h3 className="card__title">
          {project.title}
          <span className="card__arrow" aria-hidden="true">→</span>
        </h3>
        <p className="card__tagline">{project.tagline}</p>
      </div>
    </Link>
  );
}
