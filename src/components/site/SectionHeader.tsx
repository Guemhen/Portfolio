import { SplitHeading } from "../motion/SplitHeading";
import { Reveal } from "../motion/Reveal";

/** Numbered section label, large split heading and an optional one-line intro. */
export function SectionHeader({ index, label, title, intro, id, className = "" }: { index: string; label: string; title: string; intro?: string; id?: string; className?: string }) {
  return (
    <header className={`grid gap-6 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:items-end md:gap-10 ${className}`}>
      <div className="grid gap-5">
        <p className="label flex items-center gap-3">
          <span className="text-accent">{index}</span>
          <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
          {label}
        </p>
        <SplitHeading id={id} className="text-[clamp(2.4rem,6vw,5.2rem)] font-semibold leading-[0.92] tracking-[-0.045em]">{title}</SplitHeading>
      </div>
      {intro ? (
        <Reveal>
          <p className="max-w-[46ch] text-base leading-relaxed text-fg-muted md:justify-self-end md:text-lg">{intro}</p>
        </Reveal>
      ) : null}
    </header>
  );
}
