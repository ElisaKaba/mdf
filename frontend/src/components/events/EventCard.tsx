import Link from "next/link";

import type { Event } from "@/types/event";

import styles from "./EventCard.module.css";

type EventCardProps = {
  event: Event;
  locale: "fr" | "eu";
};

function formatDate(date: string, locale: "fr" | "eu") {
  return new Intl.DateTimeFormat(
    locale === "fr" ? "fr-FR" : "eu-ES",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  ).format(new Date(`${date}T00:00:00`));
}

function formatPrice(
  event: Event,
  locale: "fr" | "eu"
) {
  if (event.pricingType === "free") {
    return locale === "fr" ? "Gratuit" : "Doan";
  }

  if (event.pricingType === "pay_what_you_want") {
    return locale === "fr" ? "Prix libre" : "Prezio librea";
  }

  if (
    event.pricingType === "fixed" &&
    typeof event.price === "number"
  ) {
    return new Intl.NumberFormat(
      locale === "fr" ? "fr-FR" : "eu-ES",
      {
        style: "currency",
        currency: "EUR",
      }
    ).format(event.price);
  }

  return null;
}

export default function EventCard({
  event,
  locale,
}: EventCardProps) {
  const timeSeparator = locale === "fr" ? "à" : "-";
  const priceLabel = formatPrice(event, locale);

  return (
    <article className={styles.card}>
      <Link
        href={`/${event.houseSlug}/agenda/${event.slug}`}
        className={styles.link}
      >
        <p className={styles.date}>
          {formatDate(event.startDate, locale)}

          {event.startTime && (
            <>
              {" — "}
              {event.startTime}

              {event.endTime && (
                <>
                  {" "}
                  {timeSeparator}{" "}
                  {event.endTime}
                </>
              )}
            </>
          )}
        </p>

        <h2>{event.title}</h2>

        {event.summary && (
          <p className={styles.summary}>
            {event.summary}
          </p>
        )}

        {event.location && (
          <p className={styles.location}>
            {event.location}
          </p>
        )}

        {priceLabel && (
          <p className={styles.price}>
            {priceLabel}
          </p>
        )}
      </Link>
    </article>
  );
}