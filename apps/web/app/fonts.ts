import localFont from "next/font/local";

/**
 * Birdie — the brand display/serif/body face (self-hosted from the Rails app).
 * Exposed as the CSS variable `--font-birdie`, wired into Tailwind's
 * --font-display / --font-serif / --font-body in globals.css.
 */
export const birdie = localFont({
  src: [
    { path: "./fonts/TAYBirdie.woff2", weight: "400", style: "normal" },
    { path: "./fonts/TAYBirdie.woff", weight: "400", style: "normal" },
  ],
  variable: "--font-birdie",
  display: "swap",
  fallback: ["Georgia", "serif"],
});
