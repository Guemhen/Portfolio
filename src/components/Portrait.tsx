import { profile } from "@/data/profile";
import { resolveImage } from "@/lib/assets";
import { Frame } from "./Frame";

function initials(name: string) {
  const parts = name.split(/\s+/).filter(Boolean);
  return (parts[0][0] + (parts.at(-1)?.[0] ?? "")).toUpperCase();
}

/**
 * Editorial portrait for the hero. Uses the real photo from
 * `profile.photo.src`; if that is missing, shows a monogram card instead.
 */
export function Portrait() {
  const { photo, shortName, role } = profile;
  const image = resolveImage(photo.src);

  return (
    <figure className="portrait">
      <div className="portrait__stage">
        <div className="portrait__backdrop" aria-hidden="true" />
        <div className="portrait__window">
          {image ? (
            <Frame
              image={image}
              alt={photo.alt}
              sizes="(min-width: 960px) 40vw, 92vw"
              priority
              aspect="var(--portrait-ratio)"
              focus={photo.focus}
              className="portrait__img"
            />
          ) : (
            <div className="portrait__fallback" role="img" aria-label={`${shortName} (photo not yet added)`}>
              <span>{initials(shortName)}</span>
            </div>
          )}
        </div>
      </div>
      <figcaption className="portrait__caption">
        <span>{shortName}</span>
        <span>{role}</span>
      </figcaption>
    </figure>
  );
}
