import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { site } from "@/data/site";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import "./globals.css";

const sans = Geist({ subsets: ["latin"], variable: "--font-geist" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

const title = `${site.firstName} ${site.lastName} · ${site.role}`;

export const metadata: Metadata = {
  // Vercel sets VERCEL_PROJECT_PRODUCTION_URL; SITE_URL overrides it for a custom domain.
  metadataBase: new URL(
    process.env.SITE_URL ??
      (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")
  ),
  title: { default: title, template: `%s · ${site.firstName} ${site.lastName}` },
  description: `${site.role}. ${site.statement}`,
  openGraph: {
    type: "website",
    title,
    description: site.statement,
    images: [{ url: site.portrait.original, width: 1440, height: 1440, alt: site.portrait.alt }],
  },
  twitter: { card: "summary_large_image", title, description: site.statement },
};

export const viewport: Viewport = { themeColor: "#0b0b0d", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>
        {/* Lets CSS hide not-yet-animated content only when JS can reveal it. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <a href="#main" className="sr-only z-[60] rounded-full bg-fg px-4 py-2 text-ink-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
          Skip to content
        </a>
        <Nav initials={`${site.firstName[0]}${site.lastName[0]}`} name={`${site.firstName} ${site.lastName}`} />
        <main id="main">{children}</main>
        <Footer name={site.name} />
      </body>
    </html>
  );
}
