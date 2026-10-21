"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import { prefersReducedMotion } from "./useMotion";

type Tag = "div" | "section" | "ul" | "ol" | "dl" | "header" | "footer";

/**
 * Staggers its direct children in (fade + rise) the first time it scrolls into
 * view. Children stay visible without JS and for reduced-motion users.
 */
export function Reveal({
  children,
  as: Tag = "div",
  className,
  delay = 0,
  y = 28,
  step = 70,
}: {
  children: React.ReactNode;
  as?: Tag;
  className?: string;
  delay?: number;
  y?: number;
  step?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.dataset.revealed = "true";
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const kids = Array.from(el.children) as HTMLElement[];
        el.dataset.revealed = "true";
        animate(kids, {
          opacity: { from: 0, to: 1 },
          y: { from: y, to: 0 },
          duration: 1100,
          delay: stagger(step, { start: delay }),
          ease: "outExpo",
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay, y, step]);

  return (
    <Tag ref={ref as React.Ref<never>} data-reveal="" className={className}>
      {children}
    </Tag>
  );
}
