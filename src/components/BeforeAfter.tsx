"use client";

import { useState } from "react";
import Image from "next/image";
import type { FrameImage } from "./Frame";

interface Side {
  image: FrameImage;
  alt: string;
}

/**
 * Drag (or use the arrow keys on) the handle to compare two versions of a
 * screen. Both images are shown at the "after" image's proportions, so supply
 * before/after exports at the same size.
 */
export function BeforeAfter({ before, after, caption }: { before: Side; after: Side; caption?: string }) {
  const [pos, setPos] = useState(50);
  return (
    <figure className="ba">
      <div className="ba__stage" style={{ aspectRatio: `${after.image.width} / ${after.image.height}` }}>
        <Image src={after.image.src} alt={after.alt} fill sizes="(min-width: 1100px) 1040px, 100vw" style={{ objectFit: "cover" }} />
        <div className="ba__before" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Image src={before.image.src} alt={before.alt} fill sizes="(min-width: 1100px) 1040px, 100vw" style={{ objectFit: "cover" }} />
        </div>
        <span className="ba__label ba__label--before">Before</span>
        <span className="ba__label ba__label--after">After</span>
        <div className="ba__handle" style={{ left: `${pos}%` }} aria-hidden="true" />
        <input
          className="ba__range"
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label="Compare before and after"
        />
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
