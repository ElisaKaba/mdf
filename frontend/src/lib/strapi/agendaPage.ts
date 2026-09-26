import type { BlocksContent } from "@strapi/blocks-react-renderer";

import { fetchStrapi } from "./client";

export type StrapiAgendaPage = {
  id: number;
  documentId: string;

  planningTitle?: string | null;

  description?: BlocksContent | null;

  additionalInfo?: BlocksContent | null;

  locale?: string;

  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;

  monthlyPlanning?: {
    id: number;
    documentId: string;

    name?: string;

    alternativeText?: string | null;

    caption?: string | null;

    width?: number;
    height?: number;

    formats?: unknown;

    hash?: string;

    ext?: string;

    mime?: string;

    size?: number;

    url: string;

    previewUrl?: string | null;

    provider?: string;

    provider_metadata?: unknown;

    createdAt?: string;

    updatedAt?: string;

    publishedAt?: string | null;
  } | null;
};

type AgendaPageResponse = {
  data: StrapiAgendaPage | null;
};

export async function getAgendaPage(
  locale: "fr" | "eu"
): Promise<AgendaPageResponse> {
  return fetchStrapi<AgendaPageResponse>(
    "agenda-page",
    `?locale=${locale}&populate=*`
  );
}