import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/data/projects";
import { site } from "@/data/site";
import type { AssetKind, Project } from "@/data/types";
import { resolveImage } from "@/lib/assets";
import { Badge, contributionCopy } from "@/components/site/Badge";
import { Gallery } from "@/components/media/Gallery";
import { BeforeAfter } from "@/components/media/BeforeAfter";
import { Placeholder, TextPlaceholder } from "@/components/media/Placeholder";
import { ProjectImage } from "@/components/media/ProjectImage";
import { RationaleBlock } from "@/components/rationale/RationaleBlock";
import { DecisionCards } from "@/components/decisions/DecisionCards";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getProject((await params).slug);
  if (!p) return {};
  return { title: p.title, description: p.tagline, openGraph: p.cover ? { images: [p.cover.src] } : undefined };
}

const hasVisuals = (p: Project) => [p.cover, ...(p.gallery ?? [])].some((a) => a && resolveImage(a.src));

function Section({ n, title, id, children }: { n: number; title: string; id?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mx-auto grid max-w-[1440px] gap-6 border-t border-line px-5 py-14 md:grid-cols-12 md:gap-10 md:px-10 md:py-20">
      <div className="md:col-span-3">
        <div className="md:sticky md:top-24">
          <p className="label flex items-center gap-3">
            <span className="text-accent">{String(n).padStart(2, "0")}</span>
            <span className="h-px w-6 bg-line-strong" aria-hidden="true" />
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] md:text-3xl">{title}</h2>
        </div>
      </div>
      <div className="min-w-0 md:col-span-9">{children}</div>
    </section>
  );
}

/** Labelled placeholders for pending assets of the given kinds, or null when there are none. */
function pendingFor(project: Project, kinds: AssetKind[]) {
  const items = (project.pending ?? []).filter((a) => kinds.includes(a.kind));
  if (!items.length || !site.showContentPlaceholders) return null;
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {items.map((a) => (
        <Placeholder key={a.label} label={a.label} kind={a.kind} expectedPath={a.expectedPath} accent={project.accent} />
      ))}
    </div>
  );
}

export default async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const project = getProject((await params).slug);
  if (!project) notFound();

  const i = projects.indexOf(project);
  const after = [...projects.slice(i + 1), ...projects.slice(0, i)];
  const next = after.find(hasVisuals) ?? after[0] ?? project;
  const visuals = hasVisuals(project);
  const ph = site.showContentPlaceholders;
  const galleryItems = (list = project.gallery ?? []) => list.map((asset) => ({ asset, image: resolveImage(asset.src) }));
  const tall = project.cover?.kind === "mobile";
  const wide = project.cover?.kind === "multi-screen";

  let n = 0;
  const sections: { title: string; body: React.ReactNode; id?: string }[] = [];
  const add = (title: string, body: React.ReactNode | null, id?: string) => body && sections.push({ title, body, id });

  add(
    "Overview",
    <Reveal className="grid max-w-[64ch] gap-5 text-lg leading-relaxed text-fg-muted md:text-xl">
      {project.overview.map((p) => (
        <p key={p}>{p}</p>
      ))}
    </Reveal>
  );

  if (visuals) {
    add("The challenge", project.challenge ? <p className="max-w-[40ch] text-2xl font-medium leading-snug tracking-tight md:text-3xl">{project.challenge}</p> : ph ? <TextPlaceholder>Problem and design challenge not written yet</TextPlaceholder> : null);
    if (project.decisionCards?.length) {
      add(
        project.decisionCards.length > 1 ? "Design decision cards" : "Design decision card",
        <DecisionCards project={project} screensHref="#final-ui" />,
        "decision-cards"
      );
    }
    add(
      "Research and user needs",
      project.research?.length ? (
        <ul className="grid gap-4">
          {project.research.map((r) => (
            <li key={r} className="border-l border-accent/60 pl-4 text-lg text-fg-muted">
              {r}
            </li>
          ))}
        </ul>
      ) : ph ? (
        <TextPlaceholder>No research documented yet. Add only insights you actually gathered.</TextPlaceholder>
      ) : null
    );
    add(
      "Process",
      project.process?.length ? (
        <ol className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
          {project.process.map((s, k) => (
            <li key={s.step} className="grid gap-2 bg-ink-900 p-6">
              <span className="font-mono text-xs text-accent">{String(k + 1).padStart(2, "0")}</span>
              <span className="text-lg font-medium">{s.step}</span>
              <span className="text-sm text-fg-muted">{s.detail}</span>
            </li>
          ))}
        </ol>
      ) : ph ? (
        <TextPlaceholder>Process steps not documented yet</TextPlaceholder>
      ) : null
    );
    add(
      "Information architecture and flows",
      project.flows?.length ? <Gallery items={galleryItems(project.flows)} accent={project.accent} /> : pendingFor(project, ["flow"])
    );
    add(
      "Wireframes and final UI",
      <div className="grid gap-10">
        {project.wireframes?.length ? <Gallery items={galleryItems(project.wireframes)} accent={project.accent} /> : pendingFor(project, ["wireframe"])}
        {project.gallery?.length ? <Gallery items={galleryItems()} accent={project.accent} /> : null}
        {pendingFor(project, ["desktop", "mobile", "multi-screen"])}
      </div>,
      "final-ui"
    );
    if (project.decisions?.length) {
      add("Why I designed it this way", <RationaleBlock projects={[project]} tabs={false} stacked />);
    }
    if (project.beforeAfter) {
      const b = resolveImage(project.beforeAfter.before.src);
      const a = resolveImage(project.beforeAfter.after.src);
      add(
        "Before and after",
        b && a ? (
          <BeforeAfter before={{ image: b, alt: project.beforeAfter.before.alt }} after={{ image: a, alt: project.beforeAfter.after.alt }} caption={project.beforeAfter.caption} />
        ) : (
          <Placeholder label="Before / after comparison" kind="after" expectedPath={(b ? project.beforeAfter.after : project.beforeAfter.before).src} accent={project.accent} />
        )
      );
    } else {
      add("Before and after", pendingFor(project, ["before", "after"]));
    }
    add(
      "Outcome",
      project.outcome ? <p className="max-w-[56ch] text-xl leading-snug">{project.outcome}</p> : <TextPlaceholder>No verified outcome recorded yet</TextPlaceholder>
    );
  } else {
    add("Screens", pendingFor(project, ["desktop", "mobile", "multi-screen", "detail", "flow", "wireframe"]));
  }

  return (
    <article style={{ ["--project-accent" as string]: project.accent }}>
      <header className="mx-auto max-w-[1440px] px-5 pb-12 pt-28 md:px-10 md:pb-16 md:pt-40">
        <Link href="/#work" className="label inline-flex items-center gap-2 transition-colors hover:text-fg!">
          ← All work
        </Link>
        <p className="label mt-10 flex items-center gap-3">
          <span style={{ color: project.accent }}>{String(i + 1).padStart(2, "0")}</span>
          <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
          {project.sector ?? "Sector to be confirmed"}
        </p>
        <SplitHeading as="h1" immediate className="mt-5 max-w-[14ch] text-[clamp(3rem,9vw,8.5rem)] font-semibold leading-[0.88] tracking-[-0.055em]">
          {project.title}
        </SplitHeading>
        <Reveal className="mt-8 grid gap-6" delay={300}>
          <p className="max-w-[46ch] text-lg leading-snug text-fg-muted md:text-xl">{project.tagline}</p>
          <div className="flex flex-wrap items-center gap-2">
            <Badge value={project.contribution} />
            {project.flagship ? <span className="rounded-full border border-accent/50 px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.12em] text-accent">Flagship</span> : null}
          </div>
        </Reveal>

        <Reveal as="dl" className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-4" delay={400} step={60}>
          <div className="bg-ink-900 p-5">
            <dt className="label">Role</dt>
            <dd className="mt-2 text-sm">{project.role ?? <TextPlaceholder>To be added</TextPlaceholder>}</dd>
          </div>
          <div className="bg-ink-900 p-5">
            <dt className="label">Credit</dt>
            <dd className="mt-2 text-sm text-fg-muted">{contributionCopy[project.contribution].note}</dd>
          </div>
          <div className="bg-ink-900 p-5">
            <dt className="label">Platform</dt>
            <dd className="mt-2 text-sm">{project.platforms.join(", ")}</dd>
          </div>
          <div className="bg-ink-900 p-5">
            <dt className="label">{project.liveUrl ? "Live" : "Sector"}</dt>
            <dd className="mt-2 text-sm">
              {project.liveUrl ? (
                <a href={project.liveUrl} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-accent">
                  {project.liveUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")} ↗
                </a>
              ) : (
                project.sector ?? "To be confirmed"
              )}
            </dd>
          </div>
        </Reveal>

        {project.contribution === "team" ? (
          <Reveal className="mt-6 rounded-2xl border border-accent/30 bg-accent/[0.04] p-5 md:p-6">
            <p className="label text-accent-soft!">My contribution to this team project</p>
            <div className="mt-3 text-base leading-relaxed">
              {project.contributionDetail ?? (
                <TextPlaceholder>Specific pages, components or responsibilities to be added</TextPlaceholder>
              )}
            </div>
          </Reveal>
        ) : null}
      </header>

      {visuals ? (
        <div className="mx-auto max-w-[1440px] px-5 pb-10 md:px-10 md:pb-16">
          <div className={`overflow-hidden rounded-[28px] border border-line ${tall ? "bg-ink-850 px-6 py-10 md:py-16" : ""}`}>
            {/* Wide compositions are cover-fitted to 16:9; desktop screenshots keep their own shape (less zoom, so no UI is cropped). */}
            {tall ? (
              <div className="mx-auto max-w-[420px]">
                <ProjectImage asset={project.cover} fallbackLabel={project.title} sizes="420px" priority accent={project.accent} />
              </div>
            ) : (
              <Parallax strength={wide ? 30 : 12}>
                <div className={wide ? "scale-[1.12]" : "scale-[1.05]"}>
                  <ProjectImage asset={project.cover} fallbackLabel={project.title} sizes="(min-width: 1440px) 1360px, 100vw" priority accent={project.accent} aspect={wide ? "16 / 9" : undefined} />
                </div>
              </Parallax>
            )}
          </div>
        </div>
      ) : null}

      {sections.map((s) => (
        <Section key={s.title} id={s.id} n={++n} title={s.title}>
          {s.body}
        </Section>
      ))}

      <nav aria-label="Next project" className="border-t border-line">
        <Link href={`/work/${next.slug}`} className="group mx-auto grid max-w-[1440px] gap-4 px-5 py-20 md:px-10 md:py-28">
          <span className="label">Next project</span>
          <span className="flex items-baseline justify-between gap-6 text-[clamp(2.4rem,7vw,6.5rem)] font-semibold leading-[0.9] tracking-[-0.05em]">
            <span className="transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-x-3">{next.title}</span>
            <span aria-hidden="true" className="text-fg-dim transition-colors group-hover:text-accent">
              →
            </span>
          </span>
        </Link>
      </nav>
    </article>
  );
}
