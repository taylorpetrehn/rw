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
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      url: siteUrl,
      siteName: `${s.brandName} ${s.brandSubtitle}`,
      title: seo.title,
      description: seo.description,
      locale: "en_US",
      images: [{ url: "/images/kailey.jpg", width: 1333, height: 2000, alt: "Kailey Petrehn, Speech-Language Pathologist" }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: ["/images/kailey.jpg"],
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
        <SiteNav settings={settings} />
        <main className="pt-16 sm:pt-20 md:pt-24 min-h-screen">{children}</main>
        <SiteFooter settings={settings} />
      </body>
    </html>
  );
}
