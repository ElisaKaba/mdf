import type { BlocksContent } from "@strapi/blocks-react-renderer";

import { fetchStrapi } from "./client";

export type StrapiJoin = {
  id: number;
  documentId: string;

  title: string;
  slug: string;

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

type StrapiJoinResponse = {
  data: StrapiJoin[];
};

export async function getJoinContents(
  locale: "fr" | "eu"
): Promise<StrapiJoinResponse> {
  return fetchStrapi<StrapiJoinResponse>(
    "joins",
    `?locale=${locale}&populate=*`
  );
}