import { defineField, defineType } from "sanity";

/* ------------------------------------------------------------------ */
/* AAT section objects                                                  */
/* ------------------------------------------------------------------ */

export const aatHero = defineType({
  name: "aatHero",
  title: "AAT hero",
  type: "object",
  fields: [
    defineField({ name: "emoji", type: "string", validation: (R) => R.required() }),
    defineField({ name: "heading", type: "string", validation: (R) => R.required() }),
    defineField({ name: "lead", type: "text", rows: 3, validation: (R) => R.required() }),
  ],
});

export const aatWhyAnimals = defineType({
  name: "aatWhyAnimals",
  title: "Why animals",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string", validation: (R) => R.required() }),
    defineField({ name: "intro", type: "text", rows: 2, validation: (R) => R.required() }),
    defineField({
      name: "points",
      title: "Points",
      type: "array",
      of: [{ type: "richText" }],
      validation: (R) => R.required(),
    }),
    defineField({ name: "closing", type: "text", rows: 2 }),
  ],
});

export const aatMeetAnimals = defineType({
  name: "aatMeetAnimals",
  title: "Meet the animals",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string", validation: (R) => R.required() }),
    defineField({ name: "body", type: "richText", validation: (R) => R.required() }),
  ],
});

export const aatFaq = defineType({
  name: "aatFaq",
  title: "AAT FAQ",
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

export const aatCta = defineType({
  name: "aatCta",
  title: "AAT call to action",
  type: "object",
  fields: [
    defineField({ name: "label", type: "string", validation: (R) => R.required() }),
    defineField({ name: "href", type: "string", validation: (R) => R.required() }),
    defineField({ name: "note", type: "text", rows: 2 }),
  ],
});

/* ------------------------------------------------------------------ */
/* AAT document (singleton)                                             */
/* ------------------------------------------------------------------ */
export const aat = defineType({
  name: "aat",
  title: "Animal-Assisted Therapy page",
  type: "document",
  fields: [
    defineField({ name: "hero", type: "aatHero", validation: (R) => R.required() }),
    defineField({ name: "intro", type: "richText", validation: (R) => R.required() }),
    defineField({ name: "photo", type: "altImage", validation: (R) => R.required() }),
    defineField({ name: "whyAnimals", type: "aatWhyAnimals", validation: (R) => R.required() }),
    defineField({ name: "meetAnimals", type: "aatMeetAnimals", validation: (R) => R.required() }),
    defineField({ name: "faq", type: "aatFaq", validation: (R) => R.required() }),
    defineField({ name: "cta", type: "aatCta", validation: (R) => R.required() }),
    defineField({ name: "seo", type: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Animal-Assisted Therapy page" }) },
});
