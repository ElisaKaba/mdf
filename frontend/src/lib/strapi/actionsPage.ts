import type { BlocksContent } from "@strapi/blocks-react-renderer";

import { fetchStrapi } from "./client";

export type StrapiActionsPage = {
  id: number;
  documentId: string;

  actionsTitle?: string | null;

  actionsIntro?: BlocksContent | null;

  locale?: string;

  image?: {
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

type ActionsPageResponse = {
  data: StrapiActionsPage | null;
};

export async function getActionsPage(
  locale: "fr" | "eu"
): Promise<ActionsPageResponse> {
  return fetchStrapi<ActionsPageResponse>(
    "actions-page",
    `?locale=${locale}&populate=*`
  );
}