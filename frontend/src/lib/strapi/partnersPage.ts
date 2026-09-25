import { fetchStrapi } from "./client";

export type StrapiPartnersPage = {
  id: number;
  documentId: string;

  locale?: string;

  partnersImg?: {
    id: number;
    documentId: string;

    name?: string;
    alternativeText?: string | null;

    width?: number;
    height?: number;

    url: string;
  } | null;

  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;
};

type PartnersPageResponse = {
  data: StrapiPartnersPage | null;
};

export async function getPartnersPage(
  locale: "fr" | "eu"
): Promise<PartnersPageResponse> {
  return fetchStrapi<PartnersPageResponse>(
    "partner-page",
    `?locale=${locale}&populate=*`
  );
}