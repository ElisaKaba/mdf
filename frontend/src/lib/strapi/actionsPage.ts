import type { BlocksContent } from "@strapi/blocks-react-renderer";

import { fetchStrapi } from "./client";

export type StrapiActionsPage = {
  id: number;
  documentId: string;

  actionsTitle?: string | null;
  actionsIntro?: BlocksContent | null;

  whereWeAreGoingTitle?: string | null;
  whereWeAreGoing?: BlocksContent | null;

  locale: string;
};

type StrapiActionsPageResponse = {
  data: StrapiActionsPage | null;
};

export async function getActionsPage(
  locale: "fr" | "eu"
): Promise<StrapiActionsPageResponse> {
  return fetchStrapi<StrapiActionsPageResponse>(
    "actions-page",
    `?locale=${locale}`
  );
}