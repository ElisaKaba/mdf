import { headers } from "next/headers";

import Hero from "@/components/home/Hero";

import { getHouses } from "@/lib/strapi/houses";
import { getLandingPage } from "@/lib/strapi/landing";

export const dynamic = "force-dynamic";

type Locale = "fr" | "eu";

function getLocaleFromHost(
  host: string
): Locale {
  if (host.includes("mdf-ee.eus")) {
    return "eu";
  }

  return "fr";
}

export default async function HomePage() {
  const headersList =
    await headers();

  const host =
    headersList.get("host") ?? "";

  const locale =
    getLocaleFromHost(host);

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
        landing?.slogan ??
        ""
      }
      ctaLabel={
        landing?.ctaLabel ??
        ""
      }
      selectorLabel={
        landing?.selectorLabel ??
        ""
      }
      selectorPlaceholder={
        landing?.selectorPlaceholder ??
        ""
      }
    />
  );
}