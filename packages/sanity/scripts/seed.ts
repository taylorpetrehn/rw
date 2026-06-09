/**
 * Seed the Sanity dataset from the typed local content in `src/content.ts`.
 *
 * Usage:
 *   SANITY_API_TOKEN=<write-token> pnpm --filter @rw/sanity seed
 *
 * Idempotent: uploads the five local images as image assets, then
 * createOrReplace()s the five documents with fixed _ids, replacing every
 * { src, alt } image reference with a Sanity image reference.
 */
import { createReadStream } from "node:fs";
import { basename, resolve } from "node:path";

import { createClient } from "@sanity/client";
import {
  aatContent,
  dataset,
  homeContent,
  privacyContent,
  projectId,
  siteSettings,
  termsContent,
} from "@rw/sanity";
import type { SanityImageRef } from "@rw/sanity";

const token = process.env.SANITY_API_TOKEN ?? "";

if (!projectId || !token) {
  console.error(
    [
      "Cannot seed: missing configuration.",
      !projectId
        ? "  • Set NEXT_PUBLIC_SANITY_PROJECT_ID (or SANITY_PROJECT_ID)."
        : null,
      !token ? "  • Set SANITY_API_TOKEN to a write token." : null,
      "",
      "Example:",
      "  NEXT_PUBLIC_SANITY_PROJECT_ID=abc123 SANITY_API_TOKEN=sk... pnpm --filter @rw/sanity seed",
    ]
      .filter(Boolean)
      .join("\n"),
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-10-01",
  token,
  useCdn: false,
});

const IMAGES_DIR = resolve(
  import.meta.dirname,
  "../../../apps/web/public/images",
);

/** Map of local /images/* src -> uploaded Sanity asset _id. */
const assetIdBySrc = new Map<string, string>();

async function uploadImage(src: string): Promise<string> {
  const existing = assetIdBySrc.get(src);
  if (existing) return existing;

  const filename = basename(src);
  const path = resolve(IMAGES_DIR, filename);
  console.log(`Uploading image: ${filename}`);
  const asset = await client.assets.upload("image", createReadStream(path), {
    filename,
  });
  assetIdBySrc.set(src, asset._id);
  return asset._id;
}

interface SanityImageValue {
  _type: "image";
  asset: { _type: "reference"; _ref: string };
  alt: string;
}

async function toSanityImage(ref: SanityImageRef): Promise<SanityImageValue> {
  if (!ref.src) {
    throw new Error(`Image ref has no local src (alt: "${ref.alt}")`);
  }
  const assetId = await uploadImage(ref.src);
  return {
    _type: "image",
    asset: { _type: "reference", _ref: assetId },
    alt: ref.alt,
  };
}

async function main() {
  console.log(`Seeding Sanity project "${projectId}" dataset "${dataset}"...`);

  // ---- Upload all five images up front (deduped by src) ----------------
  const heroPortrait = await toSanityImage(homeContent.hero.portrait);
  const teamPortrait = await toSanityImage(homeContent.team.portrait);
  const aatPhoto = await toSanityImage(aatContent.photo);

  const cards = await Promise.all(
    homeContent.approach.cards.map(async (card) => ({
      _type: "approachCard" as const,
      ...card,
      image: card.image ? await toSanityImage(card.image) : undefined,
    })),
  );

  // ---- Build documents with fixed _ids --------------------------------
  const siteSettingsDoc = {
    _id: "siteSettings",
    _type: "siteSettings",
    ...siteSettings,
  };

  const homeDoc = {
    _id: "home",
    _type: "home",
    ...homeContent,
    hero: { ...homeContent.hero, portrait: heroPortrait },
    approach: { ...homeContent.approach, cards },
    team: { ...homeContent.team, portrait: teamPortrait },
  };

  const aatDoc = {
    _id: "aat",
    _type: "aat",
    ...aatContent,
    photo: aatPhoto,
  };

  const privacyDoc = {
    _id: "legal.privacy",
    _type: "legalPage",
    title: privacyContent.title,
    slug: { _type: "slug", current: "privacy" },
    body: privacyContent.body,
    seo: privacyContent.seo,
  };

  const termsDoc = {
    _id: "legal.terms",
    _type: "legalPage",
    title: termsContent.title,
    slug: { _type: "slug", current: "terms" },
    body: termsContent.body,
    seo: termsContent.seo,
  };

  const documents: Array<{ _id: string; _type: string; [key: string]: unknown }> =
    [siteSettingsDoc, homeDoc, aatDoc, privacyDoc, termsDoc];

  for (const doc of documents) {
    console.log(`Writing document: ${doc._id} (${doc._type})`);
    await client.createOrReplace(doc);
  }

  console.log("Seed complete.");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
