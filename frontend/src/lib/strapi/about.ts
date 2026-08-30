import type { BlocksContent } from "@strapi/blocks-react-renderer";

import { fetchStrapi } from "./client";

export type StrapiAboutPage = {
  id: number;
  documentId: string;

  title: string;
  slug: string;

  summary?: string;
  description?: BlocksContent | string;

  locale: string;

  image?: Array<{
    id: number;
    documentId: string;
    name?: string;
    alternativeText?: string | null;
    width?: number;
    height?: number;
    url: string;
  }>;

  house?: {
    id: number;
    documentId: string;
    name: string;
    slug: string;
  };
};

type StrapiAboutResponse = {
  data: StrapiAboutPage[];
};

export async function getAboutPages(
  locale: "fr" | "eu"
): Promise<StrapiAboutResponse> {
  return fetchStrapi<StrapiAboutResponse>(
    "about-pages",
    `?locale=${locale}&populate=*`
  );
}