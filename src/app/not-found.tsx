import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto grid min-h-[70svh] max-w-[1440px] content-center gap-6 px-5 pt-24 md:px-10">
      <p className="label">404</p>
      <h1 className="text-[clamp(2.6rem,8vw,6rem)] font-semibold leading-[0.9] tracking-[-0.05em]">This page doesn’t exist.</h1>
      <Link href="/" className="inline-flex h-12 w-fit items-center rounded-full bg-fg px-6 text-sm font-medium text-ink-950 hover:bg-accent">
        Back to the portfolio
      </Link>
    </section>
  );
}
