import { defineField, defineType } from "sanity";

/* ------------------------------------------------------------------ */
/* Home section objects                                                 */
/* ------------------------------------------------------------------ */

export const heroSection = defineType({
  name: "heroSection",
  title: "Hero",
  type: "object",
  fields: [
    defineField({ name: "headingLine1", type: "string", validation: (R) => R.required() }),
    defineField({ name: "headingLine2", type: "string", validation: (R) => R.required() }),
    defineField({ name: "subLabel", type: "string", validation: (R) => R.required() }),
    defineField({ name: "lead", type: "text", rows: 2, validation: (R) => R.required() }),
    defineField({ name: "serviceArea", type: "text", rows: 2, validation: (R) => R.required() }),
    defineField({ name: "cta", type: "cta", validation: (R) => R.required() }),
    defineField({
      name: "secondaryCta",
      title: "Secondary CTA (optional)",
      type: "cta",
    }),
    defineField({ name: "portrait", type: "altImage", validation: (R) => R.required() }),
  ],
});

export const approachSection = defineType({
  name: "approachSection",
  title: "Approach",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string", validation: (R) => R.required() }),
    defineField({ name: "intro", type: "text", rows: 2, validation: (R) => R.required() }),
    defineField({
      name: "cards",
      type: "array",
      of: [{ type: "approachCard" }],
      validation: (R) => R.required(),
    }),
  ],
});

export const philosophySection = defineType({
  name: "philosophySection",
  title: "Philosophy",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string", validation: (R) => R.required() }),
    defineField({ name: "intro", type: "text", rows: 2, validation: (R) => R.required() }),
    defineField({ name: "feature", type: "philosophyFeature", validation: (R) => R.required() }),
    defineField({
      name: "smallCards",
      type: "array",
      of: [{ type: "philosophySmallCard" }],
    }),
    defineField({ name: "goalTitle", type: "string", validation: (R) => R.required() }),
    defineField({ name: "goalBody", type: "text", rows: 3, validation: (R) => R.required() }),
  ],
});

export const teamSection = defineType({
  name: "teamSection",
  title: "Team",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string", validation: (R) => R.required() }),
    defineField({ name: "portrait", type: "altImage", validation: (R) => R.required() }),
    defineField({ name: "quote", type: "text", rows: 2 }),
    defineField({ name: "name", type: "string", validation: (R) => R.required() }),
    defineField({ name: "title", type: "string", validation: (R) => R.required() }),
    defineField({ name: "credentialLine", type: "string" }),
    defineField({ name: "bio", type: "array", of: [{ type: "text" }] }),
    defineField({ name: "expertise", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "specialInterests", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "credentials", type: "array", of: [{ type: "string" }] }),
  ],
});

export const faqSection = defineType({
  name: "faqSection",
  title: "FAQ",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string", validation: (R) => R.required() }),
    defineField({
      name: "items",
      type: "array",
      of: [{ type: "faqItem" }],
      validation: (R) => R.required(),
    }),
  ],
});

/* ------------------------------------------------------------------ */
/* Home document (singleton)                                            */
/* ------------------------------------------------------------------ */
export const home = defineType({
  name: "home",
  title: "Home page",
  type: "document",
  fields: [
    defineField({ name: "hero", type: "heroSection", validation: (R) => R.required() }),
    defineField({ name: "approach", type: "approachSection", validation: (R) => R.required() }),
    defineField({ name: "philosophy", type: "philosophySection", validation: (R) => R.required() }),
    defineField({ name: "team", type: "teamSection", validation: (R) => R.required() }),
    defineField({ name: "faq", type: "faqSection", validation: (R) => R.required() }),
    defineField({ name: "seo", type: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Home page" }) },
});
