import type { Metadata } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://rewildingspeech.com";

export interface BuildMetadataOptions {
  title: string;
  description: string;
  /** Canonical path, e.g. "/aat". */
  path: string;
  /** Optional page-specific OG/Twitter image path. When omitted, the
   *  generated brand card (`app/opengraph-image.tsx`) applies. */
  image?: string;
}

/**
 * Build a Next.js `Metadata` object for a page, including canonical URL and
 * Open Graph / Twitter blocks. Every page (except the home page, which owns
 * its own absolute title) should build its metadata through this — pages
 * that skip it inherit NO canonical of their own.
 */
export function buildMetadata({
  title,
  description,
  path,
  image,
}: BuildMetadataOptions): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: `${siteUrl}${path}`,
      siteName: "Rewilding Speech Therapy",
      title,
      description,
      locale: "en_US",
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}
