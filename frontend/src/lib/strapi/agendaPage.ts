import { fetchStrapi } from "./client";

export type StrapiAgendaPage = {
  id: number;
  documentId: string;

  planningTitle?: string | null;

  monthlyPlanning?: {
    id: number;
    documentId: string;
    name?: string;
    alternativeText?: string | null;
    mime?: string;
    url: string;
  } | null;

  locale: string;
};

type StrapiAgendaPageResponse = {
  data: StrapiAgendaPage | null;
};

export async function getAgendaPage(
  locale: "fr" | "eu"
): Promise<StrapiAgendaPageResponse> {
  return fetchStrapi<StrapiAgendaPageResponse>(
    "agenda-page",
    `?locale=${locale}&populate=*`
  );
}