"use client";

import { useState } from "react";
import Image from "next/image";
import type { FrameImage } from "./Frame";

interface Side {
  image: FrameImage;
  alt: string;
}

/**
 * Drag (or use arrow keys on) the handle to compare two versions of a screen.
 * Export before/after at the same size; the stage uses the "after" proportions.
 */
export function BeforeAfter({ before, after, caption }: { before: Side; after: Side; caption?: string }) {
  const [pos, setPos] = useState(50);
  return (
    <figure className="m-0 grid gap-3">
      <div className="relative overflow-hidden rounded-2xl border border-line bg-ink-850" style={{ aspectRatio: `${after.image.width} / ${after.image.height}` }}>
        <Image src={after.image.src} alt={after.alt} fill sizes="(min-width: 1280px) 1200px, 100vw" className="object-cover" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Image src={before.image.src} alt={before.alt} fill sizes="(min-width: 1280px) 1200px, 100vw" className="object-cover" />
        </div>
        <span className="label pointer-events-none absolute left-3 top-3 rounded-md bg-ink-950/80 px-2 py-1 text-fg!">Before</span>
        <span className="label pointer-events-none absolute right-3 top-3 rounded-md bg-ink-950/80 px-2 py-1 text-fg!">After</span>
        <div className="pointer-events-none absolute inset-y-0 w-px bg-fg" style={{ left: `${pos}%` }} aria-hidden="true">
          <span className="absolute left-1/2 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-fg text-ink-950">⇆</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label="Compare before and after"
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
      {caption ? <figcaption className="text-sm text-fg-muted">{caption}</figcaption> : null}
    </figure>
  );
}
