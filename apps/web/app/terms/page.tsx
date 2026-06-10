import type { Metadata } from "next";
import { getLegal } from "@rw/sanity";
import { RichTextRenderer } from "@/components/ui/portable-text";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getLegal("terms");
  return buildMetadata({
    title: page.title,
    description:
      page.seo?.description ??
      "The terms governing use of the Rewilding Speech Therapy website.",
    path: "/terms",
  });
}

export default async function TermsPage() {
  const page = await getLegal("terms");

  return (
    <section className="py-16 sm:py-24 bg-warm-gray min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-serif text-primary mb-8">
            {page.title}
          </h1>
          <RichTextRenderer
            value={page.body}
            className="space-y-4 text-neutral-700 font-sans font-light leading-relaxed"
          />
        </div>
      </div>
    </section>
  );
}
