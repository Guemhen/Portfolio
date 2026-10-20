import Link from "next/link";

export default function NotFound() {
  return (
    <section className="wrap notfound">
      <p className="eyebrow">404</p>
      <h1 className="section-title">This page doesn’t exist.</h1>
      <Link href="/" className="btn btn--primary">Back to the portfolio</Link>
    </section>
  );
}
