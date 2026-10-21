"use client";

import { useEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";
import { hasFinePointer, prefersReducedMotion } from "../motion/useMotion";

const MAX_DOTS = 640;

/**
 * Field of dots behind the hero, a nod to the stagger-grid demos on
 * animejs.com. A wave runs from the centre on load; with a mouse, moving
 * around the hero sends a soft ripple from the nearest dot (throttled).
 */
export function DotGrid({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [grid, setGrid] = useState<{ cols: number; rows: number; gap: number } | null>(null);

  // Size the grid to the container, capped so mobile stays cheap.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      let gap = width < 640 ? 30 : 38;
      while ((Math.floor(width / gap) + 1) * (Math.floor(height / gap) + 1) > MAX_DOTS) gap += 4;
      setGrid({ cols: Math.floor(width / gap) + 1, rows: Math.floor(height / gap) + 1, gap });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !grid || prefersReducedMotion()) return;
    const dots = el.querySelectorAll<HTMLElement>("[data-dot]");
    const dims = [grid.cols, grid.rows];

    const wave = (from: number | "center", amp: number, step: number) =>
      animate(dots, {
        scale: [{ to: amp, duration: 350, ease: "outQuad" }, { to: 1, duration: 900, ease: "outElastic(1, .6)" }],
        opacity: [{ to: 0.9, duration: 350 }, { to: 0.28, duration: 900 }],
        delay: stagger(step, { grid: dims, from }),
      });

    const first = wave("center", 2.2, 45);

    if (!hasFinePointer()) return () => first.cancel();
    const section = el.parentElement!;
    let last = 0;
    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - last < 1100) return;
      last = now;
      const r = el.getBoundingClientRect();
      const col = Math.max(0, Math.min(grid.cols - 1, Math.round((e.clientX - r.left) / grid.gap)));
      const row = Math.max(0, Math.min(grid.rows - 1, Math.round((e.clientY - r.top) / grid.gap)));
      wave(row * grid.cols + col, 1.7, 28);
    };
    section.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      first.cancel();
      section.removeEventListener("pointermove", onMove);
    };
  }, [grid]);

  return (
    <div ref={ref} aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {grid ? (
        <div
          className="absolute left-0 top-0 grid"
          style={{ gridTemplateColumns: `repeat(${grid.cols}, ${grid.gap}px)`, gridAutoRows: `${grid.gap}px` }}
        >
          {Array.from({ length: grid.cols * grid.rows }, (_, i) => (
            <span key={i} className="grid place-items-center">
              <span data-dot className="block h-[3px] w-[3px] rounded-full bg-fg opacity-[0.28]" />
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
