import { createClient, type SanityClient } from "@sanity/client";
import { apiVersion, dataset, isSanityConfigured, projectId } from "./env";

/**
 * Read-only client for fetching published content. `null` when Sanity is not
 * configured — callers fall back to typed local content (see ./load.ts).
 */
export const client: SanityClient | null = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      perspective: "published",
    })
  : null;
