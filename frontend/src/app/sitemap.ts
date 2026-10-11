import type { MetadataRoute } from "next";

const routes = [
  "",
  "/urrugne/qui-sommes-nous",
  "/urrugne/actions",
  "/urrugne/agenda",
  "/urrugne/nous-rejoindre",
  "/urrugne/nous-soutenir",
  "/urrugne/partenaires",
  "/urrugne/ressources",
  "/urrugne/contact",
  "/urrugne/mentions-legales",
  "/urrugne/politique-de-confidentialite",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    ...routes.map((route) => ({
      url: `https://mdf-ee.fr${route}`,
      lastModified: now,
      changeFrequency:
        route.includes("agenda")
          ? ("daily" as const)
          : ("monthly" as const),
      priority:
        route === ""
          ? 1
          : route.includes("agenda")
            ? 0.9
            : 0.7,
      alternates: {
        languages: {
          fr: `https://mdf-ee.fr${route}`,
          eu: `https://mdf-ee.eus${route}`,
        },
      },
    })),

    ...routes.map((route) => ({
      url: `https://mdf-ee.eus${route}`,
      lastModified: now,
      changeFrequency:
        route.includes("agenda")
          ? ("daily" as const)
          : ("monthly" as const),
      priority:
        route === ""
          ? 1
          : route.includes("agenda")
            ? 0.9
            : 0.7,
      alternates: {
        languages: {
          fr: `https://mdf-ee.fr${route}`,
          eu: `https://mdf-ee.eus${route}`,
        },
      },
    })),
  ];
}