import Link from "next/link";
import { notFound } from "next/navigation";

import RegistrationForm from "@/components/events/RegistrationForm";
import { getEvents } from "@/lib/strapi/events";
import { mapStrapiEvent } from "@/lib/strapi/mapEvent";

import styles from "./page.module.css";

type EventDetailPageProps = {
  params: Promise<{
    houseSlug: string;
    slug: string;
  }>;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function formatPrice(
  pricingType?: "free" | "fixed" | "pay_what_you_want",
  price?: number
) {
  if (pricingType === "free") {
    return "Gratuit";
  }

  if (pricingType === "pay_what_you_want") {
    return "Prix libre";
  }

  if (
    pricingType === "fixed" &&
    typeof price === "number"
  ) {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  }

  return null;
}

export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  const { houseSlug, slug } = await params;

  const response = await getEvents("fr");

  const event = response.data
    .filter((item) => item.house?.slug === houseSlug)
    .map(mapStrapiEvent)
    .find((item) => item.slug === slug);

  if (!event) {
    notFound();
  }

  const priceLabel = formatPrice(
    event.pricingType,
    event.price
  );

  return (
    <article className={styles.article}>
      <div className={styles.backArea}>
        <Link
          href={`/${houseSlug}/agenda`}
          className={styles.backLink}
        >
          <span aria-hidden="true">←</span>
          <span>Retour à l’agenda</span>
        </Link>
      </div>

      <div className={styles.eventHeader}>
        <p className={styles.date}>
          {formatDate(event.startDate)}
        </p>

        <h1 className={styles.title}>
          {event.title}
        </h1>

        {event.summary && (
          <p className={styles.summary}>
            {event.summary}
          </p>
        )}
      </div>

      {event.description && (
        <p className={styles.description}>
          {event.description}
        </p>
      )}

      <div className={styles.information}>
        {event.location && (
          <p>
            <strong>Lieu :</strong>{" "}
            {event.location}
          </p>
        )}

        {event.startTime && (
          <p>
            <strong>Horaire :</strong>{" "}
            {event.startTime}
            {event.endTime &&
              ` à ${event.endTime}`}
          </p>
        )}

        {event.capacity && (
          <p>
            <strong>Capacité :</strong>{" "}
            {event.capacity} participantes
          </p>
        )}

        {priceLabel && (
          <p>
            <strong>Tarif :</strong>{" "}
            {priceLabel}
          </p>
        )}
      </div>

      {event.registrationRequired && (
        <RegistrationForm
          eventId={event.id}
          eventTitle={event.title}
          houseSlug={houseSlug}
        />
      )}
    </article>
  );
}