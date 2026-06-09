import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { dataset, isSanityConfigured, projectId } from "./env";
import type { SanityImageRef } from "./types";

const builder = isSanityConfigured
  ? imageUrlBuilder({ projectId, dataset })
  : null;

/** URL builder for a Sanity image source. Returns null if Sanity is off. */
export function urlForImage(source: SanityImageSource) {
  return builder ? builder.image(source) : null;
}

/**
 * Resolve an image reference to a usable `src`, preferring the Sanity asset
 * (CDN-optimized) and falling back to the bundled local path. This lets the
 * site render identically with or without Sanity configured.
 */
export function resolveImageSrc(
  image: SanityImageRef,
  opts?: { width?: number; height?: number; quality?: number },
): string {
  if (image.asset && builder) {
    let url = builder.image(image.asset as SanityImageSource).auto("format").fit("max");
    if (opts?.width) url = url.width(opts.width);
    if (opts?.height) url = url.height(opts.height);
    if (opts?.quality) url = url.quality(opts.quality);
    return url.url();
  }
  return image.src ?? "";
}
