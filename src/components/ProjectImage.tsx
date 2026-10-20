import type { ProjectAsset } from "@/data/types";
import { resolveImage } from "@/lib/assets";
import { Frame } from "./Frame";
import { Placeholder } from "./Placeholder";

interface ProjectImageProps {
  asset?: ProjectAsset;
  /** Used for the placeholder when there is no asset at all. */
  fallbackLabel: string;
  sizes: string;
  priority?: boolean;
  accent?: string;
  aspect?: string;
  className?: string;
}

/** Renders a project asset, or a labelled placeholder if the file is missing. */
export function ProjectImage({ asset, fallbackLabel, sizes, priority, accent, aspect, className }: ProjectImageProps) {
  const image = resolveImage(asset?.src);
  if (!asset || !image) {
    return (
      <Placeholder
        label={fallbackLabel}
        kind={asset?.kind ?? "multi-screen"}
        expectedPath={asset?.src}
        accent={accent}
        aspect={aspect}
      />
    );
  }
  return (
    <Frame
      image={image}
      alt={asset.alt}
      sizes={sizes}
      crop={asset.crop}
      background={asset.background}
      priority={priority}
      aspect={asset.crop ? undefined : aspect}
      focus={asset.focus}
      className={className}
    />
  );
}
