"use client";

import Image from "next/image";
import { useState } from "react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";
import {
  BlocksRenderer,
} from "@strapi/blocks-react-renderer";

import Pill from "@/components/ui/Pill";
import EventCard from "@/components/events/EventCard";

import type {
  Event,
  EventCategory,
} from "@/types/event";

import type {
  StrapiAgendaPage,
} from "@/lib/strapi/agendaPage";

import styles from "./AgendaPage.module.css";

type AgendaPageProps = {
  eventsFr: Event[];
  eventsEu: Event[];

  agendaPageFr?: StrapiAgendaPage | null;
  agendaPageEu?: StrapiAgendaPage | null;
};

type Filter =
  | "tous"
  | EventCategory;

type Locale =
  | "fr"
  | "eu";

function getMatrimoineImage(
  locale: Locale
) {
  if (locale === "fr") {
    return {
      src: "/images/Visuel les journées du Matrimoine.png",
      alt: "Affiche des Journées du Matrimoine",
    };
  }

  return {
    src: "/images/Visuel les journées du Matrimoine_eu.png",
    alt: "Matrimonioaren Jardunaldien afixa",
  };
}

export default function AgendaPage({
  eventsFr,
  eventsEu,
  agendaPageFr,
  agendaPageEu,
}: AgendaPageProps) {
  const router =
    useRouter();

  const searchParams =
    useSearchParams();

  const initialLocale: Locale =
    searchParams.get("lang") === "eu"
      ? "eu"
      : "fr";

  const [
    filter,
    setFilter,
  ] =
    useState<Filter>("tous");

  const [
    locale,
    setLocale,
  ] =
    useState<Locale>(
      initialLocale
    );

  const matrimoineImage =
    getMatrimoineImage(locale);

  function changeLocale(
    newLocale: Locale
  ) {
    setLocale(newLocale);

    const params =
      new URLSearchParams(
        searchParams.toString()
      );

    params.set(
      "lang",
      newLocale
    );

    router.replace(
      `?${params.toString()}`,
      {
        scroll: false,
      }
    );
  }

  const events =
    locale === "fr"
      ? eventsFr
      : eventsEu;

  const agendaPage =
    locale === "fr"
      ? agendaPageFr
      : agendaPageEu;

  const filteredEvents =
    filter === "tous"
      ? events
      : events.filter(
          (event) =>
            event.category === filter
        );

  const labels =
    locale === "fr"
      ? {
          title: "Agenda",
          all: "Tous",
          workshops: "Ateliers",
          permanences:
            "Permanences",
          events: "Événements",
          switchLanguage:
            "Euskaraz",
        }
      : {
          title: "Agenda",
          all: "Guztiak",
          workshops: "Tailerrak",
          permanences:
            "Permanenteak",
          events: "Ekitaldiak",
          switchLanguage:
            "Français",
        };

  return (
    <section
      className={styles.agenda}
    >
      <div
        className={styles.header}
      >
        <h1>
          {labels.title}
        </h1>

        <button
          type="button"
          className={
            styles.languageButton
          }
          onClick={() =>
            changeLocale(
              locale === "fr"
                ? "eu"
                : "fr"
            )
          }
        >
          {
            labels.switchLanguage
          }
        </button>
      </div>

      <section
        className={
          styles.planningSection
        }
      >
        <h2
          className={
            styles.planningTitle
          }
        >
          {agendaPage?.planningTitle ??
            (locale === "fr"
              ? "Journées du Matrimoine"
              : "Matrimonioaren Jardunaldiak")}
        </h2>

        {agendaPage?.description && (
          <div
            className={`richText ${styles.planningDescription}`}
          >
            <BlocksRenderer
              content={
                agendaPage.description
              }
            />
          </div>
        )}

        <div
          className={
            styles.planningImageWrapper
          }
        >
          <Image
            src={
              matrimoineImage.src
            }
            alt={
              matrimoineImage.alt
            }
            width={900}
            height={1200}
            className={
              styles.planningImage
            }
            priority
          />
        </div>

        {agendaPage?.additionalInfo && (
          <div
            className={`richText ${styles.additionalInfo}`}
          >
            <BlocksRenderer
              content={
                agendaPage.additionalInfo
              }
            />
          </div>
        )}
      </section>

      <div
        className={styles.filters}
      >
        <Pill
          label={labels.all}
          active={
            filter === "tous"
          }
          onClick={() =>
            setFilter("tous")
          }
        />

        <Pill
          label={
            labels.workshops
          }
          active={
            filter === "atelier"
          }
          onClick={() =>
            setFilter("atelier")
          }
        />

        <Pill
          label={
            labels.permanences
          }
          active={
            filter ===
            "permanence"
          }
          onClick={() =>
            setFilter(
              "permanence"
            )
          }
        />

        <Pill
          label={
            labels.events
          }
          active={
            filter ===
            "evenement"
          }
          onClick={() =>
            setFilter(
              "evenement"
            )
          }
        />
      </div>

      <div
        className={styles.events}
      >
        {filteredEvents.map(
          (event) => (
            <EventCard
              key={event.id}
              event={event}
              locale={locale}
            />
          )
        )}
      </div>
    </section>
  );
}