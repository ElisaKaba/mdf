import type { BlocksContent } from "@strapi/blocks-react-renderer";

import { fetchStrapi } from "./client";

export type StrapiJoin = {
  id: number;
  documentId: string;

  title: string;

  description?: BlocksContent | string | null;

  volunteerTitle?: string | null;
  volunteerText?: BlocksContent | string | null;

  patronTitle?: string | null;
  patronText?: BlocksContent | string | null;

  financialTitle?: string | null;
  financialText?: BlocksContent | string | null;

  locale: string;

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
  localizations?: StrapiJoin[];
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