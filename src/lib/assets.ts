import "server-only";
import fs from "node:fs";
import path from "node:path";
import { imageSize } from "image-size";

export interface ResolvedImage {
  src: string;
  width: number;
  height: number;
}

const cache = new Map<string, ResolvedImage | null>();

/**
 * Looks up an image under /public at build/render time.
 * Returns null when the file is missing, so callers can render a labelled
 * placeholder instead of a broken image. Width and height are read from the
 * file itself, so replacing a screenshot never needs a code change.
 */
export function resolveImage(src: string | null | undefined): ResolvedImage | null {
  if (!src) return null;
  if (cache.has(src)) return cache.get(src)!;

  const file = path.join(process.cwd(), "public", src.replace(/^\/+/, ""));
  let result: ResolvedImage | null = null;
  try {
    const { width, height } = imageSize(fs.readFileSync(file));
    if (width && height) result = { src, width, height };
  } catch {
    result = null;
  }
  cache.set(src, result);
  return result;
}
