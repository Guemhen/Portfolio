"use client";

import { useEffect, useId, useRef, useState } from "react";
import { animate, stagger } from "animejs";
import type { DesignDecision, ProjectAsset } from "@/data/types";
import { Frame, type FrameImage } from "../media/Frame";
import { Placeholder, TextPlaceholder } from "../media/Placeholder";
import { prefersReducedMotion } from "../motion/useMotion";

export interface ExplorerProject {
  slug: string;
  title: string;
  accent: string;
  asset?: ProjectAsset;
  image: FrameImage | null;
  decisions: DesignDecision[];
}

const FIELDS: { key: keyof DesignDecision; label: string }[] = [
  { key: "decision", label: "Design decision" },
  { key: "userNeed", label: "User need" },
  { key: "constraints", label: "Constraints" },
  { key: "alternatives", label: "Alternatives considered" },
  { key: "rationale", label: "Rationale" },
  { key: "tradeoffs", label: "Trade-offs" },
  { key: "outcome", label: "Validation / outcome" },
];

/**
 * "Why I designed it this way": numbered pins on a real screenshot linked to
 * expandable decision panels. Click a pin or a panel header to open it.
 * Empty template fields are shown as labelled gaps, never invented copy.
 */
export function DecisionExplorer({
  projects,
  showPlaceholders,
  showTabs = true,
  forceStacked = false,
}: {
  projects: ExplorerProject[];
  showPlaceholders: boolean;
  showTabs?: boolean;
  /** Image above the panels regardless of screenshot shape (for narrow columns). */
  forceStacked?: boolean;
}) {
  const [tab, setTab] = useState(0);
  const [open, setOpen] = useState<number | null>(0);
  const [hover, setHover] = useState<number | null>(null);
  const id = useId();
  const media = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLOListElement>(null);
  const first = useRef(true);
  const project = projects[tab];
  const stacked = forceStacked || project.asset?.kind === "desktop";
  const isDev = process.env.NODE_ENV !== "production";

  // Animate pins in when the project changes.
  useEffect(() => {
    if (prefersReducedMotion() || !media.current) return;
    const pins = media.current.querySelectorAll("[data-pin]");
    animate(pins, { scale: { from: 0, to: 1 }, opacity: { from: 0, to: 1 }, delay: stagger(90, { start: first.current ? 300 : 150 }), duration: 900, ease: "outElastic(1, .7)" });
    if (!first.current) animate(media.current, { opacity: { from: 0.2, to: 1 }, duration: 600, ease: "outQuad" });
    first.current = false;
  }, [tab]);

  // Stagger the fields of the panel that just opened.
  useEffect(() => {
    if (open === null || prefersReducedMotion() || !list.current) return;
    const rows = list.current.querySelectorAll(`[data-panel="${open}"] [data-field]`);
    animate(rows, { opacity: { from: 0, to: 1 }, x: { from: -10, to: 0 }, delay: stagger(45, { start: 120 }), duration: 700, ease: "outExpo" });
  }, [open, tab]);

  const select = (i: number) => setOpen((o) => (o === i ? null : i));

  return (
    <div>
      {showTabs && projects.length > 1 ? (
        <div role="tablist" aria-label="Project" className="mb-8 flex flex-wrap gap-2">
          {projects.map((p, i) => (
            <button
              key={p.slug}
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={tab === i}
              aria-controls={`${id}-tabpanel`}
              onClick={() => {
                setTab(i);
                setOpen(0);
              }}
              className={`rounded-full border px-4 py-2 font-mono text-[11.5px] uppercase tracking-[0.12em] transition-colors ${tab === i ? "border-fg bg-fg text-ink-950" : "border-line-strong text-fg-muted hover:border-fg hover:text-fg"}`}
            >
              {p.title}
            </button>
          ))}
        </div>
      ) : null}

      <div id={`${id}-tabpanel`} role={showTabs && projects.length > 1 ? "tabpanel" : undefined} aria-labelledby={showTabs && projects.length > 1 ? `${id}-tab-${tab}` : undefined} className={`grid gap-8 ${stacked ? "" : "lg:grid-cols-[1.2fr_1fr] lg:gap-14"}`}>
        {/* Screenshot with pins */}
        <div className={stacked ? "" : "lg:sticky lg:top-24 lg:self-start"}>
          <div ref={media} className={`relative ${forceStacked && project.asset?.kind !== "desktop" ? "max-w-3xl" : ""}`}>
            {project.image && project.asset ? (
              <Frame image={project.image} alt={project.asset.alt} crop={project.asset.crop} background={project.asset.background} className="rounded-2xl border border-line" sizes={stacked ? "(min-width: 1440px) 1360px, 100vw" : "(min-width: 1024px) 55vw, 100vw"} />
            ) : (
              <Placeholder label={`${project.title}: screen for annotations`} kind="multi-screen" expectedPath={project.asset?.src} accent={project.accent} />
            )}
            {project.image
              ? project.decisions.map((d, i) =>
                  d.pin ? (
                    <button
                      key={`${project.slug}-${i}`}
                      data-pin
                      type="button"
                      onClick={() => select(i)}
                      onPointerEnter={() => setHover(i)}
                      onPointerLeave={() => setHover(null)}
                      aria-controls={`${id}-panel-${i}`}
                      aria-expanded={open === i}
                      aria-label={`Decision ${i + 1}: ${d.title}`}
                      className="absolute z-10 -ml-4 -mt-4 grid h-8 w-8 place-items-center rounded-full font-mono text-xs font-medium shadow-[0_6px_20px_rgba(0,0,0,0.45)] transition-[background,color,transform] duration-300 hover:scale-110"
                      style={{
                        left: `${d.pin.x}%`,
                        top: `${d.pin.y}%`,
                        background: open === i || hover === i ? "var(--color-accent)" : "var(--color-ink-950)",
                        color: "var(--color-fg)",
                        boxShadow: "0 0 0 2px rgba(255,255,255,0.85), 0 6px 20px rgba(0,0,0,0.45)",
                      }}
                    >
                      <span aria-hidden="true" className="animate-ping-soft absolute inset-0 rounded-full border-2 border-accent" />
                      {i + 1}
                    </button>
                  ) : null
                )
              : null}
          </div>
          <p className="label mt-3">Tap a number, or open a decision below.</p>
        </div>

        {/* Decision panels */}
        <ol ref={list} className={`border-t border-line ${stacked && !forceStacked ? "mx-auto w-full max-w-4xl" : ""}`}>
          {project.decisions.map((d, i) => {
            const isOpen = open === i;
            return (
              <li key={`${project.slug}-${i}`} data-panel={i} className="border-b border-line" onPointerEnter={() => setHover(i)} onPointerLeave={() => setHover(null)}>
                <h3>
                  <button
                    type="button"
                    id={`${id}-head-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`${id}-panel-${i}`}
                    onClick={() => select(i)}
                    className="group flex w-full items-center gap-4 py-5 text-left"
                  >
                    <span className={`font-mono text-xs transition-colors ${isOpen || hover === i ? "text-accent" : "text-fg-dim"}`}>{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1 text-lg font-medium tracking-tight md:text-xl">{d.title}</span>
                    {isDev && d.draft ? <span className="label rounded border border-amber/40 px-1.5 py-0.5 text-amber!">Draft · review</span> : null}
                    <span aria-hidden="true" className={`grid h-8 w-8 place-items-center rounded-full border border-line-strong transition-transform duration-500 ease-[var(--ease-out-expo)] ${isOpen ? "rotate-45 border-accent text-accent" : ""}`}>
                      +
                    </span>
                  </button>
                </h3>
                <div
                  id={`${id}-panel-${i}`}
                  role="region"
                  aria-labelledby={`${id}-head-${i}`}
                  className="grid transition-[grid-template-rows] duration-700 ease-[var(--ease-out-expo)]"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  inert={!isOpen}
                >
                  <div className="overflow-hidden">
                    <dl className="grid gap-4 pb-7 pl-0 md:pl-9">
                      {FIELDS.map(({ key, label }) => {
                        const value = d[key] as string | undefined;
                        if (!value && !showPlaceholders && key !== "outcome") return null;
                        return (
                          <div key={key} data-field className="grid gap-1 md:grid-cols-[170px_1fr] md:gap-6">
                            <dt className="label pt-0.5">{label}</dt>
                            <dd className="text-[15px] leading-relaxed text-fg-muted">
                              {value ? value : key === "outcome" ? <TextPlaceholder>No verified outcome recorded yet</TextPlaceholder> : <TextPlaceholder>Not documented yet</TextPlaceholder>}
                            </dd>
                          </div>
                        );
                      })}
                    </dl>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
