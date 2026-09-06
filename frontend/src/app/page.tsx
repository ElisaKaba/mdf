import Hero from "@/components/home/Hero";

import { getHouses } from "@/lib/strapi/houses";
import { getLandingPage } from "@/lib/strapi/landing";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [housesResponse, landingResponse] =
    await Promise.all([
      getHouses("fr"),
      getLandingPage(),
    ]);

  const landing = landingResponse.data;

  return (
    <Hero
      houses={housesResponse.data ?? []}
      slogan={
        landing?.slogan ??
        "Un lieu d’accueil, d’écoute et d’action pour les femmes du Pays Basque."
      }
      ctaLabel={
        landing?.ctaLabel ??
        "Découvrir nos actions"
      }
    />
  );
}