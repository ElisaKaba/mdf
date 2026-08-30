import AgendaPage from "@/components/events/AgendaPage";
import { getEvents } from "@/lib/strapi/events";
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

  const [responseFr, responseEu] = await Promise.all([
    getEvents("fr"),
    getEvents("eu"),
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
    />
  );
}