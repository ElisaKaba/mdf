import AgendaPage from "@/components/events/AgendaPage";
import { headers } from "next/headers";
import { getDefaultLocaleFromHost } from "@/lib/i18n/getDefaultLocale";
import { getEvents } from "@/lib/strapi/events";
import { getAgendaPage } from "@/lib/strapi/agendaPage";
import { mapStrapiEvent } from "@/lib/strapi/mapEvent";

import type { Event } from "@/types/event";

type AgendaRouteProps = {
  params: Promise<{
    houseSlug: string;
  }>;
};

function sortEventsByDate(events: Event[]) {
  return [...events].sort((a, b) => {
    const dateA = new Date(
      `${a.startDate}T${a.startTime ?? "00:00"}`
    ).getTime();

    const dateB = new Date(
      `${b.startDate}T${b.startTime ?? "00:00"}`
    ).getTime();

    return dateA - dateB;
  });
}

export default async function AgendaRoute({
  params,
}: AgendaRouteProps) {
  const { houseSlug } = await params;
  const headersList = await headers();
const host = headersList.get("host");

const defaultLocale =
  getDefaultLocaleFromHost(host);

  const [
    responseFr,
    responseEu,
    agendaPageFrResponse,
    agendaPageEuResponse,
  ] = await Promise.all([
    getEvents("fr"),
    getEvents("eu"),
    getAgendaPage("fr"),
    getAgendaPage("eu"),
  ]);

  const eventsFr = sortEventsByDate(
    responseFr.data
      .filter(
        (event) =>
          event.house?.slug === houseSlug
      )
      .map(mapStrapiEvent)
  );

  const eventsEu = sortEventsByDate(
    responseEu.data
      .filter(
        (event) =>
          event.house?.slug === houseSlug
      )
      .map(mapStrapiEvent)
  );

  return (
   <AgendaPage
  eventsFr={eventsFr}
  eventsEu={eventsEu}
  agendaPageFr={agendaPageFrResponse.data}
  agendaPageEu={agendaPageEuResponse.data}
  defaultLocale={defaultLocale}
/>
  );
}