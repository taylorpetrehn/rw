import {
  resolveImageSrc,
  richTextToPlainText,
  type FaqItem,
  type HomeContent,
  type SiteSettings,
} from "@rw/sanity";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://rewildingspeech.com";

/** Schema.org node — kept loose on purpose; builders below own the shapes. */
export type SchemaNode = Record<string, unknown>;

function absoluteUrl(path: string): string {
  return path.startsWith("http") ? path : `${siteUrl}${path}`;
}

/**
 * The site's entity graph: the practice (MedicalBusiness), its founder
 * (Person), and the WebSite — cross-linked by stable `@id`s so search
 * engines and AI answerers resolve them as one entity, not three guesses.
 */
export function buildBusinessGraph(
  settings: SiteSettings,
  home: HomeContent,
): SchemaNode {
  const address = settings.address ?? {};
  const businessId = `${siteUrl}/#business`;
  const personId = `${siteUrl}/#kailey`;
  const portraitUrl = absoluteUrl(resolveImageSrc(home.team.portrait));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalBusiness",
        "@id": businessId,
        name: `${settings.brandName} ${settings.brandSubtitle}`,
        slogan: settings.tagline,
        description:
          "Private speech therapy practice specializing in AAC and Gestalt Language Processing with a neurodiversity-affirming approach",
        url: siteUrl,
        image: portraitUrl,
        // Omit absent optional properties instead of emitting "" (schema
        // validators flag empty values).
        ...(settings.contactPhone ? { telephone: settings.contactPhone } : {}),
        ...(settings.contactEmail ? { email: settings.contactEmail } : {}),
        address: {
          "@type": "PostalAddress",
          addressLocality: address.locality ?? "Lawrence",
          addressRegion: address.region ?? "KS",
          addressCountry: address.country ?? "US",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: "38.9717",
          longitude: "-95.2353",
        },
        areaServed: settings.serviceAreas.map((city) => ({
          "@type": "City",
          name: city,
          address: {
            "@type": "PostalAddress",
            addressRegion: address.region ?? "KS",
          },
        })),
        medicalSpecialty: "Speech-Language Pathology",
        serviceType: [
          "AAC (Augmentative and Alternative Communication)",
          "Gestalt Language Processing",
          "Nature-Based Therapy",
          "Animal-Assisted Therapy",
          "Parent Coaching",
          "Neurodiversity-Affirming Therapy",
        ],
        founder: { "@id": personId },
      },
      {
        "@type": "Person",
        "@id": personId,
        name: home.team.name,
        jobTitle: home.team.title,
        description: home.team.credentialLine,
        image: portraitUrl,
        worksFor: { "@id": businessId },
        knowsAbout: [...home.team.expertise, ...home.team.specialInterests],
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: `${settings.brandName} ${settings.brandSubtitle}`,
        publisher: { "@id": businessId },
      },
    ],
  };
}

/**
 * FAQPage markup. Google retired FAQ rich results, but the markup still
 * feeds entity understanding and is among the highest-cited structures in
 * AI search answers — which is where "do you take insurance?" gets asked now.
 */
export function buildFaqSchema(items: FaqItem[]): SchemaNode {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: richTextToPlainText(item.answer),
      },
    })),
  };
}

/** BreadcrumbList for inner pages (e.g. Home → Animal-Assisted Therapy). */
export function buildBreadcrumbSchema(
  crumbs: Array<{ name: string; path: string }>,
): SchemaNode {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}
