import { fetchStrapi } from "./client";

export type StrapiHouse = {
  id: number;
  documentId: string;

  name: string;
  slug: string;
  city: string;

  address?: string | null;
  email?: string | null;
  phone?: string | null;

  facebookUrl?: string | null;
  instagramUrl?: string | null;
  donationUrl?: string | null;

  locale: string;
};

type StrapiHousesResponse = {
  data: StrapiHouse[];
};

export async function getHouses(
  locale: "fr" | "eu" = "fr"
): Promise<StrapiHousesResponse> {
  return fetchStrapi<StrapiHousesResponse>(
    "houses",
    `?locale=${locale}&populate=*`
  );
}