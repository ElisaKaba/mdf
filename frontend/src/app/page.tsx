import { headers } from "next/headers";

import Hero from "@/components/home/Hero";

import { getHouses } from "@/lib/strapi/houses";
import { getLandingPage } from "@/lib/strapi/landing";

export const dynamic = "force-dynamic";

type HomePageProps = {
  searchParams: Promise<{
    lang?: string;
  }>;
};

export default async function HomePage({
  searchParams,
}: HomePageProps) {
  const { lang } = await searchParams;

  const headersList = await headers();

  const host =
    headersList.get("host") ?? "";

  const locale: "fr" | "eu" =
    lang === "eu"
      ? "eu"
      : lang === "fr"
      ? "fr"
      : host.includes("mde-ee.eus")
      ? "eu"
      : "fr";

  const [
    housesResponse,
    landingResponse,
  ] = await Promise.all([
    getHouses(locale),
    getLandingPage(locale),
  ]);

  const landing =
    landingResponse.data;

  return (
    <Hero
      houses={
        housesResponse.data ?? []
      }
      slogan={
        landing?.slogan ?? ""
      }
      ctaLabel={
        landing?.ctaLabel ?? ""
      }
      selectorLabel={
        landing?.selectorLabel ?? ""
      }
      selectorPlaceholder={
        landing?.selectorPlaceholder ?? ""
      }
    />
  );
}