import type { RichText } from "./types";

interface SpanLike {
  _type?: string;
  text?: string;
}

/**
 * Flatten Portable Text to plain text — one line per block, list items
 * included in order. Used for structured data (e.g. FAQPage answers) and any
 * other context that needs the prose without markup. Framework-agnostic.
 */
export function richTextToPlainText(value: RichText): string {
  return value
    .map((block) => {
      const children = (block as { children?: SpanLike[] }).children;
      if (!Array.isArray(children)) return "";
      return children
        .map((child) => (child._type === "span" ? (child.text ?? "") : ""))
        .join("");
    })
    .filter((line) => line.trim().length > 0)
    .join("\n");
}
