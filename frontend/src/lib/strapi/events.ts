import { fetchStrapi } from "./client";

export type StrapiEvent = {
  id: number;
  documentId: string;

  title: string;
  slug: string;

  summary?: string;
  description?: string;

  category:
    | "atelier"
    | "permanence"
    | "evenement";

  startTime: string;
  endTime?: string;

  location?: string;

  registrationRequired?: boolean;
  registrationDeadline?: string;
  capacity?: number;

  pricingType?:
    | "free"
    | "fixed"
    | "pay_what_you_want";

  price?: number | null;

  locale: string;

  house?: {
    id: number;
    documentId: string;
    name: string;
    slug: string;
  };
};

type StrapiEventsResponse = {
  data: StrapiEvent[];
};

export async function getEvents(
  locale: "fr" | "eu"
): Promise<StrapiEventsResponse> {
  return fetchStrapi<StrapiEventsResponse>(
    "events",
    `?locale=${locale}&populate=house`
  );
}