import { defineArrayMember, defineField, defineType } from "sanity";

/* ------------------------------------------------------------------ */
/* RichText (Portable Text) — strong/em decorators + bullet lists      */
/* ------------------------------------------------------------------ */
export const richText = defineType({
  name: "richText",
  title: "Rich Text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [{ title: "Normal", value: "normal" }],
      lists: [{ title: "Bullet", value: "bullet" }],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
        ],
        annotations: [],
      },
    }),
    defineArrayMember({
      type: "image",
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
  ],
});

/* ------------------------------------------------------------------ */
/* Image with required alt                                             */
/* ------------------------------------------------------------------ */
export const altImage = defineType({
  name: "altImage",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
  ],
});

/* ------------------------------------------------------------------ */
/* SEO                                                                 */
/* ------------------------------------------------------------------ */
export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string", validation: (R) => R.required() }),
    defineField({
      name: "description",
      type: "text",
      rows: 3,
      validation: (R) => R.required(),
    }),
    defineField({ name: "keywords", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "ogImage", type: "altImage" }),
  ],
});

/* ------------------------------------------------------------------ */
/* Call-to-action link                                                 */
/* ------------------------------------------------------------------ */
export const cta = defineType({
  name: "cta",
  title: "Call to action",
  type: "object",
  fields: [
    defineField({ name: "label", type: "string", validation: (R) => R.required() }),
    defineField({ name: "href", type: "string", validation: (R) => R.required() }),
  ],
});

/* ------------------------------------------------------------------ */
/* FAQ item                                                            */
/* ------------------------------------------------------------------ */
export const faqItem = defineType({
  name: "faqItem",
  title: "FAQ item",
  type: "object",
  fields: [
    defineField({
      name: "question",
      type: "string",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "answer",
      type: "richText",
      validation: (R) => R.required(),
    }),
  ],
  preview: { select: { title: "question" } },
});

/* ------------------------------------------------------------------ */
/* Approach card                                                       */
/* ------------------------------------------------------------------ */
export const approachCard = defineType({
  name: "approachCard",
  title: "Approach card",
  type: "object",
  fields: [
    defineField({ name: "badge", type: "string", validation: (R) => R.required() }),
    defineField({
      name: "accent",
      type: "string",
      options: { list: ["primary", "secondary"], layout: "radio" },
      validation: (R) => R.required(),
    }),
    defineField({ name: "title", type: "string", validation: (R) => R.required() }),
    defineField({
      name: "description",
      type: "text",
      rows: 3,
      validation: (R) => R.required(),
    }),
    defineField({ name: "bullets", type: "array", of: [{ type: "string" }] }),
    defineField({
      name: "image",
      type: "altImage",
      description: "Flip-card back photo (omit on a linking card).",
    }),
    defineField({
      name: "href",
      type: "string",
      description: "Set to make this card a link (e.g. /aat).",
    }),
    defineField({ name: "linkLabel", type: "string" }),
  ],
  preview: { select: { title: "title", subtitle: "badge" } },
});

/* ------------------------------------------------------------------ */
/* Philosophy feature + small card                                     */
/* ------------------------------------------------------------------ */
export const philosophyFeature = defineType({
  name: "philosophyFeature",
  title: "Philosophy feature",
  type: "object",
  fields: [
    defineField({ name: "badge", type: "string", validation: (R) => R.required() }),
    defineField({ name: "title", type: "string", validation: (R) => R.required() }),
    defineField({
      name: "paragraphs",
      type: "array",
      of: [{ type: "text" }],
      validation: (R) => R.required(),
    }),
    defineField({ name: "quote", type: "text", rows: 2 }),
  ],
});

export const philosophySmallCard = defineType({
  name: "philosophySmallCard",
  title: "Philosophy small card",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string", validation: (R) => R.required() }),
    defineField({ name: "body", type: "text", rows: 3, validation: (R) => R.required() }),
  ],
  preview: { select: { title: "title" } },
});
