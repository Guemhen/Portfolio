import Image from "next/image";
import { site } from "@/data/site";
import { projects } from "@/data/projects";
import { resolveImage } from "@/lib/assets";
import { DotGrid } from "./DotGrid";
import { HeroMotion } from "./HeroMotion";

export function Hero() {
  const cutout = resolveImage(site.portrait.cutout);

  return (
    <section id="top" aria-label="Introduction" className="grain relative isolate overflow-hidden">
      {/* Backdrop: dot field, faint hairline grid, vignette */}
      <DotGrid className="[mask-image:radial-gradient(ellipse_70%_65%_at_62%_45%,black_20%,transparent_75%)]" />
      <div aria-hidden="true" className="hairline-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />

      <HeroMotion className="relative mx-auto flex min-h-[100svh] max-w-[1440px] flex-col px-5 pb-10 pt-24 md:px-10 lg:block lg:h-[100svh] lg:min-h-[760px] lg:max-h-[1100px] lg:pt-0">
        {/* Portrait with glow */}
        <div data-hero-portrait className="relative order-2 mx-auto mt-6 h-[54svh] max-h-[560px] min-h-[340px] w-full max-w-[460px] sm:h-[60svh] lg:absolute lg:bottom-0 lg:right-[4%] lg:mt-0 lg:h-[90%] lg:max-h-none lg:w-[44%] lg:max-w-[640px]">
          <div className="relative h-full w-full">
            <div data-hero-glow aria-hidden="true" className="absolute inset-0 -z-10">
              <div className="absolute left-1/2 top-[38%] aspect-square w-[118%] -translate-x-1/2 -translate-y-1/2">
                <div className="absolute inset-[12%] rounded-full bg-[radial-gradient(circle,rgba(255,107,61,0.30)_0%,rgba(249,181,42,0.10)_38%,transparent_68%)] blur-2xl" />
                <svg viewBox="0 0 100 100" className="animate-spin-slow absolute inset-[16%] h-[68%] w-[68%] overflow-visible">
                  <circle data-hero-ring cx="50" cy="50" r="49.5" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="0.25" pathLength={1} strokeDasharray="1" strokeDashoffset="0" />
                  <circle cx="50" cy="0.5" r="0.9" fill="#ff6b3d" />
                </svg>
              </div>
            </div>
            {cutout ? (
              <Image
                src={cutout.src}
                alt={site.portrait.alt}
                width={cutout.width}
                height={cutout.height}
                priority
                sizes="(min-width: 1024px) 44vw, 92vw"
                className="absolute bottom-0 left-1/2 h-full w-auto max-w-none -translate-x-1/2 object-contain object-bottom drop-shadow-[0_30px_60px_rgba(0,0,0,0.55)] [mask-image:linear-gradient(to_top,transparent_0%,black_16%)]"
              />
            ) : (
              <div
                role="img"
                aria-label={`${site.firstName} ${site.lastName} (portrait not yet added)`}
                data-placeholder="true"
                className="hatch absolute inset-x-[12%] bottom-0 top-[8%] grid place-items-center rounded-t-full border border-dashed border-line-strong"
              >
                <span className="text-6xl font-semibold tracking-tighter text-fg-dim">
                  {site.firstName[0]}
                  {site.lastName[0]}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Text */}
        <div data-hero-text className="relative z-10 order-1 lg:absolute lg:bottom-[9%] lg:left-10 lg:right-10">
          <div data-hero-item className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 lg:mb-8">
            <span className="label inline-flex items-center gap-2 text-fg!">
              <span className="animate-pulse-dot h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              {site.role}
            </span>
            {site.status ? <span className="label">{site.status}</span> : null}
            <span className="label hidden sm:inline">Selected work · 01—{String(projects.length).padStart(2, "0")}</span>
          </div>

          <h1 data-hero-name data-split="" className="max-w-[9ch] text-[clamp(3.6rem,15.5vw,6rem)] font-semibold leading-[0.86] tracking-[-0.055em] sm:text-[clamp(4.5rem,13vw,10rem)] lg:text-[clamp(7rem,12.4vw,13.5rem)]">
            {site.firstName} {site.lastName}
          </h1>

          <div className="mt-6 grid gap-7 lg:mt-10 lg:max-w-[44%]">
            <p data-hero-item className="max-w-[30ch] text-lg leading-snug text-fg-muted sm:text-xl lg:text-2xl">
              <span className="text-fg">“</span>
              {site.statement}
              <span className="text-fg">”</span>
            </p>
            <div data-hero-item className="flex flex-wrap items-center gap-3">
              <a href="#work" className="group inline-flex h-12 items-center gap-3 rounded-full bg-fg pl-6 pr-2 text-sm font-medium text-ink-950 transition-colors hover:bg-accent">
                Explore selected work
                <span className="grid h-8 w-8 place-items-center rounded-full bg-ink-950 text-fg transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0.5" aria-hidden="true">
                  ↓
                </span>
              </a>
              <a href="#about" className="inline-flex h-12 items-center rounded-full border border-line-strong px-5 text-sm transition-colors hover:border-fg">
                About me
              </a>
              <a href="#contact" className="hidden h-12 items-center px-3 sm:inline-flex text-sm text-fg-muted underline-offset-4 transition-colors hover:text-fg hover:underline">
                Contact
              </a>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <a
          data-hero-item
          href="#highlights"
          className="label absolute bottom-6 right-5 hidden items-center gap-3 transition-colors hover:text-fg! md:right-10 lg:flex"
          aria-label="Scroll to content"
        >
          Scroll
          <span className="relative block h-10 w-px overflow-hidden bg-line">
            <span className="animate-scroll-line absolute inset-0 bg-fg" />
          </span>
        </a>
      </HeroMotion>
    </section>
  );
}
