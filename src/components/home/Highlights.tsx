"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import { prefersReducedMotion } from "../motion/useMotion";

/** Compact row of verifiable highlights directly under the hero. */
export function Highlights({ items }: { items: { label: string; value: string; numeric?: boolean }[] }) {
  const ref = useRef<HTMLDListElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) {
      if (el) el.dataset.revealed = "true";
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        el.dataset.revealed = "true";
        const cells = el.querySelectorAll<HTMLElement>("[data-cell]");
        animate(cells, { opacity: { from: 0, to: 1 }, y: { from: 20, to: 0 }, delay: stagger(90), duration: 1000, ease: "outExpo" });
        // Count numeric values up from zero.
        el.querySelectorAll<HTMLElement>("[data-count]").forEach((node) => {
          const target = Number(node.dataset.count);
          const pad = node.textContent?.length ?? 2;
          const o = { v: 0 };
          animate(o, {
            v: target,
            duration: 1400,
            ease: "outExpo",
            onUpdate: () => (node.textContent = String(Math.round(o.v)).padStart(pad, "0")),
          });
        });
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <dl ref={ref} data-reveal="" className="grid grid-cols-2 border-y border-line lg:grid-cols-4">
      {items.map((h, i) => (
        <div
          key={h.label}
          data-cell
          className={`flex flex-col gap-3 px-5 py-6 md:px-10 md:py-8 ${i % 2 === 1 ? "border-l border-line" : ""} ${i >= 2 ? "border-t border-line lg:border-t-0" : ""} ${i === 2 ? "lg:border-l" : ""}`}
        >
          <dt className="label">{h.label}</dt>
          <dd className="text-2xl font-medium tracking-tight md:text-3xl">
            {h.numeric ? <span data-count={Number(h.value)}>{h.value}</span> : h.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
