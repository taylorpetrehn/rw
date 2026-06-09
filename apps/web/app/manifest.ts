import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Rewilding Speech Therapy",
    short_name: "Rewilding",
    theme_color: "#2E4B3C",
    background_color: "#F7EDDA",
    display: "standalone",
    start_url: "/",
    icons: [
      {
        src: "/favicon.svg",
        type: "image/svg+xml",
        sizes: "any",
      },
      {
        src: "/favicon.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],
  };
}
