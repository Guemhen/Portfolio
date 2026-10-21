"use client";

import { useEffect, useRef } from "react";
import { animate, splitText, stagger } from "animejs";
import { prefersReducedMotion } from "./useMotion";

type HeadingTag = "h1" | "h2" | "h3" | "p" | "span";

/**
 * Heading whose characters rise out of a clipped line when it scrolls into
 * view (or immediately, with `immediate`). Screen readers get the plain text.
 */
export function SplitHeading({
  as: Tag = "h2",
  children,
  className,
  immediate = false,
  delay = 0,
  by = "chars",
  id,
}: {
  as?: HeadingTag;
  children: string;
  className?: string;
  immediate?: boolean;
  delay?: number;
  by?: "chars" | "words";
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.dataset.splitReady = "true";
      return;
    }
    const split = splitText(el, {
      words: { wrap: "clip" },
      chars: by === "chars",
      accessible: true,
    });
    el.dataset.splitReady = "true";
    const targets = by === "chars" ? split.chars : split.words;

    const run = () =>
      animate(targets, {
        y: { from: "110%", to: "0%" },
        rotate: { from: by === "chars" ? 8 : 0, to: 0 },
        duration: 1200,
        delay: stagger(by === "chars" ? 22 : 60, { start: delay }),
        ease: "outExpo",
      });

    if (immediate) {
      run();
      return () => {
        split.revert();
      };
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        run();
      },
      { rootMargin: "0px 0px -12% 0px" }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      split.revert();
    };
  }, [immediate, delay, by]);

  return (
    <Tag ref={ref as React.Ref<never>} id={id} data-split="" className={className}>
      {children}
    </Tag>
  );
}
