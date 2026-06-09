import type { Metadata } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://rewildingspeech.com";

const defaultImage = "/images/kailey.jpg";

export interface BuildMetadataOptions {
  title: string;
  description: string;
  /** Canonical path, e.g. "/aat". */
  path: string;
  /** Optional OG/Twitter image path; falls back to the brand portrait. */
  image?: string;
}

/**
 * Build a Next.js `Metadata` object for a page, including canonical URL and
 * Open Graph / Twitter blocks. Reusable across all marketing pages.
 */
export function buildMetadata({
  title,
  description,
  path,
  image,
}: BuildMetadataOptions): Metadata {
  const ogImage = image ?? defaultImage;

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
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
