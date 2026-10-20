"use client";

import { useEffect, useRef, useState } from "react";
import type { ProjectAsset } from "@/data/types";
import { Frame, type FrameImage } from "./Frame";
import { Placeholder } from "./Placeholder";

export interface GalleryItem {
  asset: ProjectAsset;
  image: FrameImage | null;
}

/**
 * Additional screens, laid out by kind so a set of screenshots reads as a
 * sequence (phones side by side, desktop and close-ups wider) rather than a
 * stack. Click any real image to view it larger.
 */
export function Gallery({ items, accent }: { items: GalleryItem[]; accent?: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const viewable = items.map((it, i) => ({ ...it, i })).filter((it) => it.image);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open !== null && !d.open) d.showModal();
    if (open === null && d.open) d.close();
  }, [open]);

  const step = (dir: 1 | -1) => {
    if (open === null) return;
    const pos = viewable.findIndex((v) => v.i === open);
    const next = viewable[(pos + dir + viewable.length) % viewable.length];
    setOpen(next.i);
  };

  const current = open !== null ? items[open] : null;

  return (
    <>
      <div className="gallery">
        {items.map(({ asset, image }, i) => (
          <figure key={i} className={`gallery__item gallery__item--${asset.kind}`}>
            {image ? (
              <button type="button" className="gallery__open" onClick={() => setOpen(i)} aria-label={`View larger: ${asset.caption ?? asset.alt}`}>
                <Frame
                  image={image}
                  alt={asset.alt}
                  crop={asset.crop}
                  background={asset.background}
                  sizes={asset.kind === "mobile" ? "(min-width: 900px) 30vw, 90vw" : "(min-width: 900px) 60vw, 100vw"}
                />
              </button>
            ) : (
              <Placeholder label={asset.caption ?? asset.alt} kind={asset.kind} expectedPath={asset.src} accent={accent} />
            )}
            {asset.caption ? <figcaption>{asset.caption}</figcaption> : null}
          </figure>
        ))}
      </div>

      <dialog
        ref={dialog}
        className="lightbox"
        onClose={() => setOpen(null)}
        onClick={(e) => e.target === e.currentTarget && setOpen(null)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        aria-label={current?.asset.caption ?? "Image viewer"}
      >
        {current?.image ? (
          <div className={`lightbox__inner lightbox__inner--${current.asset.kind}`}>
            <Frame
              image={current.image}
              alt={current.asset.alt}
              crop={current.asset.crop}
              background={current.asset.background}
              sizes="90vw"
            />
            <div className="lightbox__bar">
              <span>{current.asset.caption}</span>
              <span className="lightbox__controls">
                {viewable.length > 1 ? (
                  <>
                    <button type="button" onClick={() => step(-1)} aria-label="Previous image">←</button>
                    <button type="button" onClick={() => step(1)} aria-label="Next image">→</button>
                  </>
                ) : null}
                <button type="button" onClick={() => setOpen(null)} aria-label="Close">Close</button>
              </span>
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
