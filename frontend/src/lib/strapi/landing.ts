import { fetchStrapi } from "./client";

export type StrapiLandingPage = {
  id: number;
  documentId: string;

  slogan: string;
  ctaLabel?: string | null;

  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;
};

type LandingPageResponse = {
  data: StrapiLandingPage | null;
};

export async function getLandingPage(): Promise<LandingPageResponse> {
  return fetchStrapi<LandingPageResponse>(
    "landing-page",
    ""
  );
}