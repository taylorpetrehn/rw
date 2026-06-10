import type { Metadata } from "next";
import Link from "next/link";
import { getHome, getSiteSettings } from "@rw/sanity";
import { Reveal } from "@/components/ui/reveal";
import { FlipCard } from "@/components/ui/flip-card";
import { SanityImage } from "@/components/ui/sanity-image";
import { CheckIcon } from "@/components/ui/check-icon";
import { RichTextRenderer } from "@/components/ui/portable-text";
import { JsonLd } from "@/components/seo/json-ld";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const [home, settings] = await Promise.all([getHome(), getSiteSettings()]);
  const seo = home.seo ?? settings.defaultSeo;
  return {
    title: { absolute: seo.title },
    description: seo.description,
    keywords: seo.keywords,
    alternates: { canonical: "/" },
  };
}

export default async function HomePage() {
  const home = await getHome();

  return (
    <>
      <JsonLd />

      {/* Hero Section - Emmeline Style */}
      <section
        id="hero"
        className="relative min-h-[85vh] sm:min-h-[90vh] lg:min-h-screen flex items-center bg-warm-gray overflow-hidden"
      >
        <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-20 py-8 sm:py-12 md:py-16 lg:py-20">
          <div className="flex flex-col md:grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-16 md:items-center max-w-7xl mx-auto">
            {/* Left: Content */}
            <div className="space-y-6 sm:space-y-8 max-w-xl mx-auto md:mx-0 text-center md:text-left">
              <Reveal className="opacity-0 translate-y-8">
                <h1 className="text-display-xl font-serif text-primary mb-4 sm:mb-6">
                  {home.hero.headingLine1}
                  <br />
                  {home.hero.headingLine2}
                </h1>
                <p className="eyebrow font-light text-neutral-600 mb-6 sm:mb-8">
                  {home.hero.subLabel}
                </p>
              </Reveal>

              <Reveal className="w-12 sm:w-16 h-px bg-primary/20 opacity-0 translate-y-8 mx-auto md:mx-0" />

              <Reveal className="opacity-0 translate-y-8">
                <p className="text-lead text-neutral-700 font-light mb-6 sm:mb-8">
                  {home.hero.lead}
                </p>
                <p className="text-sm sm:text-base text-neutral-600 font-light leading-relaxed mb-6 sm:mb-8">
                  {home.hero.serviceArea}
                </p>
              </Reveal>

              <Reveal className="opacity-0 translate-y-8">
                <Link
                  href="/contact"
                  className="inline-flex items-center bg-secondary text-pure-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium text-xs sm:text-sm tracking-wider hover:bg-secondary-light transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {home.hero.cta.label}
                </Link>
              </Reveal>
            </div>

            {/* Right: Kailey's Portrait in Arched Frame */}
            <div className="relative flex items-center justify-center">
              <Reveal className="relative w-full max-w-xs sm:max-w-md mx-auto opacity-0 translate-y-8 md:-translate-x-8 md:translate-y-0">
                {/* Arched Portrait Container */}
                <div className="relative aspect-[3/6] rounded-t-full rounded-b-3xl overflow-hidden shadow-2xl bg-pure-white">
                  <SanityImage
                    image={home.hero.portrait}
                    priority
                    fill
                    sizes="(max-width: 768px) 80vw, 28rem"
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                {/* Decorative accent */}
                <div className="absolute -bottom-4 sm:-bottom-6 -right-4 sm:-right-6 w-24 h-24 sm:w-32 sm:h-32 bg-secondary/20 rounded-full blur-2xl -z-10"></div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Approach Section */}
      <section id="approach" className="py-16 sm:py-20 md:py-24 lg:py-32 bg-pure-white">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-20">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16 md:mb-20 lg:mb-24 max-w-4xl mx-auto">
            <Reveal className="opacity-0 translate-y-8">
              <h2 className="text-display-lg font-serif text-neutral-900 mb-4 sm:mb-6 md:mb-8">
                {home.approach.heading}
              </h2>
            </Reveal>
            <Reveal className="opacity-0 translate-y-8">
              <p className="text-lead-lg text-neutral-600 font-light mb-4 sm:mb-6 md:mb-8">
                {home.approach.intro}
              </p>
            </Reveal>
          </div>

          {/* Approach Items - Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
            {home.approach.cards.map((card, index) => {
              if (card.href) {
                // AAT Card - Links to dedicated page
                return (
                  <Reveal
                    key={card.title}
                    className="block opacity-0 translate-y-8 md:col-span-2 lg:col-span-1 group"
                  >
                    <Link href={card.href} className="block h-full group">
                      <div className="bg-pure-white rounded-2xl sm:rounded-3xl shadow-lg group-hover:shadow-xl transition-all duration-500 p-6 sm:p-8 h-full">
                        <div className="space-y-4 sm:space-y-5">
                          <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-secondary/20 rounded-full">
                            <span className="eyebrow font-medium text-secondary">
                              {card.badge}
                            </span>
                          </div>
                          <h3 className="text-display-xs font-serif text-primary">
                            {card.title}
                          </h3>
                          <p className="text-sm sm:text-base text-primary font-sans font-light leading-relaxed">
                            {card.description}
                          </p>
                          <ul className="space-y-3 font-sans text-sm">
                            {card.bullets.map((bullet) => (
                              <li key={bullet} className="flex items-start text-primary">
                                <CheckIcon className="w-5 h-5 text-secondary mr-2 mt-0.5 flex-shrink-0" />
                                <span className="font-light text-primary">{bullet}</span>
                              </li>
                            ))}
                          </ul>
                          <div className="pt-2 flex items-center text-secondary font-sans text-sm font-medium group-hover:translate-x-1 transition-transform">
                            {card.linkLabel}
                            <svg
                              className="w-4 h-4 ml-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 5l7 7-7 7"
                              ></path>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                );
              }

              const accentBadgeBg = card.accent === "secondary" ? "bg-secondary/20" : "bg-primary/20";
              const accentLabel = card.accent === "secondary" ? "text-secondary" : "text-primary";
              const accentIcon = card.accent === "secondary" ? "text-secondary" : "text-primary";

              return (
                <Reveal
                  key={card.title}
                  className={`opacity-0 translate-y-8${index === 0 ? " md:col-span-2 lg:col-span-1" : ""}`}
                >
                  <FlipCard
                    className={index === 0 ? "md:col-span-2 lg:col-span-1" : ""}
                    front={
                      <div className="space-y-4 sm:space-y-5">
                        <div className={`inline-block px-3 sm:px-4 py-1.5 sm:py-2 ${accentBadgeBg} rounded-full`}>
                          <span className={`eyebrow font-medium ${accentLabel}`}>
                            {card.badge}
                          </span>
                        </div>
                        <h3 className="text-display-xs font-serif text-primary">
                          {card.title}
                        </h3>
                        <p className="text-sm sm:text-base text-primary font-sans font-light leading-relaxed">
                          {card.description}
                        </p>
                        <ul className="space-y-3 font-sans text-sm">
                          {card.bullets.map((bullet) => (
                            <li key={bullet} className="flex items-start text-primary">
                              <CheckIcon className={`w-5 h-5 ${accentIcon} mr-2 mt-0.5 flex-shrink-0`} />
                              <span className="font-light text-primary">{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    }
                    back={
                      card.image ? (
                        <SanityImage
                          image={card.image}
                          fill
                          sizes="(max-width: 768px) 90vw, (max-width: 1024px) 45vw, 30vw"
                          className="rounded-2xl sm:rounded-3xl"
                        />
                      ) : null
                    }
                  />
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* What Makes Us Different Section */}
      <section id="philosophy" className="py-16 sm:py-20 md:py-24 lg:py-32 bg-warm-gray">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-20">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12 sm:mb-16 md:mb-20">
              <Reveal className="opacity-0 translate-y-8">
                <h2 className="text-display-lg font-serif text-neutral-900 mb-6 sm:mb-8">
                  {home.philosophy.heading}
                </h2>
              </Reveal>
              <Reveal className="opacity-0 translate-y-8">
                <p className="text-lead text-neutral-600 font-sans font-light max-w-3xl mx-auto">
                  {home.philosophy.intro}
                </p>
              </Reveal>
            </div>

            {/* Masonry-style Grid */}
            <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Large Feature Card */}
              <Reveal className="md:col-span-2 lg:row-span-2 bg-pure-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-lg hover:shadow-xl transition-all duration-500 opacity-0 translate-y-8">
                <div className="space-y-4 sm:space-y-6">
                  <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-primary/10 rounded-full">
                    <span className="eyebrow font-medium text-primary">
                      {home.philosophy.feature.badge}
                    </span>
                  </div>
                  <h3 className="text-display-sm font-serif text-neutral-900">
                    {home.philosophy.feature.title}
                  </h3>
                  {home.philosophy.feature.paragraphs.map((paragraph, i) => (
                    <p
                      key={paragraph}
                      className={
                        i === 0
                          ? "text-base sm:text-lg text-neutral-600 font-sans font-light leading-relaxed"
                          : "text-sm sm:text-base text-neutral-600 font-sans font-light leading-relaxed"
                      }
                    >
                      {paragraph}
                    </p>
                  ))}
                  <div className="pt-4 sm:pt-6 border-t border-neutral-200">
                    <p className="text-xs sm:text-sm text-neutral-500 font-sans italic">
                      {home.philosophy.feature.quote}
                    </p>
                  </div>
                </div>
              </Reveal>

              {/* Small Cards */}
              {home.philosophy.smallCards.map((smallCard, i) => (
                <Reveal
                  key={smallCard.title}
                  className="bg-pure-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-500 opacity-0 translate-y-8"
                >
                  <h3 className="text-lg sm:text-xl font-serif text-neutral-900 mb-3 sm:mb-4">
                    {smallCard.title}
                  </h3>
                  <p
                    className={
                      i === 1
                        ? "text-neutral-700 font-sans font-light leading-relaxed text-xs sm:text-sm"
                        : "text-neutral-600 font-sans font-light leading-relaxed text-xs sm:text-sm"
                    }
                  >
                    {smallCard.body}
                  </p>
                </Reveal>
              ))}

              {/* Goal Statement - Spans 2 columns */}
              <Reveal className="md:col-span-2 bg-pure-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 text-neutral-900 shadow-lg hover:shadow-xl transition-all duration-500 opacity-0 translate-y-8">
                <h3 className="text-display-xs font-serif mb-3 sm:mb-4">
                  {home.philosophy.goalTitle}
                </h3>
                <p className="text-base sm:text-lg font-sans font-light leading-relaxed opacity-95">
                  {home.philosophy.goalBody}
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Team Section */}
      <section id="team" className="py-16 sm:py-20 md:py-24 lg:py-32 bg-pure-white">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-20">
          {/* Section Header */}
          <div className="text-center mb-10 sm:mb-12 md:mb-16 lg:mb-20 max-w-4xl mx-auto">
            <Reveal className="opacity-0 translate-y-8">
              <h2 className="text-display-lg font-serif text-neutral-900 mb-5 sm:mb-6 md:mb-8">
                {home.team.heading}
              </h2>
            </Reveal>
          </div>

          <div className="max-w-7xl mx-auto">
            {/* Large Portrait with Overlapping Bio Card */}
            <div className="flex flex-col md:grid md:grid-cols-12 gap-6 sm:gap-8 md:gap-10 lg:gap-14 xl:gap-16 items-start">
              {/* Left Column: Photo + Quotes */}
              <div className="md:col-span-5 lg:col-span-5 space-y-6 sm:space-y-8 md:space-y-10 mx-auto md:mx-0 w-full max-w-xs sm:max-w-sm md:max-w-none">
                {/* Large Portrait Photo */}
                <Reveal className="relative opacity-0 translate-y-8 md:translate-x-8 md:translate-y-0">
                  <div className="relative aspect-[3/4] md:aspect-[4/5] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
                    <SanityImage
                      image={home.team.portrait}
                      fill
                      sizes="(max-width: 768px) 90vw, 40vw"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  {/* Decorative organic shape */}
                  <div className="absolute -bottom-4 sm:-bottom-6 md:-bottom-8 -right-4 sm:-right-6 md:-right-8 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-primary/10 rounded-full -z-10 blur-2xl"></div>
                </Reveal>

                {/* Kailey's Philosophy Quote */}
                <Reveal className="opacity-0 translate-y-8 md:translate-x-8 md:translate-y-0 flex justify-center">
                  <p className="text-sm sm:text-base text-neutral-700 font-serif font-light italic leading-relaxed text-center max-w-[90%]">
                    {home.team.quote}
                  </p>
                </Reveal>
              </div>

              {/* Bio Content with Overlap */}
              <Reveal className="md:col-span-7 lg:col-span-7 space-y-4 sm:space-y-5 md:space-y-6 opacity-0 translate-y-8 md:-translate-x-8 md:translate-y-0 text-center md:text-left md:pl-8 lg:pl-12 xl:pl-16 self-start md:self-center">
                {/* Name & Title */}
                <div className="space-y-1.5 sm:space-y-2 md:space-y-3">
                  <h3 className="text-display-md font-serif text-neutral-900">
                    {home.team.name}
                  </h3>
                  <p className="text-lead text-primary font-sans font-light">
                    {home.team.title}
                  </p>
                  <p className="eyebrow font-light text-neutral-500">
                    {home.team.credentialLine}
                  </p>
                </div>

                <div className="w-10 sm:w-12 md:w-16 h-px bg-primary mx-auto md:mx-0"></div>

                {/* Bio Text */}
                <div className="space-y-3 sm:space-y-4 md:space-y-6 text-neutral-700 font-sans font-light leading-relaxed text-sm sm:text-base md:text-lg">
                  {home.team.bio.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>

                {/* Areas of Expertise - Elegant Pills */}
                <div className="pt-3 sm:pt-4 md:pt-6">
                  <h4 className="eyebrow font-medium text-neutral-800 mb-3 sm:mb-4">
                    Areas of Expertise
                  </h4>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                    {home.team.expertise.map((item) => (
                      <span
                        key={item}
                        className="px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 bg-primary/10 text-primary rounded-full text-xs sm:text-sm font-sans font-light"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <h4 className="eyebrow font-medium text-neutral-800 mb-3 sm:mb-4">
                    Special Interests
                  </h4>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    {home.team.specialInterests.map((item) => (
                      <span
                        key={item}
                        className="px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 bg-primary/10 text-primary rounded-full text-xs sm:text-sm font-sans font-light"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Credentials in simple list */}
                <div className="pt-3 sm:pt-4 md:pt-6 border-t border-neutral-200">
                  <ul className="space-y-2 sm:space-y-3 text-neutral-600 font-sans font-light text-sm sm:text-base">
                    {home.team.credentials.map((credential) => (
                      <li key={credential} className="flex items-start">
                        <CheckIcon className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                        <span>{credential}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Insurance FAQ Section */}
      <section id="faq" className="py-16 sm:py-20 md:py-24 lg:py-32 bg-warm-gray">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10 sm:mb-12 md:mb-16">
              <h2 className="text-display-lg font-serif text-neutral-900 mb-4 sm:mb-6 md:mb-8">
                {home.faq.heading}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {home.faq.items.map((item, index) => (
                <div
                  key={item.question}
                  className={`bg-pure-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-500${
                    index === 2 ? " md:col-span-2 lg:col-span-1" : ""
                  }`}
                >
                  <div className="space-y-4 sm:space-y-5">
                    <h3 className="text-display-xs font-serif text-primary">
                      {item.question}
                    </h3>
                    <RichTextRenderer
                      value={item.answer}
                      bulletAccent="primary"
                      className="text-sm sm:text-base text-primary font-sans font-light leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
