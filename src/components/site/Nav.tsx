"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";
import { prefersReducedMotion } from "../motion/useMotion";

const LINKS = [
  { id: "work", label: "Work" },
  { id: "rationale", label: "Rationale" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export function Nav({ initials, name }: { initials: string; name: string }) {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the section currently in view (home page only).
  useEffect(() => {
    if (!onHome) return setActive(null);
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [onHome]);

  // Mobile menu: lock scroll, animate links in, close on Escape.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const p = panel.current;
    if (p && !prefersReducedMotion()) {
      animate(p.querySelectorAll("[data-menu-item]"), {
        y: { from: 40, to: 0 },
        opacity: { from: 0, to: 1 },
        delay: stagger(60, { start: 80 }),
        duration: 800,
        ease: "outExpo",
      });
    }
    p?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      toggle.current?.focus();
    };
  }, [open]);

  const href = (id: string) => (onHome ? `#${id}` : `/#${id}`);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background,border-color,backdrop-filter] duration-500 ${
          scrolled || open ? "border-b border-line bg-ink-900/75 backdrop-blur-xl" : "border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 md:px-10">
          <Link href="/" className="group flex items-center gap-3" aria-label={`${name}, home`}>
            <span className="grid h-8 w-8 place-items-center rounded-full border border-line-strong font-mono text-[11px] tracking-wider transition-colors group-hover:border-accent group-hover:text-accent">
              {initials}
            </span>
            <span className="hidden text-sm font-medium tracking-tight sm:inline">{name}</span>
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => (
              <a
                key={l.id}
                href={href(l.id)}
                aria-current={active === l.id ? "true" : undefined}
                className="group relative rounded-full px-4 py-2 font-mono text-[11.5px] uppercase tracking-[0.14em] text-fg-muted transition-colors hover:text-fg aria-[current]:text-fg"
              >
                <span className={`absolute left-1.5 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-accent transition-opacity ${active === l.id ? "opacity-100" : "opacity-0"}`} aria-hidden="true" />
                {l.label}
              </a>
            ))}
          </nav>

          <button
            ref={toggle}
            type="button"
            className="relative grid h-10 w-10 place-items-center rounded-full border border-line-strong md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            <span className={`absolute h-px w-4 bg-fg transition-transform duration-300 ${open ? "rotate-45" : "-translate-y-[3px]"}`} />
            <span className={`absolute h-px w-4 bg-fg transition-transform duration-300 ${open ? "-rotate-45" : "translate-y-[3px]"}`} />
          </button>
        </div>
      </header>

      {/* Rendered outside <header>: its backdrop-filter would otherwise trap this fixed panel. */}
      {open ? (
        <div ref={panel} id="mobile-menu" className="fixed inset-x-0 bottom-0 top-16 z-40 flex flex-col justify-between bg-ink-900 px-5 pb-10 pt-8 md:hidden">
          <nav aria-label="Mobile" className="grid gap-2">
            {LINKS.map((l, i) => (
              <a key={l.id} data-menu-item href={href(l.id)} onClick={() => setOpen(false)} className="flex items-baseline gap-4 border-b border-line py-4 text-4xl font-medium tracking-tight">
                <span className="font-mono text-xs text-accent">0{i + 1}</span>
                {l.label}
              </a>
            ))}
          </nav>
          <p data-menu-item className="label">Product design portfolio</p>
        </div>
      ) : null}
    </>
  );
}
