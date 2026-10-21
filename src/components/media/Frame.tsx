import Image from "next/image";
import type { Crop } from "@/data/types";

export interface FrameImage {
  src: string;
  width: number;
  height: number;
}

interface FrameProps {
  image: FrameImage;
  alt: string;
  /** Responsive `sizes` for the visible frame. Scaled automatically for crops. */
  sizes: string;
  crop?: Crop;
  background?: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  /** Force an aspect ratio and cover-fit the image inside it. */
  aspect?: string;
  focus?: { x: number; y: number };
}

/** Multiplies the length in each `sizes` entry, e.g. "50vw" × 2 → "100vw". */
function scaleSizes(sizes: string, factor: number) {
  return sizes
    .split(",")
    .map((entry) => {
      const parts = entry.trim().split(/\s+/);
      const last = parts.pop()!;
      const m = last.match(/^(\d+(?:\.\d+)?)(vw|px)$/);
      if (!m) return entry.trim();
      return [...parts, `${Math.ceil(parseFloat(m[1]) * factor)}${m[2]}`].join(" ");
    })
    .join(", ");
}

/**
 * Displays a real asset. With `crop`, only that rectangle of the source is
 * visible: the file is untouched, the frame just looks through a window.
 */
export function Frame({ image, alt, sizes, crop, background, priority, className = "", imgClassName = "", aspect, focus }: FrameProps) {
  const base = `relative overflow-hidden ${className}`;
  const img = `transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] ${imgClassName}`;

  if (crop) {
    const ratio = `${(crop.w * image.width).toFixed(0)} / ${(crop.h * image.height).toFixed(0)}`;
    return (
      <div className={base} style={{ background, aspectRatio: ratio }}>
        <Image
          src={image.src}
          alt={alt}
          width={image.width}
          height={image.height}
          sizes={scaleSizes(sizes, 100 / crop.w)}
          priority={priority}
          quality={90}
          className={img}
          style={{
            position: "absolute",
            maxWidth: "none",
            width: `${(100 / crop.w) * 100}%`,
            height: "auto",
            left: `${(-crop.x / crop.w) * 100}%`,
            top: `${(-crop.y / crop.h) * 100}%`,
          }}
        />
      </div>
    );
  }

  if (aspect) {
    return (
      <div className={base} style={{ background, aspectRatio: aspect }}>
        <Image
          src={image.src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          quality={85}
          className={img}
          style={{ objectFit: "cover", objectPosition: focus ? `${focus.x}% ${focus.y}%` : "center" }}
        />
      </div>
    );
  }

  return (
    <div className={base} style={{ background }}>
      <Image
        src={image.src}
        alt={alt}
        width={image.width}
        height={image.height}
        sizes={sizes}
        priority={priority}
        quality={85}
        className={`block h-auto w-full ${img}`}
      />
    </div>
  );
}
