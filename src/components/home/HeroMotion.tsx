"use client";

import { useEffect, useRef } from "react";
import { createAnimatable, createTimeline, splitText, stagger, utils } from "animejs";
import { hasFinePointer, prefersReducedMotion } from "../motion/useMotion";

/**
 * Orchestrates the hero: staggered entrance, pointer parallax on the portrait
 * and glow, and a gentle scroll parallax. Markup is rendered by the server
 * component; this only wires behaviour onto data attributes.
 */
export function HeroMotion({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const items = el.querySelectorAll<HTMLElement>("[data-hero-item]");
    const name = el.querySelector<HTMLElement>("[data-hero-name]");
    const portrait = el.querySelector<HTMLElement>("[data-hero-portrait]");
    const glow = el.querySelector<HTMLElement>("[data-hero-glow]");
    const ring = el.querySelector<SVGCircleElement>("[data-hero-ring]");

    const reveal = () => {
      items.forEach((i) => (i.dataset.revealed = "true"));
      if (name) name.dataset.splitReady = "true";
    };

    if (prefersReducedMotion()) {
      reveal();
      return;
    }

    // Entrance
    const split = name ? splitText(name, { words: { wrap: "clip" }, chars: true, accessible: true }) : null;
    utils.set(items, { opacity: 0, y: 24 });
    if (split) utils.set(split.chars, { y: "115%" });
    if (portrait) utils.set(portrait, { opacity: 0, y: 80, scale: 0.97 });
    if (glow) utils.set(glow, { opacity: 0, scale: 0.6 });
    reveal();

    const tl = createTimeline({ defaults: { ease: "outExpo", duration: 1300 } });
    if (glow) tl.add(glow, { opacity: 1, scale: 1, duration: 2200 }, 0);
    if (ring) tl.add(ring, { strokeDashoffset: { from: 1, to: 0 }, duration: 2400, ease: "inOutQuart" }, 100);
    if (split) tl.add(split.chars, { y: "0%", delay: stagger(38) }, 120);
    if (portrait) tl.add(portrait, { opacity: 1, y: 0, scale: 1, duration: 1600 }, 260);
    tl.add(items, { opacity: 1, y: 0, delay: stagger(90) }, 520);

    // Pointer parallax: portrait follows the pointer a little, glow moves the other way.
    const cleanups: (() => void)[] = [];
    if (hasFinePointer() && portrait && glow) {
      const p = createAnimatable(portrait.firstElementChild as HTMLElement, { x: 1100, y: 1100, rotate: 1100, ease: "outQuart" });
      const g = createAnimatable(glow.firstElementChild as HTMLElement, { x: 1600, y: 1600, ease: "outQuart" });
      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        p.x(nx * 18);
        p.y(ny * 10);
        p.rotate(nx * 1.2);
        g.x(nx * -40);
        g.y(ny * -30);
      };
      const onLeave = () => {
        p.x(0);
        p.y(0);
        p.rotate(0);
        g.x(0);
        g.y(0);
      };
      el.addEventListener("pointermove", onMove, { passive: true });
      el.addEventListener("pointerleave", onLeave);
      cleanups.push(() => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
        p.revert();
        g.revert();
      });
    }

    // Scroll parallax: portrait drifts down, text drifts up and fades.
    const text = el.querySelector<HTMLElement>("[data-hero-text]");
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const y = Math.min(window.scrollY, window.innerHeight);
        if (portrait) portrait.style.translate = `0 ${(y * 0.18).toFixed(1)}px`;
        if (text) {
          text.style.translate = `0 ${(y * -0.08).toFixed(1)}px`;
          text.style.opacity = String(Math.max(0, 1 - y / (window.innerHeight * 0.85)));
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    cleanups.push(() => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    });

    return () => {
      tl.cancel();
      split?.revert();
      cleanups.forEach((c) => c());
    };
  }, []);

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
