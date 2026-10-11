import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/design-system",
      ],
    },

    sitemap: [
      "https://mdf-ee.fr/sitemap.xml",
      "https://mdf-ee.eus/sitemap.xml",
    ],
  };
}