import type { BlocksContent } from "@strapi/blocks-react-renderer";

import { fetchStrapi } from "./client";

export type StrapiAction = {
  id: number;
  documentId: string;

  title: string;
  slug: string;

  summary?: string;
  description?: BlocksContent;

  category?:
    | "atelier"
    | "accompagnement"
    | "prevention"
    | "sensibilisation"
    | "autre";

  locale: string;

  image?: {
    id: number;
    documentId: string;
    name?: string;
    alternativeText?: string;
    caption?: string;
    width?: number;
    height?: number;
    url: string;

    formats?: {
      thumbnail?: {
        url: string;
      };
      small?: {
        url: string;
      };
      medium?: {
        url: string;
      };
      large?: {
        url: string;
      };
    };
  };

  house?: {
    id: number;
    documentId: string;
    name: string;
    slug: string;
  };
};

type StrapiActionsResponse = {
  data: StrapiAction[];
};

export async function getActions(
  locale: "fr" | "eu"
): Promise<StrapiActionsResponse> {
  return fetchStrapi<StrapiActionsResponse>(
    "actions",
    `?locale=${locale}&populate[house]=true&populate[image]=true`
  );
}