"use client";

import { useState, useRef, type KeyboardEvent, type ReactNode, type TouchEvent } from "react";
import { cn } from "@/lib/cn";

interface FlipCardProps {
  className?: string;
  front: ReactNode;
  back: ReactNode;
}

export function FlipCard({ className, front, back }: FlipCardProps) {
  const [flipped, setFlipped] = useState(false);
  const touchStart = useRef({ x: 0, y: 0 });

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    if (!touch) return;
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const touch = event.changedTouches[0];
    if (!touch) return;
    const deltaX = Math.abs(touch.clientX - touchStart.current.x);
    const deltaY = Math.abs(touch.clientY - touchStart.current.y);

    if (deltaX < 10 && deltaY < 10) {
      setFlipped((value) => !value);
    }
  };

  // Keyboard parity with hover/tap: Enter or Space flips the card. Ignore
  // bubbled key events from descendants (e.g. the close button).
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    setFlipped((value) => !value);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      className={cn("flip-card", flipped && "flipped", className)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
    >
      <div className="flip-card-inner">
        <div className="flip-card-front shadow-lg hover:shadow-xl transition-all duration-500 p-6 sm:p-8">
          {front}
        </div>
        <div className="flip-card-back shadow-xl">
          {back}
          {/* Touch-only affordance (hidden on hover devices via CSS); kept out
              of the tab order so the role="button" wrapper has no focusable
              descendants — keyboard users toggle with Enter/Space instead. */}
          <button
            type="button"
            tabIndex={-1}
            className="flip-card-back-close"
            aria-label="Close photo view"
            onClick={() => setFlipped(false)}
          >
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
