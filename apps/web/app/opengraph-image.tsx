import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

/**
 * Generated 1200×630 Open Graph card in the brand voice (cream field,
 * forest Birdie wordmark, orange accent) — replaces the 1333×2000 portrait
 * photo that link unfurlers had to crop badly. Applies site-wide via the
 * file convention; pages can override with `buildMetadata({ image })`.
 */

export const alt =
  "Rewilding Speech Therapy — Where communication grows naturally";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  // Satori supports WOFF (not WOFF2) — load the brand face directly.
  const birdie = await readFile(
    path.join(process.cwd(), "app", "fonts", "TAYBirdie.woff"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#F7EDDA",
          fontFamily: "Birdie",
          color: "#2E4B3C",
        }}
      >
        {/* Hairline frame */}
        <div
          style={{
            position: "absolute",
            top: 28,
            left: 28,
            right: 28,
            bottom: 28,
            border: "2px solid rgba(46, 75, 60, 0.22)",
            borderRadius: 28,
          }}
        />
        <div style={{ fontSize: 150, lineHeight: 1.05 }}>Rewilding</div>
        <div
          style={{
            fontSize: 32,
            letterSpacing: 16,
            marginTop: 8,
            textTransform: "uppercase",
            color: "rgba(46, 75, 60, 0.78)",
          }}
        >
          Speech Therapy
        </div>
        <div
          style={{
            width: 72,
            height: 3,
            backgroundColor: "#F0531C",
            borderRadius: 2,
            marginTop: 36,
            marginBottom: 32,
          }}
        />
        <div
          style={{
            fontSize: 30,
            maxWidth: 860,
            textAlign: "center",
            color: "rgba(46, 75, 60, 0.85)",
          }}
        >
          Where communication grows naturally — sparked by joy, rooted in
          connection
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Birdie", data: birdie, weight: 400, style: "normal" }],
    },
  );
}
