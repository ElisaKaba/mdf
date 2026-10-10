import { fetchStrapi } from "./client";
import type { BlocksContent } from "@strapi/blocks-react-renderer";

export type StrapiPrivacyPage = {
  id: number;
  documentId: string;

  title: string;

  content: BlocksContent;

  lastUpdated?: string | null;

  locale?: string;

  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;
};

type PrivacyPageResponse = {
  data: StrapiPrivacyPage | null;
};

export async function getPrivacyPage(
  locale: "fr" | "eu"
): Promise<PrivacyPageResponse> {
  return fetchStrapi<PrivacyPageResponse>(
    "privacy-page",
    `?locale=${locale}`
  );
}