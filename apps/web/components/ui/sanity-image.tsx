import Image from "next/image";
import { resolveImageSrc, type SanityImageRef } from "@rw/sanity";

interface SanityImageProps {
  image: SanityImageRef;
  className?: string;
  sizes?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  alt?: string;
}

export function SanityImage({
  image,
  className,
  sizes,
  width,
  height,
  priority,
  alt,
}: SanityImageProps) {
  const src = resolveImageSrc(
    image,
    width && height ? { width, height } : undefined
  );
  const altText = alt ?? image.alt;

  if (width && height) {
    return (
      <Image
        src={src}
        alt={altText}
        width={width}
        height={height}
        className={className}
        sizes={sizes}
        priority={priority}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={altText}
      fill
      className={className}
      sizes={sizes}
      priority={priority}
    />
  );
}
