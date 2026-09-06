import type { BlocksContent } from "@strapi/blocks-react-renderer";

import { fetchStrapi } from "./client";

export type StrapiActionImage = {
  id: number;
  documentId: string;

  name?: string;
  alternativeText?: string | null;

  width?: number;
  height?: number;

  url: string;
};

export type StrapiAction = {
  id: number;
  documentId: string;

  title: string;
  slug: string;

  summary?: string | null;

  description?: BlocksContent | null;

  category?: string | null;

  displayOrder?: number | null;

  locale: string;

  image?: StrapiActionImage[] | null;

  house?: {
    id: number;
    documentId: string;

    name: string;
    slug: string;
  } | null;
};

type StrapiActionsResponse = {
  data: StrapiAction[];
};

export async function getActions(
  locale: "fr" | "eu"
): Promise<StrapiActionsResponse> {
  return fetchStrapi<StrapiActionsResponse>(
    "actions",
    `?locale=${locale}&populate=*`
  );
}