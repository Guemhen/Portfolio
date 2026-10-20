import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/data/projects";
import { ContributionBadge, contributionCopy } from "@/components/ContributionBadge";
import { Placeholder } from "@/components/Placeholder";
import { BeforeAfterBlock, GalleryBlock, RationaleBlock, hasVisuals } from "@/components/ProjectBlocks";
import { ProjectImage } from "@/components/ProjectImage";
import { Reveal } from "@/components/Reveal";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getProject((await params).slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.tagline,
    openGraph: p.cover ? { images: [p.cover.src] } : undefined,
  };
}

export default async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const project = getProject((await params).slug);
  if (!project) notFound();

  const index = projects.indexOf(project);
  // Lead visitors on to the next project that has real screens to show.
  const after = [...projects.slice(index + 1), ...projects.slice(0, index)];
  const next = after.find(hasVisuals) ?? after[0] ?? project;
  const visuals = hasVisuals(project);
  // Optional "still to come" placeholders stay out of production pages that
  // already have real work, but are always visible while developing.
  const showPending = !!project.pending?.length && (!visuals || process.env.NODE_ENV !== "production");
  const vars = { ["--accent" as string]: project.accent, ["--on-accent" as string]: project.onAccent };

  return (
    <article className="case" style={vars}>
      <header className="case__head">
        <div className="wrap">
          <Link href="/#work" className="back">← All work</Link>
          <Reveal>
            <div className="case__badges">
              <ContributionBadge value={project.contribution} />
              {project.flagship ? <span className="badge badge--flagship">Flagship</span> : null}
            </div>
            <h1 className="case__title">{project.title}</h1>
            <p className="case__tagline">{project.tagline}</p>
          </Reveal>
          <dl className="case__meta">
            <div>
              <dt>Sector</dt>
              <dd>{project.sector}</dd>
            </div>
            <div>
              <dt>Platform</dt>
              <dd>{project.platforms.join(", ")}</dd>
            </div>
            <div>
              <dt>My role</dt>
              <dd>{project.role ?? "To be added"}</dd>
            </div>
            <div>
              <dt>Credit</dt>
              <dd>{contributionCopy[project.contribution].note}</dd>
            </div>
            {project.liveUrl ? (
              <div>
                <dt>Live</dt>
                <dd>
                  <a href={project.liveUrl} target="_blank" rel="noreferrer">
                    {project.liveUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")} ↗
                  </a>
                </dd>
              </div>
            ) : null}
          </dl>
        </div>
      </header>

      {visuals || !project.pending?.length ? (
        <div className="case__cover">
          <div className="wrap">
            <Reveal>
              <ProjectImage
                asset={project.cover}
                fallbackLabel={`${project.title}: screens`}
                sizes="(min-width: 1200px) 1140px, 100vw"
                priority
                accent={project.accent}
                className={project.cover?.kind === "mobile" ? "frame--tall" : undefined}
              />
            </Reveal>
          </div>
        </div>
      ) : null}

      <section className="case__section wrap case__overview">
        <p className="eyebrow">Overview</p>
        <div className="case__prose">
          {project.summary.map((s) => (
            <p key={s}>{s}</p>
          ))}
        </div>
      </section>

      {project.rationale ? (
        <section className="case__section wrap">
          <Reveal>
            <RationaleBlock project={project} />
          </Reveal>
        </section>
      ) : null}

      {project.beforeAfter ? (
        <section className="case__section wrap">
          <p className="eyebrow">Before and after</p>
          <BeforeAfterBlock project={project} />
        </section>
      ) : null}

      {project.gallery?.length ? (
        <section className="case__section wrap">
          <p className="eyebrow">Closer look</p>
          <Reveal>
            <GalleryBlock project={project} />
          </Reveal>
        </section>
      ) : null}

      {showPending ? (
        <section className="case__section wrap">
          <p className="eyebrow">Still to be added</p>
          <div className="pending">
            {project.pending!.map((a) => (
              <Placeholder key={a.label} label={a.label} kind={a.kind} expectedPath={a.expectedPath} accent={project.accent} />
            ))}
          </div>
        </section>
      ) : null}

      <nav className="next" aria-label="Next project">
        <div className="wrap">
          <Link href={`/work/${next.slug}`} className="next__link" style={{ ["--accent" as string]: next.accent }}>
            <span className="eyebrow">Next project</span>
            <span className="next__title">
              {next.title} <span aria-hidden="true">→</span>
            </span>
          </Link>
        </div>
      </nav>
    </article>
  );
}
