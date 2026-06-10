/**
 * Sanity environment configuration.
 *
 * The site is designed to render fully from typed fallback content when Sanity
 * is not yet configured (no project id), so local dev and CI builds succeed
 * without credentials. Once `NEXT_PUBLIC_SANITY_PROJECT_ID` is set, content is
 * served live from Sanity.
 */
export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ??
  process.env.SANITY_PROJECT_ID ??
  "";

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ??
  process.env.SANITY_DATASET ??
  "production";

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-10-01";

/** True when a real Sanity project is wired up. */
export const isSanityConfigured = projectId.trim().length > 0;
