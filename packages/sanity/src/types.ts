import type { PortableTextBlock } from "@portabletext/types";

/** Rich text stored as Portable Text (paragraphs, bullet lists, inline strong/em). */
export type RichText = PortableTextBlock[];

export type AccentColor = "primary" | "secondary";

/**
 * An image that may come from Sanity (`asset`) or from a bundled local file
 * (`src`, e.g. "/images/kailey.jpg"). `alt` is always required.
 */
export interface SanityImageRef {
  asset?: { _ref?: string; _type?: string } | unknown;
  src?: string;
  alt: string;
}

export interface CtaLink {
  label: string;
  href: string;
}

export interface Seo {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: SanityImageRef;
}

/* ------------------------------------------------------------------ */
/* Site-wide settings                                                  */
/* ------------------------------------------------------------------ */
export interface SiteSettings {
  brandName: string; // "Rewilding"
  brandSubtitle: string; // "Speech Therapy"
  tagline: string; // footer italic tagline
  primaryCta: CtaLink; // "Get Started" -> /contact
  contactEmail?: string;
  contactPhone?: string;
  address?: {
    locality?: string; // "Lawrence"
    region?: string; // "KS"
    country?: string; // "US"
  };
  serviceAreas: string[]; // ["Lawrence","Topeka","Olathe","Overland Park"]
  copyrightName: string; // "Rewilding Speech Therapy"
  defaultSeo: Seo;
}

/* ------------------------------------------------------------------ */
/* Home page                                                           */
/* ------------------------------------------------------------------ */
export interface HeroSection {
  headingLine1: string; // "Welcome to"
  headingLine2: string; // "Rewilding"
  subLabel: string; // "Speech Therapy"
  lead: string; // "Where communication grows naturally—..."
  serviceArea: string; // "Serving families in Lawrence, Topeka..."
  cta: CtaLink; // "Get in touch" -> /contact
  portrait: SanityImageRef; // kailey.jpg
}

export interface ApproachCard {
  badge: string; // "Natural"
  accent: AccentColor; // badge + check-icon color
  title: string; // "Support, in real life."
  description: string;
  bullets: string[];
  image?: SanityImageRef; // flip-card back photo (Support / AAC / GLP)
  href?: string; // set on the AAT card -> /aat
  linkLabel?: string; // "Learn more" (only on the linking card)
}

export interface ApproachSection {
  heading: string; // "Our Approach"
  intro: string; // "Everyone deserves a voice—..."
  cards: ApproachCard[];
}

export interface PhilosophyFeature {
  badge: string; // "Core Philosophy"
  title: string; // "Neurodiversity-Affirming"
  paragraphs: string[];
  quote: string;
}

export interface PhilosophySmallCard {
  title: string;
  body: string;
}

export interface PhilosophySection {
  heading: string; // "What Makes Us Different"
  intro: string;
  feature: PhilosophyFeature;
  smallCards: PhilosophySmallCard[];
  goalTitle: string; // "Our Goal for Every Family"
  goalBody: string;
}

export interface TeamSection {
  heading: string; // "Meet Kailey"
  portrait: SanityImageRef;
  quote: string;
  name: string; // "Kailey Petrehn"
  title: string; // "Speech-Language Pathologist"
  credentialLine: string; // "M.A., CCC-SLP • Founder & Owner"
  bio: string[];
  expertise: string[];
  specialInterests: string[];
  credentials: string[];
}

export interface FaqItem {
  question: string;
  answer: RichText;
}

export interface FaqSection {
  heading: string;
  items: FaqItem[];
}

export interface HomeContent {
  hero: HeroSection;
  approach: ApproachSection;
  philosophy: PhilosophySection;
  team: TeamSection;
  faq: FaqSection;
  seo?: Seo;
}

/* ------------------------------------------------------------------ */
/* Animal-Assisted Therapy page                                        */
/* ------------------------------------------------------------------ */
export interface AatContent {
  hero: {
    emoji: string; // "🐾"
    heading: string; // "Animal-Assisted Therapy"
    lead: string;
  };
  intro: RichText; // includes emphasised "Rewilding Speech"
  photo: SanityImageRef; // aat-photo.jpg
  whyAnimals: {
    heading: string; // "Why Animals?"
    intro: string; // "Animals can help communication grow because they:"
    points: RichText[]; // 4 cards, each with inline strong
    closing: string; // italic closing line
  };
  meetAnimals: {
    heading: string; // "Meet Our Therapy Animals"
    body: RichText; // names Larry/Otis/Joey in bold
  };
  faq: {
    heading: string; // "Frequently Asked Questions"
    items: FaqItem[];
  };
  cta: {
    label: string; // "Get in Touch"
    href: string;
    note: string;
  };
  seo?: Seo;
}

/* ------------------------------------------------------------------ */
/* Legal pages (Privacy / Terms)                                       */
/* ------------------------------------------------------------------ */
export interface LegalPage {
  title: string;
  body: RichText;
  seo?: Seo;
}
