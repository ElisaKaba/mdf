import type { Event } from "@/types/event";
import type { StrapiEvent } from "./events";

export function mapStrapiEvent(
  event: StrapiEvent
): Event {
  const start = new Date(event.startTime);

  const end = event.endTime
    ? new Date(event.endTime)
    : undefined;

  return {
    id: event.documentId,
    slug: event.slug,

    title: event.title,
    summary: event.summary,
    description: event.description,

    category: event.category,

    startDate:
      start.toISOString().slice(0, 10),

    startTime:
      start.toISOString().slice(11, 16),

    endTime: end
      ? end.toISOString().slice(11, 16)
      : undefined,

    location: event.location,

    registrationRequired:
      event.registrationRequired,

    registrationDeadline:
      event.registrationDeadline,

    capacity: event.capacity,

    pricingType: event.pricingType,

    price:
      event.price ?? undefined,

    houseSlug:
      event.house?.slug ?? "",
  };
}