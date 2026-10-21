"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "animejs";
import type { ProjectAsset } from "@/data/types";
import { Frame, type FrameImage } from "./Frame";
import { Placeholder } from "./Placeholder";
import { prefersReducedMotion } from "../motion/useMotion";

export interface GalleryItem {
  asset: ProjectAsset;
  image: FrameImage | null;
}

/**
 * Screens laid out by kind so a set reads as a sequence (phones side by side,
 * desktop shots and close-ups wider). Click any real image to view it larger;
 * arrow keys step through, Esc closes.
 */
export function Gallery({ items, accent }: { items: GalleryItem[]; accent?: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const viewable = items.map((it, i) => ({ ...it, i })).filter((it) => it.image);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open !== null && !d.open) d.showModal();
    if (open === null && d.open) d.close();
    if (open !== null && stage.current && !prefersReducedMotion()) {
      animate(stage.current, { opacity: { from: 0, to: 1 }, scale: { from: 0.96, to: 1 }, duration: 600, ease: "outExpo" });
    }
  }, [open]);

  const step = (dir: 1 | -1) => {
    if (open === null) return;
    const pos = viewable.findIndex((v) => v.i === open);
    setOpen(viewable[(pos + dir + viewable.length) % viewable.length].i);
  };

  const current = open !== null ? items[open] : null;
  const ratio = current?.image
    ? current.asset.crop
      ? (current.asset.crop.w * current.image.width) / (current.asset.crop.h * current.image.height)
      : current.image.width / current.image.height
    : 1;

  return (
    <>
      <div className="flex flex-wrap items-start justify-center gap-6 md:gap-8">
        {items.map(({ asset, image }, i) => (
          <figure
            key={i}
            className={`m-0 grid gap-3 ${asset.kind === "mobile" ? "w-full max-w-[340px] flex-[0_1_340px]" : "w-full flex-[1_1_420px]"} ${items.length === 1 && asset.kind === "detail" ? "max-w-[680px]" : ""}`}
          >
            {image ? (
              <button
                type="button"
                onClick={() => setOpen(i)}
                className="group block w-full cursor-zoom-in overflow-hidden rounded-2xl border border-line"
                aria-label={`View larger: ${asset.caption ?? asset.alt}`}
              >
                <Frame image={image} alt={asset.alt} crop={asset.crop} background={asset.background} imgClassName="group-hover:scale-[1.03]" sizes={asset.kind === "mobile" ? "(min-width: 768px) 340px, 90vw" : "(min-width: 1024px) 50vw, 100vw"} />
              </button>
            ) : (
              <Placeholder label={asset.caption ?? asset.alt} kind={asset.kind} expectedPath={asset.src} accent={accent} />
            )}
            {asset.caption ? <figcaption className="text-sm text-fg-muted">{asset.caption}</figcaption> : null}
          </figure>
        ))}
      </div>

      <dialog
        ref={dialog}
        onClose={() => setOpen(null)}
        onClick={(e) => e.target === e.currentTarget && setOpen(null)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        aria-label={current?.asset.caption ?? "Image viewer"}
        className="m-0 h-full max-h-none w-full max-w-none bg-ink-950/90 p-4 text-fg backdrop:bg-transparent open:grid open:place-items-center"
      >
        {current?.image ? (
          <div ref={stage} className="grid w-full max-w-6xl gap-3">
            <div className="mx-auto w-full overflow-hidden rounded-xl" style={{ maxWidth: `min(100%, calc(82vh * ${ratio.toFixed(3)}))` }}>
              <Frame image={current.image} alt={current.asset.alt} crop={current.asset.crop} background={current.asset.background} sizes="90vw" />
            </div>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-fg-muted">{current.asset.caption}</span>
              <span className="flex gap-2">
                {viewable.length > 1 ? (
                  <>
                    <button type="button" onClick={() => step(-1)} aria-label="Previous image" className="h-11 min-w-11 rounded-full border border-line-strong px-4 hover:border-fg">←</button>
                    <button type="button" onClick={() => step(1)} aria-label="Next image" className="h-11 min-w-11 rounded-full border border-line-strong px-4 hover:border-fg">→</button>
                  </>
                ) : null}
                <button type="button" onClick={() => setOpen(null)} className="h-11 rounded-full border border-line-strong px-4 hover:border-fg">Close</button>
              </span>
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
