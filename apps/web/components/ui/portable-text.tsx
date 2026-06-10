import {
  PortableText,
  type PortableTextComponents,
} from "@portabletext/react";
import type { RichText } from "@rw/sanity";
import { CheckIcon } from "@/components/ui/check-icon";

type BulletAccent = "primary" | "secondary";

function buildComponents(bulletAccent: BulletAccent): PortableTextComponents {
  // Icons are decorative, so the brand orange (`secondary`) is fine here —
  // small TEXT in orange must use `secondary-ink` instead (see globals.css).
  const iconColor =
    bulletAccent === "secondary" ? "text-secondary" : "text-primary";

  return {
    marks: {
      // Explicit font-semibold so bold text reads as bold even inside
      // font-light containers (the browser's default <strong> resolves
      // "bolder" relative to a light parent, which looks nearly normal).
      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
      em: ({ children }) => <em>{children}</em>,
    },
    block: {
      normal: ({ children }) => <p>{children}</p>,
    },
    list: {
      // Tailwind preflight removes default markers; we render our own check icons.
      bullet: ({ children }) => <ul className="space-y-3 font-sans text-sm">{children}</ul>,
    },
    listItem: {
      bullet: ({ children }) => (
        <li className="flex items-start">
          <CheckIcon className={`w-5 h-5 ${iconColor} mr-2 mt-0.5 flex-shrink-0`} />
          <span className="font-light">{children}</span>
        </li>
      ),
    },
  };
}

interface RichTextRendererProps {
  value: RichText;
  className?: string;
  /** Color of the check-icon bullet markers. Defaults to primary (green). */
  bulletAccent?: BulletAccent;
}

export function RichTextRenderer({
  value,
  className,
  bulletAccent = "primary",
}: RichTextRendererProps) {
  const content = (
    <PortableText value={value} components={buildComponents(bulletAccent)} />
  );

  if (className) {
    return <div className={`space-y-3 ${className}`}>{content}</div>;
  }

  return content;
}
