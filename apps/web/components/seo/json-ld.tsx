import type { SchemaNode } from "@/lib/structured-data";

interface JsonLdProps {
  schema: SchemaNode;
}

/**
 * Render a schema.org node as an application/ld+json <script>. Builders live
 * in `lib/structured-data.ts` — pages compose the nodes they need (entity
 * graph, FAQPage, breadcrumbs) and render one <JsonLd> per node.
 */
export function JsonLd({ schema }: JsonLdProps) {
  // Escape <, >, & so a Sanity-sourced value (e.g. containing "</script>")
  // can't break out of the <script> tag and inject markup.
  const json = JSON.stringify(schema)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
