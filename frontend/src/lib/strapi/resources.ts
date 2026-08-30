import type { BlocksContent } from "@strapi/blocks-react-renderer";

import { fetchStrapi } from "./client";

export type StrapiResource = {
  id: number;
  documentId: string;

  title: string;
  slug: string;

  summary?: string;
  description?: BlocksContent;

  category?:
    | "juridique"
    | "sante"
    | "social"
    | "prevention"
    | "documentation"
    | "autre";

  externalUrl?: string | null;

  locale: string;

  image?: {
    id: number;
    documentId: string;

    name?: string;
    alternativeText?: string | null;

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

type StrapiResourcesResponse = {
  data: StrapiResource[];
};

export async function getResources(
  locale: "fr" | "eu"
): Promise<StrapiResourcesResponse> {
  return fetchStrapi<StrapiResourcesResponse>(
    "resources",
    `?locale=${locale}&populate=*`
  );
}