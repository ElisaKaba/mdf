import { fetchStrapi } from "./client";

export type StrapiLandingPage = {
  id: number;
  documentId: string;

  slogan: string;

  ctaLabel?: string | null;

  selectorLabel?: string | null;

  selectorPlaceholder?: string | null;

  locale?: string;

  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;
};

type LandingPageResponse = {
  data: StrapiLandingPage | null;
};

export async function getLandingPage(
  locale: "fr" | "eu"
): Promise<LandingPageResponse> {
  return fetchStrapi<LandingPageResponse>(
    "landing-page",
    `?locale=${locale}`
  );
}