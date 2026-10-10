import { fetchStrapi } from "./client";
import type {
  BlocksContent,
} from "@strapi/blocks-react-renderer";

export type StrapiLegalPage = {
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

type LegalPageResponse = {
  data: StrapiLegalPage | null;
};

export async function getLegalPage(
  locale: "fr" | "eu"
): Promise<LegalPageResponse> {
  return fetchStrapi<LegalPageResponse>(
    "legal-page",
    `?locale=${locale}`
  );
}