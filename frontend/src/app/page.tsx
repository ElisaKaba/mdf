import { resolveLocale } from "@/lib/i18n/getDefaultLocale";
import { headers } from "next/headers";

import Hero from "@/components/home/Hero";

import { getHouses } from "@/lib/strapi/houses";
import { getLandingPage } from "@/lib/strapi/landing";

export const dynamic = "force-dynamic";

export default async function HomePage({ searchParams }: {
  searchParams: Promise<{ lang?: string | string[] }>;
}) {
  const headersList =
    await headers();

  const host =
    headersList.get("host") ?? "";

  const locale =
    resolveLocale(host, (await searchParams).lang);

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