import { site } from "@/data/site";
import { Reveal } from "../motion/Reveal";
import { SplitHeading } from "../motion/SplitHeading";

export function About({ index = "05" }: { index?: string }) {
  return (
    <section id="about" aria-labelledby="about-title" className="mx-auto max-w-[1440px] px-5 md:px-10">
      <div className="grid gap-14 lg:grid-cols-[1.25fr_1fr] lg:gap-20">
        <div className="grid content-start gap-8">
          <p className="label flex items-center gap-3">
            <span className="text-accent">{index}</span>
            <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
            About
          </p>
          <SplitHeading id="about-title" className="text-[clamp(2.4rem,5.6vw,5rem)] font-semibold leading-[0.95] tracking-[-0.045em]" by="words">
            {site.about.lead}
          </SplitHeading>
          <Reveal className="grid max-w-[60ch] gap-5 text-lg leading-relaxed text-fg-muted">
            {site.about.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <p className="border-l border-accent/60 pl-4 text-base text-fg-dim">{site.about.aside}</p>
          </Reveal>
        </div>

        <div className="grid content-start gap-10">
          <div>
            <p className="label mb-4">Skills</p>
            <Reveal as="ul" className="border-t border-line" step={50}>
              {site.skills.map((s, i) => (
                <li key={s} className="group flex items-baseline gap-5 border-b border-line py-3.5">
                  <span className="font-mono text-[11px] text-fg-dim transition-colors group-hover:text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-lg tracking-tight transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1.5">{s}</span>
                </li>
              ))}
            </Reveal>
          </div>
          <Reveal className="grid gap-2">
            <p className="label">Education</p>
            <p className="text-lg">{site.education.degree}</p>
            <p className="text-sm text-fg-muted">{site.education.school}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
