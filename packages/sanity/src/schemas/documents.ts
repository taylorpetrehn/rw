import { defineField, defineType } from "sanity";

/* ------------------------------------------------------------------ */
/* Site settings (singleton)                                           */
/* ------------------------------------------------------------------ */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({ name: "brandName", type: "string", validation: (R) => R.required() }),
    defineField({ name: "brandSubtitle", type: "string", validation: (R) => R.required() }),
    defineField({ name: "tagline", type: "text", rows: 2, validation: (R) => R.required() }),
    defineField({ name: "primaryCta", type: "cta", validation: (R) => R.required() }),
    defineField({ name: "contactEmail", type: "string" }),
    defineField({ name: "contactPhone", type: "string" }),
    defineField({
      name: "address",
      type: "object",
      fields: [
        defineField({ name: "locality", type: "string" }),
        defineField({ name: "region", type: "string" }),
        defineField({ name: "country", type: "string" }),
      ],
    }),
    defineField({
      name: "serviceAreas",
      type: "array",
      of: [{ type: "string" }],
      validation: (R) => R.required(),
    }),
    defineField({ name: "copyrightName", type: "string", validation: (R) => R.required() }),
    defineField({ name: "defaultSeo", type: "seo", validation: (R) => R.required() }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});

/* ------------------------------------------------------------------ */
/* Legal page (Privacy / Terms)                                        */
/* ------------------------------------------------------------------ */
export const legalPage = defineType({
  name: "legalPage",
  title: "Legal page",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (R) => R.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title" },
      validation: (R) => R.required(),
    }),
    defineField({ name: "body", type: "richText", validation: (R) => R.required() }),
    defineField({ name: "seo", type: "seo" }),
  ],
  preview: { select: { title: "title", subtitle: "slug.current" } },
});
