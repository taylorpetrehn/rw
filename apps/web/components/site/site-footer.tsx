import Link from "next/link";
import type { SiteSettings } from "@rw/sanity";

interface SiteFooterProps {
  settings: SiteSettings;
}

export function SiteFooter({ settings }: SiteFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-pure-white pt-8 sm:pt-10 md:pt-12 pb-6 sm:pb-8 border-t border-neutral-200">
      <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-20">
        {/* Centered Content */}
        <div className="max-w-2xl mx-auto text-center space-y-5 sm:space-y-6">
          {/* Brand */}
          <div className="space-y-1.5 sm:space-y-2">
            <h3 className="text-brand font-serif text-primary">
              {settings.brandName}
            </h3>
            <p className="eyebrow font-light text-neutral-600">
              {settings.brandSubtitle}
            </p>
          </div>

          {/* Tagline */}
          <p className="text-sm sm:text-base text-neutral-600 font-sans font-light italic leading-relaxed max-w-xl mx-auto">
            {settings.tagline}
          </p>

          {/* Navigation Links */}
          <nav>
            <ul className="flex flex-wrap justify-center gap-3 sm:gap-5 text-neutral-700 font-sans">
              <li>
                <Link
                  href="/#approach"
                  className="hover:text-primary transition-colors duration-300 font-light text-xs py-1 px-1"
                >
                  Our Approach
                </Link>
              </li>
              <li>
                <Link
                  href="/#philosophy"
                  className="hover:text-primary transition-colors duration-300 font-light text-xs py-1 px-1"
                >
                  Philosophy
                </Link>
              </li>
              <li>
                <Link
                  href="/#team"
                  className="hover:text-primary transition-colors duration-300 font-light text-xs py-1 px-1"
                >
                  Team
                </Link>
              </li>
              <li>
                <Link
                  href="/#faq"
                  className="hover:text-primary transition-colors duration-300 font-light text-xs py-1 px-1"
                >
                  Insurance
                </Link>
              </li>
            </ul>
          </nav>

          {/* CTA Button */}
          <div>
            <Link
              href={settings.primaryCta.href}
              className="inline-flex items-center bg-primary text-white px-5 sm:px-6 py-2 sm:py-2.5 rounded-full font-sans font-medium text-xs tracking-wider hover:bg-primary-light transition-all duration-300 shadow-sm hover:shadow-md"
            >
              {settings.primaryCta.label}
            </Link>
          </div>

          {/* Copyright & Legal */}
          <div className="pt-3 sm:pt-4 border-t border-neutral-200 space-y-2 text-neutral-500 font-sans text-xs font-light">
            <p>
              &copy; {year} {settings.copyrightName}. All rights reserved.
            </p>
            <div className="flex justify-center items-center gap-3 sm:gap-4">
              <Link
                href="/privacy"
                className="hover:text-primary transition-colors py-1 px-1"
              >
                Privacy Policy
              </Link>
              <span className="text-neutral-400">•</span>
              <Link
                href="/terms"
                className="hover:text-primary transition-colors py-1 px-1"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
