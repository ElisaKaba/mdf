import type { BlocksContent } from "@strapi/blocks-react-renderer";

import { fetchStrapi } from "./client";

export type StrapiAboutPage = {
  id: number;
  documentId: string;

  title: string;
  slug: string;

  summary?: string | null;

  description?: BlocksContent | null;

  locale: string;

  displayOrder?: number | null;

  image?: Array<{
    id: number;
    documentId: string;

    name?: string;
    alternativeText?: string | null;

    width?: number;
    height?: number;

    url: string;
  }> | null;

  house?: {
    id: number;
    documentId: string;

    name: string;
    slug: string;
  } | null;
};

type StrapiAboutPageResponse = {
  data: StrapiAboutPage[];
};

export async function getAboutPages(
  locale: "fr" | "eu"
): Promise<StrapiAboutPageResponse> {
  return fetchStrapi<StrapiAboutPageResponse>(
    "about-pages",
    `?locale=${locale}&populate=*`
  );
}