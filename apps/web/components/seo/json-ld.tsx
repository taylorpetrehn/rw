import { getSiteSettings } from "@rw/sanity";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://rewildingspeech.com";

/**
 * MedicalBusiness JSON-LD for local SEO. Server component — fetches site
 * settings for address and service areas, renders a schema.org <script>.
 */
export async function JsonLd() {
  const settings = await getSiteSettings();
  const address = settings.address ?? {};

  const schema = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: "Rewilding Speech Therapy",
    description:
      "Private speech therapy practice specializing in AAC and Gestalt Language Processing with a neurodiversity-affirming approach",
    url: siteUrl,
    telephone: settings.contactPhone ?? "",
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
      "Parent Coaching",
      "Neurodiversity-Affirming Therapy",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
