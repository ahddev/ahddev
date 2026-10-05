import type { MetadataRoute } from "next";

// Installable app: on iPhone, push notifications only work from the Home Screen.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ahed Mail",
    short_name: "Mail",
    start_url: "/inbox",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [
      { src: "/icon/192", sizes: "192x192", type: "image/png" },
      { src: "/icon/512", sizes: "512x512", type: "image/png" },
    ],
  };
}
