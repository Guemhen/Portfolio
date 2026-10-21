"use client";

import Link from "next/link";
import { Fragment, useEffect, useId, useRef, useState } from "react";
import { animate, stagger, utils } from "animejs";
import {
  EVIDENCE_SOURCES,
  type DecisionCardSection,
  type DecisionSource,
  type DesignDecisionCard as CardData,
} from "@/data/types";
import { Frame, type FrameImage } from "../media/Frame";
import { prefersReducedMotion } from "../motion/useMotion";

const SECTIONS: { key: Exclude<DecisionCardSection, "principle">; label: string; prompt: string }[] = [
  { key: "question", label: "The question", prompt: "What should the viewer ask?" },
  { key: "problem", label: "The problem", prompt: "What needed to be solved?" },
  { key: "reasoning", label: "My reasoning", prompt: "Why did I make this decision?" },
  { key: "tradeoff", label: "The trade-off", prompt: "What did I prioritise?" },
];

const SOURCE_LABEL: Record<DecisionSource, string> = {
  "company-brief": "Company brief",
  "stakeholder-feedback": "Stakeholder feedback",
  "aesthetic-preference": "Personal aesthetic preference",
  "designer-judgement": "Design judgement",
  "user-research": "User research",
  "usability-testing": "Usability testing",
  analytics: "Analytics",
};

/** Wraps every occurrence of the given phrases in <mark>, case-insensitively. */
function Emphasis({ text, phrases }: { text: string; phrases?: string[] }) {
  if (!phrases?.length) return <>{text}</>;
  const escaped = [...phrases].sort((a, b) => b.length - a.length).map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const parts = text.split(new RegExp(`(${escaped.join("|")})`, "gi"));
  const lower = phrases.map((p) => p.toLowerCase());
  return (
    <>
      {parts.map((part, i) =>
        lower.includes(part.toLowerCase()) ? (
          <mark key={i} className="bg-transparent font-medium text-fg [background-image:linear-gradient(transparent_62%,rgb(255_107_61/0.28)_62%)]">
            {part}
          </mark>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        )
      )}
    </>
  );
}

function SourceTag({ source }: { source: DecisionSource }) {
  const evidence = EVIDENCE_SOURCES.includes(source);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] ${
        evidence ? "border-emerald-400/40 text-emerald-300" : "border-amber/35 text-amber/90"
      }`}
    >
      <span className={`h-1 w-1 rounded-full ${evidence ? "bg-emerald-300" : "bg-amber"}`} aria-hidden="true" />
      {evidence ? "Evidence" : "Source"} · {SOURCE_LABEL[source]}
    </span>
  );
}

/**
 * Design Decision Card. Four expandable answers (question, problem,
 * reasoning, trade-off) and an always-visible design principle. Opening an
 * answer zooms the visual reference to the part of the screen it talks about.
 * Headers support ↑ ↓ Home End between them.
 */
export function DesignDecisionCard({
  card,
  projectTitle,
  image,
  screensHref,
  index = 1,
}: {
  card: CardData;
  projectTitle: string;
  image: FrameImage | null;
  /** Where "See all screens" goes, e.g. the case study's final UI section. */
  screensHref?: string;
  index?: number;
}) {
  const uid = useId();
  const [open, setOpen] = useState<Set<string>>(() => new Set(["question"]));
  const [active, setActive] = useState<DecisionCardSection | null>(null);
  const root = useRef<HTMLElement>(null);
  const zoomMove = useRef<HTMLDivElement>(null);
  const zoomScale = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const figure = useRef<HTMLElement>(null);
  const headers = useRef<(HTMLButtonElement | null)[]>([]);
  const prevOpen = useRef<Set<string>>(new Set(["question"]));

  const allOpen = open.size === SECTIONS.length;
  const focus = active ? card.focus?.[active] : undefined;
  const sources = Object.values(card.sources ?? {}) as DecisionSource[];
  const hasEvidence = sources.some((s) => EVIDENCE_SOURCES.includes(s));

  const toggle = (key: Exclude<DecisionCardSection, "principle">) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
        if (active === key) setActive(null);
      } else {
        next.add(key);
        setActive(key);
      }
      return next;
    });
  };

  // Entrance: draw the top rule, then stagger the rows in.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.dataset.revealed = "true";
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const rule = el.querySelectorAll("[data-card-rule]");
        const rows = el.querySelectorAll("[data-card-row]");
        // Set the start state inline before un-hiding, so nothing flashes.
        utils.set(rule, { scaleX: 0 });
        utils.set(rows, { opacity: 0, y: 24 });
        el.dataset.revealed = "true";
        animate(rule, { scaleX: 1, duration: 1400, ease: "outExpo" });
        animate(rows, {
          opacity: 1,
          y: 0,
          delay: stagger(80, { start: 150 }),
          duration: 1000,
          ease: "outExpo",
        });
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Stagger the text of answers that have just opened.
  useEffect(() => {
    const added = [...open].filter((k) => !prevOpen.current.has(k));
    prevOpen.current = new Set(open);
    if (!added.length || prefersReducedMotion() || !root.current) return;
    const targets = added.flatMap((k) => [...root.current!.querySelectorAll(`[data-answer="${k}"] > *`)]);
    animate(targets, { opacity: { from: 0, to: 1 }, x: { from: -12, to: 0 }, delay: stagger(60, { start: 140 }), duration: 800, ease: "outExpo" });
  }, [open]);

  // Zoom the visual to the active section's focus point, centred and clamped to the image.
  useEffect(() => {
    const move = zoomMove.current;
    const scale = zoomScale.current;
    if (!move || !scale) return;
    const s = focus?.scale ?? 1;
    const clamp = (v: number) => Math.min(0, Math.max(1 - s, v));
    const tx = focus ? clamp(0.5 - (s * focus.x) / 100) : 0;
    const ty = focus ? clamp(0.5 - (s * focus.y) / 100) : 0;
    if (prefersReducedMotion()) {
      move.style.transform = `translate(${tx * 100}%, ${ty * 100}%)`;
      scale.style.transform = `scale(${s})`;
      return;
    }
    animate(move, { x: `${tx * 100}%`, y: `${ty * 100}%`, duration: 1200, ease: "outExpo" });
    animate(scale, { scale: s, duration: 1200, ease: "outExpo" });
  }, [focus]);

  // Where the focus point lands on screen after zooming (for the marker).
  const marker = focus
    ? (() => {
        const s = focus.scale;
        const clamp = (v: number) => Math.min(0, Math.max(1 - s, v));
        const tx = clamp(0.5 - (s * focus.x) / 100);
        const ty = clamp(0.5 - (s * focus.y) / 100);
        return { left: `${(tx + (s * focus.x) / 100) * 100}%`, top: `${(ty + (s * focus.y) / 100) * 100}%` };
      })()
    : null;

  const onHeaderKey = (e: React.KeyboardEvent, i: number) => {
    const n = SECTIONS.length;
    const to = e.key === "ArrowDown" ? (i + 1) % n : e.key === "ArrowUp" ? (i - 1 + n) % n : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : -1;
    if (to < 0) return;
    e.preventDefault();
    headers.current[to]?.focus();
  };

  const titleId = `${uid}-title`;

  return (
    <article
      ref={root}
      id={card.id}
      aria-labelledby={titleId}
      data-card=""
      className="relative isolate scroll-mt-24 overflow-hidden rounded-[28px] border border-line bg-ink-850/80"
    >
      {/* Restrained accent lighting */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 -z-10 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(255,107,61,0.16),transparent_65%)]" />
      <div aria-hidden="true" className="hairline-grid pointer-events-none absolute inset-0 -z-10 opacity-30 [mask-image:linear-gradient(to_bottom,black,transparent_40%)]" />

      {/* Header */}
      <header data-card-row className="grid gap-5 p-6 md:p-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="label flex items-center gap-3">
            <span className="text-accent">{String(index).padStart(2, "0")}</span>
            <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
            Design decision card
          </p>
          <p className="label">{card.project ?? projectTitle}</p>
        </div>
        <h3 id={titleId} className="max-w-[28ch] text-[clamp(1.6rem,3.2vw,2.6rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
          {card.element}
        </h3>
        {card.keywords?.length ? (
          <ul className="flex flex-wrap gap-2" aria-label="Key ideas">
            {card.keywords.map((k) => (
              <li key={k} className="rounded-full border border-accent/35 bg-accent/[0.06] px-3 py-1 text-sm text-accent-soft">
                {k}
              </li>
            ))}
          </ul>
        ) : null}
      </header>
      <div data-card-rule className="mx-6 h-px origin-left bg-gradient-to-r from-accent/70 via-line-strong to-transparent md:mx-10" aria-hidden="true" />

      {/* Body */}
      <div className={`grid gap-8 p-6 md:p-10 ${card.visual ? "lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-12" : ""}`}>
        <div data-card-row>
          <div className="mb-3 flex justify-end">
            <button
              type="button"
              onClick={() => {
                setOpen(allOpen ? new Set() : new Set(SECTIONS.map((s) => s.key)));
                if (allOpen) setActive(null);
              }}
              className="label rounded-full border border-line px-3 py-1.5 transition-colors hover:border-fg hover:text-fg!"
            >
              {allOpen ? "Collapse all" : "Expand all"}
            </button>
          </div>
          <ol className="border-t border-line">
            {SECTIONS.map((s, i) => {
              const isOpen = open.has(s.key);
              const source = card.sources?.[s.key];
              const hasFocus = !!card.focus?.[s.key];
              return (
                <li key={s.key} className="border-b border-line">
                  <h4>
                    <button
                      ref={(el) => {
                        headers.current[i] = el;
                      }}
                      type="button"
                      id={`${uid}-h-${s.key}`}
                      aria-expanded={isOpen}
                      aria-controls={`${uid}-p-${s.key}`}
                      onClick={() => toggle(s.key)}
                      onKeyDown={(e) => onHeaderKey(e, i)}
                      className="group grid w-full grid-cols-[auto_1fr_auto] items-center gap-x-4 py-4 text-left md:py-5"
                    >
                      <span className={`font-mono text-xs transition-colors ${isOpen ? "text-accent" : "text-fg-dim group-hover:text-fg-muted"}`}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>
                        <span className="block text-lg font-medium tracking-tight">{s.label}</span>
                        <span className="block text-sm text-fg-dim">{s.prompt}</span>
                      </span>
                      <span
                        aria-hidden="true"
                        className={`grid h-8 w-8 place-items-center rounded-full border transition-transform duration-500 ease-[var(--ease-out-expo)] ${isOpen ? "rotate-45 border-accent text-accent" : "border-line-strong"}`}
                      >
                        +
                      </span>
                    </button>
                  </h4>
                  <div
                    id={`${uid}-p-${s.key}`}
                    role="region"
                    aria-labelledby={`${uid}-h-${s.key}`}
                    inert={!isOpen}
                    className="grid transition-[grid-template-rows] duration-700 ease-[var(--ease-out-expo)]"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <div data-answer={s.key} className="grid gap-3 pb-6 pl-0 md:pl-9">
                        <p className={`leading-relaxed ${s.key === "question" ? "text-xl font-medium tracking-tight text-fg md:text-2xl" : "text-[15.5px] text-fg-muted md:text-base"}`}>
                          <Emphasis text={card[s.key]} phrases={card.emphasis} />
                        </p>
                        {source || (hasFocus && image) ? (
                          <div className="flex flex-wrap items-center gap-2">
                            {source ? <SourceTag source={source} /> : null}
                            {hasFocus && image ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setActive(s.key);
                                  // On small screens the visual sits below the answers.
                                  figure.current?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "center" });
                                }}
                                aria-label={`Show ${s.label.toLowerCase()} on the screenshot`}
                                className="label inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 transition-colors hover:border-accent hover:text-accent! lg:hidden"
                              >
                                Show on screen ↗
                              </button>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Visual reference */}
        {card.visual ? (
          <figure ref={figure} data-card-row className="m-0 lg:sticky lg:top-24 lg:self-start">
            {image ? (
              <>
                <div className="relative overflow-hidden rounded-2xl border border-line" style={{ background: card.visual.background }}>
                  <div ref={zoomMove} className="will-change-transform">
                    <div ref={zoomScale} className="origin-top-left will-change-transform">
                      <Frame image={image} alt={card.visual.alt} crop={card.visual.crop} background={card.visual.background} sizes="(min-width: 1024px) 40vw, 100vw" />
                    </div>
                  </div>
                  {marker ? (
                    <span aria-hidden="true" className="pointer-events-none absolute -ml-5 -mt-5 h-10 w-10" style={marker}>
                      <span className="animate-ping-soft absolute inset-0 rounded-full border-2 border-accent" />
                      <span className="absolute inset-3 rounded-full border-2 border-accent bg-accent/20" />
                    </span>
                  ) : null}
                  <span className="label absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)] rounded-md border border-line-strong bg-ink-950/85 px-2 py-1 text-fg! backdrop-blur" aria-live="polite">
                    {focus ? focus.label : "Whole screen"}
                  </span>
                </div>
                <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-sm text-fg-muted">Visual reference · {card.element.split(",")[0]}</span>
                  <span className="flex flex-wrap gap-2">
                    {focus ? (
                      <button type="button" onClick={() => setActive(null)} className="label rounded-full border border-line px-2.5 py-1 hover:border-fg hover:text-fg!">
                        Reset view
                      </button>
                    ) : null}
                    <button type="button" onClick={() => dialog.current?.showModal()} className="label rounded-full border border-line px-2.5 py-1 hover:border-fg hover:text-fg!">
                      View full screen
                    </button>
                    {screensHref ? (
                      <Link href={screensHref} className="label rounded-full border border-line px-2.5 py-1 hover:border-accent hover:text-accent!">
                        All screens →
                      </Link>
                    ) : null}
                  </span>
                </figcaption>
                <dialog
                  ref={dialog}
                  onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
                  aria-label={card.visual.alt}
                  className="m-0 h-full max-h-none w-full max-w-none bg-ink-950/90 p-4 text-fg backdrop:bg-transparent open:grid open:place-items-center"
                >
                  <div className="grid w-full max-w-4xl gap-3">
                    <div className="overflow-hidden rounded-xl">
                      <Frame image={image} alt={card.visual.alt} crop={card.visual.crop} background={card.visual.background} sizes="90vw" />
                    </div>
                    <div className="flex justify-end">
                      <button type="button" onClick={() => dialog.current?.close()} className="h-11 rounded-full border border-line-strong px-4 text-sm hover:border-fg">
                        Close
                      </button>
                    </div>
                  </div>
                </dialog>
              </>
            ) : null}
          </figure>
        ) : null}
      </div>

      {/* Principle */}
      <footer data-card-row className="border-t border-line bg-ink-900/60 p-6 md:p-10">
        <p className="label flex items-center gap-3">
          <span className="text-accent">05</span>
          <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
          The design principle
        </p>
        <blockquote className="mt-4 grid gap-3">
          <p className="max-w-[24ch] text-[clamp(1.6rem,3.6vw,3rem)] font-semibold leading-[1.02] tracking-[-0.04em]">
            <Emphasis text={card.principle} phrases={card.emphasis} />
          </p>
          {card.principleDetail ? <p className="max-w-[60ch] text-fg-muted">{card.principleDetail}</p> : null}
        </blockquote>
        <p className="mt-6 flex items-start gap-2 text-sm text-fg-dim">
          <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${hasEvidence ? "bg-emerald-300" : "bg-amber"}`} aria-hidden="true" />
          <span>
            {sources.length ? <>Based on: {[...new Set(sources)].map((s) => SOURCE_LABEL[s]).join(" · ")}. </> : null}
            {hasEvidence ? "Answers backed by user evidence are tagged in green." : "No user research or testing is cited for this decision."}
          </span>
        </p>
      </footer>
    </article>
  );
}
