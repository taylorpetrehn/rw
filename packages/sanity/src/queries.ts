/**
 * GROQ queries for live Sanity content. These mirror the shapes in `types.ts`
 * and are used by `load.ts` when a Sanity project is configured. When Sanity is
 * not configured the loaders return typed fallback content from `content.ts`.
 */

/* Reusable fragments ------------------------------------------------ */

const imageFields = /* groq */ `
  asset,
  "src": asset->url,
  "alt": coalesce(alt, asset->altText, "")
`;

const seoFields = /* groq */ `
  title,
  description,
  keywords,
  ogImage{ ${imageFields} }
`;

const ctaFields = /* groq */ `
  label,
  href
`;

const approachCardFields = /* groq */ `
  badge,
  accent,
  title,
  description,
  bullets,
  href,
  linkLabel,
  image{ ${imageFields} }
`;

const faqItemFields = /* groq */ `
  question,
  answer
`;

/* Documents --------------------------------------------------------- */

export const siteSettingsQuery = /* groq */ `
*[_type == "siteSettings"][0]{
  brandName,
  brandSubtitle,
  tagline,
  primaryCta{ ${ctaFields} },
  contactEmail,
  contactPhone,
  address{ locality, region, country },
  serviceAreas,
  copyrightName,
  defaultSeo{ ${seoFields} }
}
`;

export const homeQuery = /* groq */ `
*[_type == "home"][0]{
  hero{
    headingLine1,
    headingLine2,
    subLabel,
    lead,
    serviceArea,
    cta{ ${ctaFields} },
    secondaryCta{ ${ctaFields} },
    portrait{ ${imageFields} }
  },
  approach{
    heading,
    intro,
    cards[]{ ${approachCardFields} }
  },
  philosophy{
    heading,
    intro,
    feature{
      badge,
      title,
      paragraphs,
      quote
    },
    smallCards[]{ title, body },
    goalTitle,
    goalBody
  },
  team{
    heading,
    portrait{ ${imageFields} },
    quote,
    name,
    title,
    credentialLine,
    bio,
    expertise,
    specialInterests,
    credentials
  },
  faq{
    heading,
    items[]{ ${faqItemFields} }
  },
  seo{ ${seoFields} }
}
`;

export const aatQuery = /* groq */ `
*[_type == "aat"][0]{
  hero{ emoji, heading, lead },
  intro,
  photo{ ${imageFields} },
  whyAnimals{
    heading,
    intro,
    points,
    closing
  },
  meetAnimals{
    heading,
    body
  },
  faq{
    heading,
    items[]{ ${faqItemFields} }
  },
  cta{
    label,
    href,
    note
  },
  seo{ ${seoFields} }
}
`;

export const legalQuery = /* groq */ `
*[_type == "legalPage" && slug.current == $slug][0]{
  title,
  body,
  seo{ ${seoFields} }
}
`;
