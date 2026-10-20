import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { IBM_Plex_Mono, Instrument_Serif, Manrope } from "next/font/google";
import { profile } from "@/data/profile";
import "./globals.css";

const display = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-display" });
const sans = Manrope({ subsets: ["latin"], variable: "--font-sans" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

export const metadata: Metadata = {
  // Set SITE_URL in your hosting environment so social previews use absolute URLs.
  metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3000"),
  title: { default: `${profile.shortName} · ${profile.role}`, template: `%s · ${profile.shortName}` },
  description: profile.intro,
  openGraph: {
    title: `${profile.shortName} · ${profile.role}`,
    description: profile.intro,
    images: profile.photo.src ? [profile.photo.src] : undefined,
  },
};

export const viewport: Viewport = { themeColor: "#F3EEE4" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const year = new Date().getFullYear();
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        {/* Lets CSS hide not-yet-revealed content only when JS can reveal it again. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <a className="skip" href="#main">Skip to content</a>
        <header className="site-header">
          <div className="wrap site-header__inner">
            <Link href="/" className="wordmark">
              {profile.shortName}
              <span>{profile.role}</span>
            </Link>
            <nav aria-label="Main">
              <Link href="/#work">Work</Link>
              <Link href="/#about">About</Link>
              <a href={`mailto:${profile.email}`} className="nav-cta">Contact</a>
            </nav>
          </div>
        </header>
        <main id="main">{children}</main>
        <footer className="site-footer">
          <div className="wrap site-footer__inner">
            <span>© {year} {profile.name}</span>
            <span>All screens shown are my own work or clearly marked team and concept projects.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
