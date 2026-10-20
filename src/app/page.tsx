import Link from "next/link";
import { profile } from "@/data/profile";
import { flagship, projects } from "@/data/projects";
import { ContributionBadge } from "@/components/ContributionBadge";
import { Portrait } from "@/components/Portrait";
import { ProjectCard, RationaleBlock, hasVisuals } from "@/components/ProjectBlocks";
import { ProjectImage } from "@/components/ProjectImage";
import { Reveal } from "@/components/Reveal";

export default function Home() {
  const others = projects.filter((p) => p !== flagship);
  const shown = others.filter(hasVisuals);
  const upcoming = others.filter((p) => !hasVisuals(p));
  const sectors = Array.from(new Set(projects.map((p) => p.sector).filter((s) => s !== "Visual exploration")));
  const cut = profile.headline.lastIndexOf(", ");
  const headLead = cut > 0 ? profile.headline.slice(0, cut + 1) : profile.headline;
  const headTail = cut > 0 ? profile.headline.slice(cut + 2) : "";
  const facts = [{ value: String(projects.length), label: "Projects in this portfolio" }, ...profile.facts];

  return (
    <>
      {/* ───────── Hero ───────── */}
      <section className="hero">
        <div className="wrap hero__grid">
          <div className="hero__text">
            <p className="eyebrow hero__eyebrow">
              <span className="dot" aria-hidden="true" /> {profile.role} · Portfolio
            </p>
            <h1 className="hero__title">
              {/* The clause after the last comma is set in italic. */}
              <span className="hero__line">{headLead}</span>
              {headTail ? (
                <span className="hero__line">
                  <em>{headTail}</em>
                </span>
              ) : null}
            </h1>
            <p className="hero__intro">{profile.intro}</p>
            <div className="hero__ctas">
              <Link href={`/work/${flagship.slug}`} className="btn btn--primary">
                See the flagship case study
              </Link>
              <a href={`mailto:${profile.email}`} className="btn btn--ghost">
                {profile.email}
              </a>
            </div>
          </div>
          <div className="hero__portrait">
            <Portrait />
          </div>
          <dl className="facts">
            {facts.map((f) => (
              <div key={f.label} className="fact">
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="sectors" aria-label="Sectors I have designed for">
          <div className="wrap sectors__inner">
            {sectors.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Flagship ───────── */}
      <section className="flagship" id="work" style={{ ["--accent" as string]: flagship.accent, ["--on-accent" as string]: flagship.onAccent }}>
        <div className="wrap">
          <Reveal className="flagship__head">
            <p className="eyebrow eyebrow--on-dark">01 · Flagship project</p>
            <h2 className="flagship__title">{flagship.title}</h2>
            <div className="flagship__meta">
              <ContributionBadge value={flagship.contribution} />
              <span>{flagship.sector}</span>
              <span>{flagship.platforms.join(", ")}</span>
            </div>
            <p className="flagship__summary">{flagship.summary[0]}</p>
            <div className="flagship__links">
              <Link href={`/work/${flagship.slug}`} className="btn btn--accent">Read the case study</Link>
              {flagship.liveUrl ? (
                <a href={flagship.liveUrl} className="btn btn--ghost-dark" target="_blank" rel="noreferrer">
                  Visit the live site ↗
                </a>
              ) : null}
            </div>
          </Reveal>
          <Reveal className="flagship__rationale" delay={120}>
            {flagship.rationale ? (
              <RationaleBlock project={flagship} tone="dark" />
            ) : (
              <ProjectImage asset={flagship.cover} fallbackLabel={flagship.title} sizes="(min-width: 1200px) 1140px, 100vw" accent={flagship.accent} />
            )}
          </Reveal>
        </div>
      </section>

      {/* ───────── Selected work ───────── */}
      <section className="work">
        <div className="wrap">
          <Reveal className="section-head">
            <p className="eyebrow">02 · Selected work</p>
            <h2 className="section-title">More products I have designed and contributed to</h2>
          </Reveal>
          <div className="work__grid">
            {shown.map((p, i) => (
              <Reveal key={p.slug} delay={i * 80} className={`work__cell work__cell--${p.cover?.kind ?? "multi-screen"}`}>
                <ProjectCard
                  project={p}
                  aspect={p.cover?.kind === "mobile" ? "4 / 5" : undefined}
                  sizes={p.cover?.kind === "mobile" ? "(min-width: 900px) 34vw, 100vw" : "(min-width: 900px) 58vw, 100vw"}
                />
              </Reveal>
            ))}
          </div>

          {upcoming.length ? (
            <>
              <Reveal className="section-head section-head--small">
                <p className="eyebrow">Case studies in preparation</p>
                <p className="section-sub">These projects are on my CV. Their screens are being prepared for publication, so they appear here as clearly marked placeholders.</p>
              </Reveal>
              <div className="work__upcoming">
                {upcoming.map((p, i) => (
                  <Reveal key={p.slug} delay={i * 60}>
                    <ProjectCard project={p} />
                  </Reveal>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </section>

      {/* ───────── About ───────── */}
      <section className="about" id="about">
        <div className="wrap about__grid">
          <Reveal className="about__intro">
            <p className="eyebrow">03 · About</p>
            <h2 className="section-title">Designer, Computer Science graduate, former pro competitor.</h2>
            {profile.about.map((p) => (
              <p key={p} className="about__p">{p}</p>
            ))}
          </Reveal>
          <Reveal className="about__side" delay={100}>
            {profile.experience.map((e) => (
              <div key={e.title} className="xp">
                <h3>
                  {e.title}
                  {e.org ? <span> · {e.org}</span> : null}
                </h3>
                <ul>
                  {e.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="xp">
              <h3>Education</h3>
              <p>
                {profile.education.degree}
                <br />
                <span className="muted">{profile.education.school}</span>
              </p>
            </div>
            <ul className="skills" aria-label="Skills">
              {profile.skills.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ───────── Contact ───────── */}
      <section className="contact" id="contact">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow eyebrow--on-dark">04 · Contact</p>
            <h2 className="contact__title">
              Have a product that should feel <em>simpler</em>? Let’s talk.
            </h2>
            <a className="contact__mail" href={`mailto:${profile.email}`}>
              {profile.email} <span aria-hidden="true">↗</span>
            </a>
            {profile.links.some((l) => l.href) ? (
              <div className="contact__links">
                {profile.links
                  .filter((l) => l.href)
                  .map((l) => (
                    <a key={l.label} href={l.href} target="_blank" rel="noreferrer">
                      {l.label}
                    </a>
                  ))}
              </div>
            ) : null}
          </Reveal>
        </div>
      </section>
    </>
  );
}
