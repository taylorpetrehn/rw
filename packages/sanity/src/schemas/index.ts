import type { SchemaTypeDefinition } from "sanity";

import {
  aat,
  aatCta,
  aatFaq,
  aatHero,
  aatMeetAnimals,
  aatWhyAnimals,
} from "./aat";
import { legalPage, siteSettings } from "./documents";
import {
  approachSection,
  faqSection,
  heroSection,
  home,
  philosophySection,
  teamSection,
} from "./home";
import {
  altImage,
  approachCard,
  cta,
  faqItem,
  philosophyFeature,
  philosophySmallCard,
  richText,
  seo,
} from "./objects";

export const schemaTypes: SchemaTypeDefinition[] = [
  // Reusable objects
  richText,
  altImage,
  seo,
  cta,
  faqItem,
  approachCard,
  philosophyFeature,
  philosophySmallCard,
  // Home section objects
  heroSection,
  approachSection,
  philosophySection,
  teamSection,
  faqSection,
  // AAT section objects
  aatHero,
  aatWhyAnimals,
  aatMeetAnimals,
  aatFaq,
  aatCta,
  // Documents
  siteSettings,
  home,
  aat,
  legalPage,
];
