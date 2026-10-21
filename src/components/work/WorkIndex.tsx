"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { animate, createAnimatable } from "animejs";
import type { Contribution, ProjectAsset } from "@/data/types";
import { Badge } from "../site/Badge";
import { Frame, type FrameImage } from "../media/Frame";
import { Placeholder } from "../media/Placeholder";
import { hasFinePointer, prefersReducedMotion } from "../motion/useMotion";

export interface WorkIndexItem {
  slug: string;
  title: string;
  tagline: string;
  sector?: string;
  contribution: Contribution;
  accent: string;
  cover?: ProjectAsset;
  image: FrameImage | null;
}

/**
 * The selected-work index: one row per project. With a mouse, a preview of
 * the project follows the cursor; on touch screens each row shows a thumbnail.
 */
export function WorkIndex({ items }: { items: WorkIndexItem[] }) {
  const listRef = useRef<HTMLOListElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [fine, setFine] = useState(false);
  const follow = useRef<ReturnType<typeof createAnimatable> | null>(null);

  useEffect(() => {
    const isFine = hasFinePointer();
    setFine(isFine);
    if (!isFine || !preview.current) return;
    follow.current = createAnimatable(preview.current, {
      x: prefersReducedMotion() ? 0 : 700,
      y: prefersReducedMotion() ? 0 : 700,
      ease: "outQuart",
    });
    return () => {
      follow.current?.revert();
    };
  }, []);

  useEffect(() => {
    const p = preview.current;
    if (!p || !fine) return;
    if (prefersReducedMotion()) {
      p.style.opacity = active === null ? "0" : "1";
      return;
    }
    animate(p, {
      opacity: active === null ? 0 : 1,
      scale: active === null ? 0.85 : 1,
      duration: 500,
      ease: "outExpo",
    });
  }, [active, fine]);

  const onMove = (e: React.PointerEvent) => {
    if (!follow.current) return;
    follow.current.x(e.clientX + 24);
    follow.current.y(e.clientY - 120);
  };

  return (
    <div className="relative" onPointerMove={onMove} onPointerLeave={() => setActive(null)}>
      <ol ref={listRef} className="border-t border-line">
        {items.map((p, i) => (
          <li key={p.slug} className="border-b border-line">
            <Link
              href={`/work/${p.slug}`}
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(null)}
              className="group relative grid grid-cols-[auto_1fr_auto] items-center gap-x-4 gap-y-1 py-6 outline-offset-[-2px] md:grid-cols-[64px_1fr_180px_170px_32px] md:gap-x-6 md:py-8"
            >
              {/* sweep highlight */}
              <span aria-hidden="true" className="absolute inset-x-0 bottom-[-1px] h-px origin-left scale-x-0 bg-fg transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-x-100 group-focus-visible:scale-x-100" style={{ background: p.accent }} />

              <span className="row-span-2 font-mono text-xs text-fg-dim transition-colors group-hover:text-accent md:row-span-1">
                {/* Touch: thumbnail; mouse: index number */}
                <span className="md:hidden">
                  <span className="block w-16 overflow-hidden rounded-lg border border-line">
                    {p.image && p.cover ? (
                      <Frame image={p.image} alt="" crop={p.cover.crop} aspect={p.cover.crop ? undefined : "4 / 3"} focus={p.cover.focus} background={p.cover.background} sizes="64px" />
                    ) : (
                      <span className="hatch block aspect-[4/3]" style={{ ["--ph" as string]: p.accent }} />
                    )}
                  </span>
                </span>
                <span className="hidden md:inline">{String(i + 1).padStart(2, "0")}</span>
              </span>

              <span className="min-w-0">
                <span className="block text-[clamp(1.5rem,4.2vw,3.6rem)] font-medium leading-[1.02] tracking-[-0.035em] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-x-3">
                  {p.title}
                </span>
                <span className="mt-1 block text-sm text-fg-muted md:hidden">{p.tagline}</span>
              </span>

              <span className="hidden text-sm text-fg-muted md:block">{p.sector ?? "Sector to be confirmed"}</span>
              <span className="col-start-2 md:col-start-auto">
                <Badge value={p.contribution} />
                {!p.image ? <span className="label ml-2 md:hidden">· Visuals pending</span> : null}
              </span>
              <span aria-hidden="true" className="col-start-3 row-span-2 row-start-1 text-xl text-fg-dim transition-all duration-500 group-hover:translate-x-1 group-hover:text-fg md:col-start-auto md:row-span-1">
                →
              </span>
            </Link>
          </li>
        ))}
      </ol>

      {/* Cursor-following preview (mouse only) */}
      <div ref={preview} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-30 hidden w-[340px] opacity-0 md:block">
        {fine
          ? items.map((p, i) => (
              <div key={p.slug} className={`absolute left-0 top-0 w-full overflow-hidden rounded-2xl border border-line-strong bg-ink-800 shadow-2xl shadow-black/60 transition-opacity duration-300 ${active === i ? "opacity-100" : "opacity-0"}`}>
                {p.image && p.cover ? (
                  <Frame image={p.image} alt="" aspect="4 / 3" focus={p.cover.focus ?? { x: 50, y: 30 }} background={p.cover.background} sizes="340px" />
                ) : (
                  <Placeholder label={`${p.title}: visuals not supplied yet`} kind="multi-screen" accent={p.accent} aspect="4 / 3" />
                )}
              </div>
            ))
          : null}
      </div>
    </div>
  );
}
