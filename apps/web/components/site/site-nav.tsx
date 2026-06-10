"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { SiteSettings } from "@rw/sanity";

const SCROLLED_CLASSES = [
  "bg-warm-gray/95",
  "backdrop-blur-md",
  "shadow-sm",
  "border-b",
  "border-neutral-200/30",
];

interface SiteNavProps {
  settings: SiteSettings;
}

export function SiteNav({ settings }: SiteNavProps) {
  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Navbar scroll background behavior (navbar_controller.js)
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const handleScroll = () => {
      if (window.scrollY > 50) {
        nav.classList.add(...SCROLLED_CLASSES);
        nav.classList.remove("bg-transparent");
      } else {
        nav.classList.remove(...SCROLLED_CLASSES);
        nav.classList.add("bg-transparent");
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Outside-click close (mobile_menu_controller.js)
  useEffect(() => {
    if (!menuOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(target) &&
        !buttonRef.current.contains(target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [menuOpen]);

  return (
    <nav
      ref={navRef}
      className="fixed top-0 w-full transition-all duration-500 ease-out z-50 bg-transparent"
    >
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-brand font-serif text-primary transition-all duration-300"
            >
              {settings.brandName}
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-10">
            <Link
              href={settings.primaryCta.href}
              className="bg-secondary text-pure-white px-7 py-3 rounded-full hover:bg-secondary-dark transition-all duration-300 text-sm font-medium tracking-wider shadow-sm hover:shadow-md hover:scale-105"
            >
              {settings.primaryCta.label}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              ref={buttonRef}
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="text-neutral-700 hover:text-primary transition-colors duration-300"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        ref={menuRef}
        className={`md:hidden bg-pure-white border-t border-neutral-200 transform transition-all duration-300 ease-in-out origin-top shadow-soft-lg ${
          menuOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 hidden"
        }`}
      >
        <div className="px-6 py-4 space-y-4">
          <div className="border-t border-neutral-200 pt-4 space-y-3">
            <Link
              href={settings.primaryCta.href}
              className="block bg-secondary text-pure-white px-6 py-3 rounded-full hover:bg-secondary-dark text-center text-sm font-medium tracking-wider transition-all duration-300 shadow-sm hover:shadow-md"
            >
              {settings.primaryCta.label}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
