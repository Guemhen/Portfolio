"use client";

import { useId, useState } from "react";
import type { Annotation, Crop } from "@/data/types";
import { Frame, type FrameImage } from "./Frame";

interface AnnotatedShotProps {
  image: FrameImage;
  alt: string;
  crop?: Crop;
  background?: string;
  notes: Annotation[];
  title?: string;
  tone?: "light" | "dark";
  /** "side" puts notes beside the image; "stacked" puts them underneath (better for wide desktop UIs). */
  layout?: "side" | "stacked";
}

/**
 * "Why I designed it this way": numbered pins on a real screenshot, each
 * linked to a short note. Hovering or focusing either side highlights both.
 */
export function AnnotatedShot({ image, alt, crop, background, notes, title, tone = "light", layout = "side" }: AnnotatedShotProps) {
  const [active, setActive] = useState<number | null>(null);
  const id = useId();

  return (
    <div className={`annotated annotated--${tone} annotated--${layout}`} data-active={active !== null ? "true" : undefined}>
      <div className="annotated__media">
        <Frame
          image={image}
          alt={alt}
          crop={crop}
          background={background}
          sizes={layout === "stacked" ? "(min-width: 1280px) 1200px, 100vw" : "(min-width: 1100px) 760px, (min-width: 900px) 62vw, 100vw"}
        />
        {notes.map((n, i) => (
          <button
            key={i}
            type="button"
            className="pin"
            style={{ left: `${n.x}%`, top: `${n.y}%` }}
            aria-describedby={`${id}-note-${i}`}
            aria-pressed={active === i}
            data-on={active === i ? "true" : undefined}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(i)}
            onBlur={() => setActive(null)}
            onClick={() => {
              setActive(i);
              document.getElementById(`${id}-note-${i}`)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
            }}
          >
            <span className="sr-only">Note {i + 1}: </span>
            {i + 1}
          </button>
        ))}
      </div>
      <div className="annotated__notes">
        {title ? <p className="eyebrow">{title}</p> : null}
        <ol>
          {notes.map((n, i) => (
            <li
              key={i}
              id={`${id}-note-${i}`}
              data-on={active === i ? "true" : undefined}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
            >
              <span className="annotated__num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h4>{n.title}</h4>
                <p>{n.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
