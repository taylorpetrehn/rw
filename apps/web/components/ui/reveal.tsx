"use client";

import {
  useEffect,
  useRef,
  type CSSProperties,
  type JSX,
  type ReactNode,
  type RefObject,
} from "react";

interface RevealProps {
  className?: string;
  children?: ReactNode;
  as?: keyof JSX.IntrinsicElements;
  /**
   * Stagger offset in ms — applied as the reveal's transition-delay so
   * sibling reveals can be choreographed (heading → rule → copy → CTA).
   */
  delay?: number;
}

/**
 * Scroll reveal (IntersectionObserver). The hidden/visible/done states live in
 * CSS via [data-reveal] (see globals.css) — pass only layout/visual classes in
 * `className`. Override the entry direction per instance with the
 * `--reveal-from` custom property (e.g. `md:[--reveal-from:translateX(-2rem)]`).
 */
export function Reveal({ className, children, as = "div", delay = 0 }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Once revealed, drop the transition ("done") so utility transitions on
    // the same element (hover lifts, etc.) aren't slowed or delayed by it.
    // transitionend bubbles, so only finish on the wrapper's own transition —
    // a child's hover transition ending mid-reveal must not cut ours short.
    const handleTransitionEnd = (event: TransitionEvent) => {
      if (event.target !== el) return;
      el.dataset.reveal = "done";
      el.removeEventListener("transitionend", handleTransitionEnd);
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.dataset.reveal = "done";
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          el.dataset.reveal = "visible";
          el.addEventListener("transitionend", handleTransitionEnd);
          observer.unobserve(entry.target);
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -100px 0px",
        threshold: 0.1,
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      el.removeEventListener("transitionend", handleTransitionEnd);
    };
  }, []);

  const Tag = as as "div";

  return (
    <Tag
      ref={ref as RefObject<HTMLDivElement>}
      className={className}
      data-reveal="hidden"
      style={
        delay
          ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties)
          : undefined
      }
    >
      {children}
    </Tag>
  );
}
