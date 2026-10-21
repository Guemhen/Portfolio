"""
Make a transparent cutout of a portrait for the hero.

    python3 -m venv .venv && .venv/bin/pip install "rembg[cpu]" pillow numpy scipy
    .venv/bin/python scripts/remove-background.py photo.jpg public/images/profile/joshua-idogun-cutout.png

1. Segments the person with the BiRefNet portrait model (downloaded on first run, ~1 GB).
2. Removes colour spill from the old background on semi-transparent edge pixels,
   so there is no halo when the cutout sits on a dark page.
3. Trims empty space around the subject (keeps the bottom edge) and saves a PNG
   with a real alpha channel.
"""
import sys

import numpy as np
from PIL import Image
from rembg import new_session, remove
from scipy import ndimage


def main(src: str, out: str) -> None:
    image = Image.open(src).convert("RGB")
    mask = remove(image, session=new_session("birefnet-portrait"), only_mask=True)

    C = np.asarray(image).astype(np.float32) / 255
    a = np.asarray(mask.convert("L")).astype(np.float32) / 255

    # Estimate the background colour behind every pixel from nearby pure-background pixels.
    bg = (a < 0.02).astype(np.float32)
    weight = ndimage.gaussian_filter(bg, 25) + 1e-6
    B = np.stack([ndimage.gaussian_filter(C[..., c] * bg, 25) / weight for c in range(3)], axis=-1)

    # Edge decontamination: F = (C - (1 - a) * B) / a on partially transparent pixels.
    A = a[..., None]
    F = np.clip((C - (1 - A) * B) / np.maximum(A, 0.02), 0, 1)
    edge = ((a > 0.02) & (a < 0.98))[..., None]
    F = np.where(edge, F, C)

    rgba = Image.fromarray((np.dstack([F, a]) * 255).round().astype(np.uint8), "RGBA")
    ys, xs = np.where(np.asarray(rgba)[..., 3] > 8)
    m = 12
    rgba = rgba.crop((max(0, xs.min() - m), max(0, ys.min() - m), min(rgba.width, xs.max() + m + 1), rgba.height))
    rgba.save(out, optimize=True)
    print(f"saved {out} {rgba.size}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit("usage: remove-background.py <input photo> <output.png>")
    main(sys.argv[1], sys.argv[2])
