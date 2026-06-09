import { client } from "./client";
import {
  aatContent,
  homeContent,
  privacyContent,
  siteSettings,
  termsContent,
} from "./content";
import { aatQuery, homeQuery, legalQuery, siteSettingsQuery } from "./queries";
import type {
  AatContent,
  HomeContent,
  LegalPage,
  SiteSettings,
} from "./types";

type LegalSlug = "privacy" | "terms";

const legalFallbacks: Record<LegalSlug, LegalPage> = {
  privacy: privacyContent,
  terms: termsContent,
};

/** True when a value is a non-empty object (a meaningful Sanity result). */
function hasContent(value: unknown): boolean {
  return (
    value !== null &&
    value !== undefined &&
    typeof value === "object" &&
    Object.keys(value as object).length > 0
  );
}

/**
 * Fetch a document, falling back to typed local content when Sanity is not
 * configured, the request fails, or the result is empty.
 */
async function fetchOrFallback<T>(
  query: string,
  fallback: T,
  params?: Record<string, unknown>,
): Promise<T> {
  if (!client) return fallback;
  try {
    const result = await client.fetch<T>(query, params ?? {});
    return hasContent(result) ? result : fallback;
  } catch {
    return fallback;
  }
}

export function getSiteSettings(): Promise<SiteSettings> {
  return fetchOrFallback(siteSettingsQuery, siteSettings);
}

export function getHome(): Promise<HomeContent> {
  return fetchOrFallback(homeQuery, homeContent);
}

export function getAat(): Promise<AatContent> {
  return fetchOrFallback(aatQuery, aatContent);
}

export function getLegal(slug: LegalSlug): Promise<LegalPage> {
  return fetchOrFallback(legalQuery, legalFallbacks[slug], { slug });
}
