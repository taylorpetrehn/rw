import type { Metadata } from "next";
import Link from "next/link";
import { getAat } from "@rw/sanity";
import { SanityImage } from "@/components/ui/sanity-image";
import { RichTextRenderer } from "@/components/ui/portable-text";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const aat = await getAat();
  return {
    title: "Animal-Assisted Therapy",
    description:
      aat.seo?.description ??
      "Animal-assisted therapy at Rewilding Speech supports natural, meaningful communication through connection with our therapy animals.",
  };
}

export default async function AatPage() {
  const aat = await getAat();

  return (
    <>
      {/* AAT Hero Section */}
      <section className="relative py-16 sm:py-20 md:py-24 lg:py-32 bg-warm-gray">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-20">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-5xl sm:text-6xl mb-6 block">{aat.hero.emoji}</span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-light tracking-wide text-neutral-900 mb-6">
              {aat.hero.heading}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-neutral-600 font-sans font-light leading-relaxed max-w-3xl mx-auto">
              {aat.hero.lead}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 sm:py-20 md:py-24 bg-pure-white">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-20">
          <div className="max-w-4xl mx-auto">

            {/* Intro */}
            <div className="mb-12 sm:mb-16 md:mb-20 text-center">
              <RichTextRenderer
                value={aat.intro}
                className="text-base sm:text-lg text-neutral-700 font-sans font-light leading-relaxed"
              />
            </div>

            {/* Photo */}
            <div className="mb-12 sm:mb-16 md:mb-20">
              <div className="relative aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl">
                <SanityImage
                  image={aat.photo}
                  fill
                  sizes="(max-width: 896px) 100vw, 896px"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Why Animals */}
            <div className="mb-12 sm:mb-16 md:mb-20">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-light text-neutral-900 mb-6 text-center">
                {aat.whyAnimals.heading}
              </h2>
              <p className="text-base sm:text-lg text-neutral-600 font-sans font-light leading-relaxed mb-6 text-center">
                {aat.whyAnimals.intro}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {aat.whyAnimals.points.map((point, i) => (
                  <div key={i} className="bg-warm-gray rounded-2xl p-5 sm:p-6">
                    <RichTextRenderer value={point} className="text-neutral-700 font-sans font-light" />
                  </div>
                ))}
              </div>
              <p className="text-sm sm:text-base text-neutral-600 font-sans font-light leading-relaxed mt-6 text-center italic">
                {aat.whyAnimals.closing}
              </p>
            </div>

            {/* Meet the Animals */}
            <div className="mb-12 sm:mb-16 md:mb-20 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border border-primary/10">
              <h2 className="text-2xl sm:text-3xl font-serif font-light text-neutral-900 mb-4 text-center">
                {aat.meetAnimals.heading}
              </h2>
              <RichTextRenderer
                value={aat.meetAnimals.body}
                className="text-base sm:text-lg text-neutral-700 font-sans font-light leading-relaxed text-center"
              />
            </div>

            {/* FAQ Section */}
            <div className="mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-light text-neutral-900 mb-8 text-center">
                {aat.faq.heading}
              </h2>

              <div className="space-y-4 sm:space-y-6">
                {aat.faq.items.map((item, i) => (
                  <div key={i} className="bg-warm-gray rounded-2xl p-5 sm:p-6 md:p-8">
                    <h3 className="text-lg sm:text-xl font-serif font-medium text-neutral-900 mb-3">
                      {item.question}
                    </h3>
                    <RichTextRenderer
                      value={item.answer}
                      bulletAccent="secondary"
                      className="text-sm sm:text-base text-neutral-600 font-sans font-light leading-relaxed"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <Link
                href="/contact"
                className="inline-flex items-center bg-secondary text-pure-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium text-sm tracking-wider hover:bg-secondary-light transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {aat.cta.label}
              </Link>
              <p className="text-sm text-neutral-500 font-sans font-light mt-4">
                {aat.cta.note}
              </p>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
