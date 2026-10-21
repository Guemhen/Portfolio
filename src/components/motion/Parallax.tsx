"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "./useMotion";

/**
 * Moves its content slightly slower than the page while it is on screen.
 * `strength` is the maximum offset in pixels. Uses a single passive scroll
 * listener and rAF, and only transforms (no layout work).
 */
export function Parallax({ children, strength = 40, className }: { children: React.ReactNode; strength?: number; className?: string }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;
    let frame = 0;
    let visible = false;
    const update = () => {
      frame = 0;
      const r = o.getBoundingClientRect();
      const vh = window.innerHeight;
      // -1 when the element enters at the bottom, +1 when it leaves at the top
      const progress = (vh / 2 - (r.top + r.height / 2)) / (vh / 2 + r.height / 2);
      i.style.transform = `translate3d(0, ${(progress * strength).toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (visible && !frame) frame = requestAnimationFrame(update);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) onScroll();
    });
    io.observe(o);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [strength]);

  return (
    <div ref={outer} className={className}>
      <div ref={inner} className="will-change-transform">
        {children}
      </div>
    </div>
  );
}
