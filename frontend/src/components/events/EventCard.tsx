import Link from "next/link";

import type { Event } from "@/types/event";

import { formatDate } from "@/lib/date";

import styles from "./EventCard.module.css";

type EventCardProps = {
  event: Event;
  locale: "fr" | "eu";
};

function formatPrice(
  event: Event,
  locale: "fr" | "eu"
) {
  if (event.pricingType === "free") {
    return locale === "fr"
      ? "Gratuit"
      : "Doan";
  }

  if (
    event.pricingType ===
    "pay_what_you_want"
  ) {
    return locale === "fr"
      ? "Prix libre"
      : "Prezio librea";
  }

  if (
    event.pricingType === "fixed" &&
    typeof event.price === "number"
  ) {
    return new Intl.NumberFormat(
      locale === "fr"
        ? "fr-FR"
        : "eu-ES",
      {
        style: "currency",
        currency: "EUR",
      }
    ).format(event.price);
  }

  return null;
}

function cleanTime(
  time?: string | null
) {
  if (!time) {
    return null;
  }

  return time.slice(0, 5);
}

export default function EventCard({
  event,
  locale,
}: EventCardProps) {
  const timeSeparator =
    locale === "fr" ? "à" : "-";

  const priceLabel =
    formatPrice(event, locale);

  const registrationLabel =
    locale === "fr"
      ? "Sur inscription"
      : "Izen-ematea beharrezkoa";

  const startTime =
    cleanTime(event.startTime);

  const endTime =
    cleanTime(event.endTime);

  const detailUrl =
    `/${event.houseSlug}/agenda/${event.slug}?lang=${locale}`;

  return (
    <article className={styles.card}>
      <Link
        href={detailUrl}
        className={styles.link}
      >
        <p className={styles.date}>
          {formatDate(
            event.startDate,
            locale
          )}

          {startTime && (
            <>
              {" — "}
              {startTime}

              {endTime && (
                <>
                  {" "}
                  {timeSeparator}
                  {" "}
                  {endTime}
                </>
              )}
            </>
          )}
        </p>

        <h2>
          {event.title}
        </h2>

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

        {(priceLabel ||
          event.registrationRequired) && (
          <div className={styles.meta}>
            {priceLabel && (
              <p className={styles.price}>
                {priceLabel}
              </p>
            )}

            {event.registrationRequired && (
              <span
                className={
                  styles.registrationBadge
                }
              >
                {registrationLabel}
              </span>
            )}
          </div>
        )}
      </Link>
    </article>
  );
}