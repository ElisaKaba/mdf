import Link from "next/link";
import { notFound } from "next/navigation";

import RegistrationForm from "@/components/events/RegistrationForm";

import { getEvents } from "@/lib/strapi/events";
import { mapStrapiEvent } from "@/lib/strapi/mapEvent";

import styles from "./page.module.css";

type Locale = "fr" | "eu";

type EventDetailPageProps = {
  params: Promise<{
    houseSlug: string;
    slug: string;
  }>;

  searchParams: Promise<{
    lang?: string;
  }>;
};

function formatDate(
  date: string,
  locale: Locale
) {
  return new Intl.DateTimeFormat(
    locale === "fr"
      ? "fr-FR"
      : "eu-ES",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  ).format(
    new Date(`${date}T00:00:00`)
  );
}

function formatPrice(
  pricingType:
    | "free"
    | "fixed"
    | "pay_what_you_want"
    | undefined,

  price: number | undefined,

  locale: Locale
) {
  if (pricingType === "free") {
    return locale === "fr"
      ? "Gratuit"
      : "Doan";
  }

  if (
    pricingType ===
    "pay_what_you_want"
  ) {
    return locale === "fr"
      ? "Prix libre"
      : "Prezio librea";
  }

  if (
    pricingType === "fixed" &&
    typeof price === "number"
  ) {
    return new Intl.NumberFormat(
      locale === "fr"
        ? "fr-FR"
        : "eu-ES",
      {
        style: "currency",
        currency: "EUR",
      }
    ).format(price);
  }

  return null;
}

export default async function EventDetailPage({
  params,
  searchParams,
}: EventDetailPageProps) {
  const { houseSlug, slug } =
    await params;

  const { lang } =
    await searchParams;

  const locale: Locale =
    lang === "eu"
      ? "eu"
      : "fr";

  /*
   * On récupère directement
   * la bonne locale Strapi.
   */
  const response =
    await getEvents(locale);

  const event =
    response.data
      .filter(
        (item) =>
          item.house?.slug ===
          houseSlug
      )
      .map(mapStrapiEvent)
      .find(
        (item) =>
          item.slug === slug
      );

  if (!event) {
    notFound();
  }

  const priceLabel =
    formatPrice(
      event.pricingType,
      event.price,
      locale
    );

  const labels =
    locale === "fr"
      ? {
          back:
            "Retour à l’agenda",

          location:
            "Lieu",

          time:
            "Horaire",

          capacity:
            "Capacité",

          participants:
            "participantes",

          price:
            "Tarif",

          timeSeparator:
            "à",
        }
      : {
          back:
            "Agendara itzuli",

          location:
            "Lekua",

          time:
            "Ordutegia",

          capacity:
            "Edukiera",

          participants:
            "parte-hartzaile",

          price:
            "Prezioa",

          timeSeparator:
            "-",
        };

  return (
    <article className={styles.article}>
    
      <div className={styles.backArea}>
        <Link
          href={`/${houseSlug}/agenda?lang=${locale}`}
          className={styles.backLink}
        >
          <span aria-hidden="true">
            ←
          </span>

          <span>
            {labels.back}
          </span>
        </Link>
      </div>

      <div className={styles.eventHeader}>
        <p className={styles.date}>
          {formatDate(
            event.startDate,
            locale
          )}
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
            <strong>
              {labels.location} :
            </strong>{" "}
            {event.location}
          </p>
        )}

        {event.startTime && (
          <p>
            <strong>
              {labels.time} :
            </strong>{" "}
            {event.startTime}

            {event.endTime && (
              <>
                {" "}
                {labels.timeSeparator}
                {" "}
                {event.endTime}
              </>
            )}
          </p>
        )}

        {event.capacity && (
          <p>
            <strong>
              {labels.capacity} :
            </strong>{" "}
            {event.capacity}{" "}
            {labels.participants}
          </p>
        )}

        {priceLabel && (
          <p>
            <strong>
              {labels.price} :
            </strong>{" "}
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