import Link from "next/link";
import type { Project } from "@/data/types";
import { site } from "@/data/site";
import { resolveImage } from "@/lib/assets";
import { Badge, contributionCopy } from "../site/Badge";
import { Frame } from "../media/Frame";
import { ProjectImage } from "../media/ProjectImage";
import { TextPlaceholder } from "../media/Placeholder";
import { Parallax } from "../motion/Parallax";
import { Reveal } from "../motion/Reveal";
import { SplitHeading } from "../motion/SplitHeading";

/** The flagship project, presented editorially on the home page. */
export function FeaturedCase({ project, index = "02" }: { project: Project; index?: string }) {
  const finals = (project.gallery ?? []).filter((a) => a.kind === "mobile" || a.kind === "desktop").slice(0, 2);
  const ph = site.showContentPlaceholders;

  return (
    <article id="featured" aria-labelledby="featured-title" className="relative">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div className="grid gap-5">
            <p className="label flex flex-wrap items-center gap-3">
              <span className="text-accent">{index}</span>
              <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
              Featured case study
            </p>
            <SplitHeading as="h2" id="featured-title" className="text-[clamp(2.6rem,7.4vw,7rem)] font-semibold leading-[0.9] tracking-[-0.05em]">
              {project.title}
            </SplitHeading>
          </div>
          <Reveal className="grid gap-5 lg:pb-3">
            <p className="max-w-[44ch] text-lg leading-snug text-fg-muted">{project.tagline}</p>
            <div className="flex flex-wrap items-center gap-3">
              <Badge value={project.contribution} />
              <span className="label">{project.sector}</span>
              <span className="label">· {project.platforms.join(", ")}</span>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Large editorial preview */}
      <div className="mx-auto mt-12 max-w-[1440px] px-5 md:mt-16 md:px-10">
        <Reveal>
          <Link href={`/work/${project.slug}`} className="group block overflow-hidden rounded-[28px] border border-line" aria-label={`Open the ${project.title} case study`}>
            <Parallax strength={34}>
              <div className="scale-[1.15] transition-transform duration-[1400ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.18]">
                <ProjectImage asset={project.cover} fallbackLabel={`${project.title}: hero image`} sizes="(min-width: 1440px) 1360px, 100vw" accent={project.accent} aspect="16 / 9" />
              </div>
            </Parallax>
          </Link>
        </Reveal>
      </div>

      {/* Challenge / role / outcome */}
      <div className="mx-auto mt-14 grid max-w-[1440px] gap-10 px-5 md:mt-20 md:grid-cols-3 md:px-10">
        <Reveal className="grid content-start gap-3">
          <p className="label">The challenge</p>
          {project.challenge ? <p className="text-lg leading-snug">{project.challenge}</p> : ph ? <TextPlaceholder>Challenge not written yet</TextPlaceholder> : null}
        </Reveal>
        <Reveal className="grid content-start gap-3" delay={80}>
          <p className="label">My role</p>
          <p className="text-lg leading-snug">{project.role}</p>
          <p className="text-sm text-fg-muted">{contributionCopy[project.contribution].note}</p>
        </Reveal>
        <Reveal className="grid content-start gap-3" delay={160}>
          <p className="label">Outcome</p>
          {project.outcome ? <p className="text-lg leading-snug">{project.outcome}</p> : <TextPlaceholder>No verified outcome recorded yet</TextPlaceholder>}
        </Reveal>
      </div>

      {/* Final UI */}
      {finals.length ? (
        <div className="mx-auto mt-16 max-w-[1440px] px-5 md:mt-24 md:px-10">
          <div className="grid items-center gap-10 rounded-[28px] border border-line bg-ink-850 p-6 md:grid-cols-[1fr_auto] md:p-12">
            <Reveal className="grid content-center gap-4">
              <p className="label">Final UI</p>
              {project.finalUiNote ? <p className="max-w-[34ch] text-2xl font-medium leading-tight tracking-tight md:text-3xl">{project.finalUiNote}</p> : null}
              <div className="mt-2 flex flex-wrap gap-3">
                <Link href={`/work/${project.slug}`} className="group inline-flex h-12 items-center gap-3 rounded-full bg-fg px-6 text-sm font-medium text-ink-950 transition-colors hover:bg-accent">
                  Read the full case study <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
                <a href="#rationale" className="inline-flex h-12 items-center rounded-full border border-line-strong px-5 text-sm transition-colors hover:border-fg">
                  Why I designed it this way
                </a>
              </div>
            </Reveal>
            <Reveal className="flex justify-center gap-4 md:gap-6" step={140}>
              {finals.map((a) => {
                const img = resolveImage(a.src);
                return img ? (
                  <figure key={a.caption ?? a.src} className="m-0 w-[42vw] max-w-[230px] md:w-[210px]">
                    <Frame image={img} alt={a.alt} crop={a.crop} background={a.background} className="rounded-2xl" sizes="230px" />
                    <figcaption className="label mt-3 normal-case! tracking-normal!">{a.caption}</figcaption>
                  </figure>
                ) : null;
              })}
            </Reveal>
          </div>
        </div>
      ) : null}
    </article>
  );
}
