"use client";

export function Footer({ name }: { name: string }) {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-5 py-8 md:px-10">
        <p className="label">
          © {new Date().getFullYear()} {name}
        </p>
        <p className="label hidden lg:block">Real work, clearly labelled: redesigns, concepts and team projects are marked as such.</p>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}
          className="label inline-flex items-center gap-2 rounded-full border border-line px-3 py-2 transition-colors hover:border-fg hover:text-fg!"
        >
          Back to top <span aria-hidden="true">↑</span>
        </button>
      </div>
    </footer>
  );
}
