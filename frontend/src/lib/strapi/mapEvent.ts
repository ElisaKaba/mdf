import type { Event } from "@/types/event";
import type { StrapiEvent } from "./events";

function formatDateInParis(date: Date) {
  const parts = new Intl.DateTimeFormat(
    "fr-CA",
    {
      timeZone: "Europe/Paris",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }
  ).formatToParts(date);

  const year =
    parts.find((part) => part.type === "year")
      ?.value ?? "";

  const month =
    parts.find((part) => part.type === "month")
      ?.value ?? "";

  const day =
    parts.find((part) => part.type === "day")
      ?.value ?? "";

  return `${year}-${month}-${day}`;
}

function formatTimeInParis(date: Date) {
  const parts = new Intl.DateTimeFormat(
    "fr-FR",
    {
      timeZone: "Europe/Paris",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }
  ).formatToParts(date);

  const hour =
    parts.find((part) => part.type === "hour")
      ?.value ?? "";

  const minute =
    parts.find((part) => part.type === "minute")
      ?.value ?? "";

  return `${hour}:${minute}`;
}

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
      formatDateInParis(start),

    startTime:
      formatTimeInParis(start),

    endTime: end
      ? formatTimeInParis(end)
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