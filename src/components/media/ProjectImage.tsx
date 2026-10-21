import type { ProjectAsset } from "@/data/types";
import { resolveImage } from "@/lib/assets";
import { Frame } from "./Frame";
import { Placeholder } from "./Placeholder";

/** Renders a project asset, or a labelled placeholder if the file is missing. */
export function ProjectImage({
  asset,
  fallbackLabel,
  sizes,
  priority,
  accent,
  aspect,
  className,
  imgClassName,
}: {
  asset?: ProjectAsset;
  fallbackLabel: string;
  sizes: string;
  priority?: boolean;
  accent?: string;
  aspect?: string;
  className?: string;
  imgClassName?: string;
}) {
  const image = resolveImage(asset?.src);
  if (!asset || !image) {
    return (
      <Placeholder
        label={fallbackLabel}
        kind={asset?.kind ?? "multi-screen"}
        expectedPath={asset?.src}
        accent={accent}
        aspect={aspect}
        className={className}
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
      imgClassName={imgClassName}
    />
  );
}
