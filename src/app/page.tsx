import { flagship, projects } from "@/data/projects";
import { highlights, site } from "@/data/site";
import { resolveImage } from "@/lib/assets";
import { Hero } from "@/components/home/Hero";
import { Highlights } from "@/components/home/Highlights";
import { About } from "@/components/home/About";
import { ContactActions } from "@/components/home/Contact";
import { WorkIndex } from "@/components/work/WorkIndex";
import { FeaturedCase } from "@/components/work/FeaturedCase";
import { CaseEntry, PendingEntry } from "@/components/work/CaseEntries";
import { RationaleBlock } from "@/components/rationale/RationaleBlock";
import { SectionHeader } from "@/components/site/SectionHeader";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Reveal } from "@/components/motion/Reveal";

const hasVisuals = (p: (typeof projects)[number]) => !!resolveImage(p.cover?.src);

export default function Home() {
  const others = projects.filter((p) => p !== flagship);
  const withVisuals = others.filter(hasVisuals);
  const pending = others.filter((p) => !hasVisuals(p));
  const indexItems = projects.map((p) => ({
    slug: p.slug,
    title: p.title,
    tagline: p.tagline,
    sector: p.sector,
    contribution: p.contribution,
    accent: p.accent,
    cover: p.cover,
    image: resolveImage(p.cover?.src),
  }));

  return (
    <>
      <Hero />

      <section id="highlights" aria-label="Highlights">
        <Highlights items={highlights(projects.length)} />
      </section>

      <section id="work" aria-labelledby="work-title" className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-36">
        <SectionHeader
          id="work-title"
          index="01"
          label="Index"
          title="Selected work"
          intro="Product and interface design across property, education, mobility and fintech. Redesigns, concepts and team projects are labelled as such."
          className="mb-12 md:mb-20"
        />
        <WorkIndex items={indexItems} />
      </section>

      <div className="pb-24 md:pb-36">
        <FeaturedCase project={flagship} index="02" />
      </div>

      <section id="cases" aria-labelledby="cases-title" className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-36">
        <SectionHeader id="cases-title" index="03" label="Case studies" title="More case studies" className="mb-14 md:mb-24" />
        <div className="grid gap-20 md:gap-32">
          {withVisuals.map((p, i) => (
            <CaseEntry key={p.slug} project={p} index={projects.indexOf(p) + 1} flip={i % 2 === 1} />
          ))}
        </div>

        {pending.length ? (
          <div className="mt-24 md:mt-36">
            <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">In preparation</h3>
              <p className="max-w-[48ch] text-sm text-fg-muted">
                These projects are real and on my CV. Their screens are not published yet, so they appear as clearly labelled placeholders.
              </p>
            </Reveal>
            <Reveal className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" step={80}>
              {pending.map((p) => (
                <PendingEntry key={p.slug} project={p} />
              ))}
            </Reveal>
          </div>
        ) : null}
      </section>

      <section id="rationale" aria-labelledby="rationale-title" className="border-y border-line bg-ink-950 py-24 md:py-36">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <SectionHeader
            id="rationale-title"
            index="04"
            label="Design rationale"
            title="Why I designed it this way"
            intro="Each pin marks a decision. Open it to see the need it answers, the reasoning, and what it cost. Outcomes appear only where they are verified."
            className="mb-12 md:mb-20"
          />
          <RationaleBlock projects={projects} />
        </div>
      </section>

      <div className="py-24 md:py-36">
        <About index="05" />
      </div>

      <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden border-t border-line">
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-1/2 left-1/2 aspect-square w-[120vw] max-w-[1400px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,107,61,0.16),transparent_60%)]" />
        <div className="relative mx-auto grid max-w-[1440px] gap-10 px-5 py-24 md:px-10 md:py-40">
          <p className="label flex items-center gap-3">
            <span className="text-accent">06</span>
            <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
            Contact
          </p>
          <SplitHeading id="contact-title" className="max-w-[12ch] text-[clamp(3rem,10vw,9.5rem)] font-semibold leading-[0.88] tracking-[-0.055em]">
            Let’s design something clear.
          </SplitHeading>
          <Reveal>
            <ContactActions email={site.email} links={site.links} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
