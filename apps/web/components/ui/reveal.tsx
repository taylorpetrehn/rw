"use client";

import { useEffect, useRef, type JSX, type ReactNode, type RefObject } from "react";

interface RevealProps {
  className?: string;
  children?: ReactNode;
  as?: keyof JSX.IntrinsicElements;
}

export function Reveal({ className, children, as = "div" }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reveal = () => {
      el.style.transition =
        "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)";
      el.style.opacity = "1";
      el.style.transform = "translateX(0) translateY(0)";
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      reveal();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal();
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -100px 0px",
        threshold: 0.1,
      }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  const Tag = as as "div";

  return (
    <Tag ref={ref as RefObject<HTMLDivElement>} className={className}>
      {children}
    </Tag>
  );
}
