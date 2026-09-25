import type { BlocksContent } from "@strapi/blocks-react-renderer";

import { fetchStrapi } from "./client";

export type PartnerCategory =
  | "works_with_us"
  | "funders"
  | "artists";

export type StrapiPartner = {
  id: number;
  documentId: string;

  name: string;

  description?: BlocksContent | null;

  websiteUrl?: string | null;

  category: PartnerCategory;

  displayOrder?: number | null;

  locale: string;

  logo?: {
    id: number;
    documentId: string;
    name?: string;
    alternativeText?: string | null;
    width?: number;
    height?: number;
    url: string;
  } | null;

  house?: {
    id: number;
    documentId: string;
    name: string;
    slug: string;
  } | null;
};

type StrapiPartnersResponse = {
  data: StrapiPartner[];
};

export async function getPartners(
  locale: "fr" | "eu"
): Promise<StrapiPartnersResponse> {
  return fetchStrapi<StrapiPartnersResponse>(
    "partners",
    `?locale=${locale}&populate=*&pagination[pageSize]=100`
  );
}