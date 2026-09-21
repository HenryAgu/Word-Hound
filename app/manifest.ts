import type { MetadataRoute } from "next";

// Needed so iPhones and iPads can add the site to the Home Screen: Safari only
// delivers web push to sites installed that way.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Word Hoard",
    short_name: "Word Hoard",
    description: "A daily gazette of words, gathered from every tongue and every age.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2b1f14",
    icons: [{ src: "/favicon.ico", sizes: "48x48", type: "image/x-icon" }],
  };
}
