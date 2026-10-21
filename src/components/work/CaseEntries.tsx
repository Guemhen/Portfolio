import Link from "next/link";
import type { Project } from "@/data/types";
import { Badge } from "../site/Badge";
import { Placeholder } from "../media/Placeholder";
import { ProjectImage } from "../media/ProjectImage";
import { Parallax } from "../motion/Parallax";
import { Reveal } from "../motion/Reveal";

/** Large alternating entry for a project with real screens. */
export function CaseEntry({ project, index, flip }: { project: Project; index: number; flip?: boolean }) {
  const tall = project.cover?.kind === "mobile";
  return (
    <article className="grid items-center gap-8 md:grid-cols-12 md:gap-10" aria-labelledby={`case-${project.slug}`}>
      <Reveal className={`md:col-span-7 ${flip ? "md:order-2" : ""}`}>
        <Link href={`/work/${project.slug}`} className="group block overflow-hidden rounded-3xl border border-line bg-ink-850" aria-label={`Open the ${project.title} case study`}>
          {/* Half the scale headroom (8% → 4% per edge) must exceed the parallax travel, or the image edge shows. */}
          <Parallax strength={14}>
            <div className="scale-[1.08] transition-transform duration-[1400ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.11]">
              <ProjectImage asset={project.cover} fallbackLabel={project.title} sizes="(min-width: 768px) 58vw, 100vw" accent={project.accent} aspect={tall ? "4 / 3" : undefined} />
            </div>
          </Parallax>
        </Link>
      </Reveal>
      <Reveal className={`grid content-center gap-5 md:col-span-5 ${flip ? "md:order-1" : ""}`} delay={120}>
        <p className="label flex items-center gap-3">
          <span style={{ color: project.accent }}>{String(index).padStart(2, "0")}</span>
          <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
          {project.sector ?? "Sector to be confirmed"}
        </p>
        <h3 id={`case-${project.slug}`} className="text-[clamp(2rem,4vw,3.4rem)] font-semibold leading-[0.95] tracking-[-0.04em]">
          {project.title}
        </h3>
        <p className="max-w-[42ch] text-lg leading-snug text-fg-muted">{project.tagline}</p>
        <div className="flex flex-wrap items-center gap-3">
          <Badge value={project.contribution} />
          {project.role ? <span className="text-sm text-fg-muted">{project.role}</span> : null}
        </div>
        <Link href={`/work/${project.slug}`} className="group mt-2 inline-flex w-fit items-center gap-3 border-b border-line-strong pb-1 text-sm font-medium transition-colors hover:border-fg">
          View case study <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">→</span>
        </Link>
      </Reveal>
    </article>
  );
}

/** Compact entry for a project whose visuals have not been supplied yet. */
export function PendingEntry({ project }: { project: Project }) {
  return (
    <Link href={`/work/${project.slug}`} className="group grid gap-4 rounded-3xl border border-line p-4 transition-colors hover:border-line-strong md:p-5">
      <Placeholder label={project.pending?.[0]?.label ?? "Screens"} kind="multi-screen" accent={project.accent} aspect="16 / 10" expectedPath={project.pending?.[0]?.expectedPath} />
      <div className="grid gap-2 px-1">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-2xl font-semibold tracking-[-0.03em]">{project.title}</h3>
          <span aria-hidden="true" className="text-fg-dim transition-all group-hover:translate-x-1 group-hover:text-fg">→</span>
        </div>
        <p className="text-sm text-fg-muted">{project.tagline}</p>
        <div className="mt-1">
          <Badge value={project.contribution} />
        </div>
      </div>
    </Link>
  );
}
