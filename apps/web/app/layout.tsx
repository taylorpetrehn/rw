import type { Metadata, Viewport } from "next";
import "./globals.css";
import { birdie } from "./fonts";
import { getSiteSettings } from "@rw/sanity";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rewildingspeech.com";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings();
  const seo = s.defaultSeo;
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: seo.title,
      template: `%s | ${s.brandName} ${s.brandSubtitle}`,
    },
    description: seo.description,
    keywords: seo.keywords,
    // NOTE: no `alternates.canonical` here — a canonical set in the root
    // layout is inherited by every page that doesn't override it, silently
    // canonicalizing /aat, /contact, etc. to "/". Each page sets its own
    // (lib/seo.ts#buildMetadata). OG/Twitter images come from the generated
    // app/opengraph-image.tsx (1200×630), not a hardcoded portrait.
    openGraph: {
      type: "website",
      url: siteUrl,
      siteName: `${s.brandName} ${s.brandSubtitle}`,
      title: seo.title,
      description: seo.description,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
    },
    icons: {
      icon: [
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/favicon.png", type: "image/png" },
      ],
      apple: "/favicon.png",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#2E4B3C",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings();

  return (
    <html lang="en" className={birdie.variable}>
      <head>
        {/* Adobe Typekit — degular-variable (sans). Kit is domain-allowlisted. */}
        <link rel="stylesheet" href="https://use.typekit.net/otn8yfj.css" />
        {/* Scroll-reveal content must not stay hidden when JS is off. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1 !important;transform:none !important;}`}</style>
        </noscript>
      </head>
      <body className="bg-warm-gray font-body text-neutral-900 antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-warm-gray focus:px-5 focus:py-2.5 focus:rounded-full focus:text-sm font-sans"
        >
          Skip to content
        </a>
        <SiteNav settings={settings} />
        <main id="main" className="pt-16 sm:pt-20 md:pt-24 min-h-screen">{children}</main>
        <SiteFooter settings={settings} />
      </body>
    </html>
  );
}
