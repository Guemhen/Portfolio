"use client";

import { useState } from "react";

/** Email link plus a working copy-to-clipboard button. */
export function ContactActions({ email, links }: { email: string; links: { label: string; href: string }[] }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };
  const visible = links.filter((l) => l.href);

  return (
    <div className="grid gap-8">
      <a href={`mailto:${email}`} className="group inline-flex w-fit max-w-full items-center gap-4 text-[clamp(1.4rem,4.4vw,3.4rem)] font-medium tracking-[-0.03em]">
        <span className="break-all border-b-2 border-accent/70 pb-1 transition-colors group-hover:border-fg sm:break-normal">{email}</span>
        <span aria-hidden="true" className="text-accent transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1">↗</span>
      </a>
      <div className="flex flex-wrap items-center gap-3">
        <a href={`mailto:${email}`} className="inline-flex h-12 items-center rounded-full bg-fg px-6 text-sm font-medium text-ink-950 transition-colors hover:bg-accent">
          Send an email
        </a>
        <button type="button" onClick={copy} className="inline-flex h-12 items-center gap-2 rounded-full border border-line-strong px-5 text-sm transition-colors hover:border-fg">
          {copied ? "Copied ✓" : "Copy address"}
        </button>
        <span aria-live="polite" className="sr-only">
          {copied ? "Email address copied" : ""}
        </span>
        {visible.map((l) => (
          <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center px-3 text-sm text-fg-muted underline-offset-4 hover:text-fg hover:underline">
            {l.label} ↗
          </a>
        ))}
      </div>
    </div>
  );
}
