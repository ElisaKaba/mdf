"use client";

import Image from "next/image";
import {
  useState,
} from "react";
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

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ??
  "http://localhost:1337";

function getMediaUrl(
  path?: string | null
) {
  if (!path) {
    return undefined;
  }

  if (
    path.startsWith("http://") ||
    path.startsWith("https://")
  ) {
    return path;
  }

  return `${STRAPI_URL}${path}`;
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
            event.category ===
            filter
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
          openPlanning:
            "Ouvrir le planning",
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
          openPlanning:
            "Egutegia ireki",
        };

  const planning =
    agendaPage?.monthlyPlanning;

  const planningUrl =
    getMediaUrl(
      planning?.url
    );

  const isPdf =
    planning?.mime ===
      "application/pdf" ||
    planning?.url
      ?.toLowerCase()
      .endsWith(".pdf");

  const isImage =
    planning?.mime
      ?.toLowerCase()
      .startsWith("image/") ||
    /\.(png|jpg|jpeg|webp)$/i.test(
      planning?.url ?? ""
    );

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
          <h2
            className={
              styles.planningTitle
            }
          >
            {agendaPage?.planningTitle ??
              (locale === "fr"
                ? "Planning mensuel"
                : "Hileko egutegia")}
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
   <div>
        <img src={"/images/Visuel les journées du Matrimoine.png"} alt="MatrimoineFr" className="localeMatrimoineImg"/>
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

            </div>
          )}

      {planningUrl && (
        <section
          className={
            styles.planningSection
          }
        >
      

       

          {isImage && (
            <div
              className={
                styles.planningImageWrapper
              }
            >
              <Image
                src={
                  planningUrl
                }
                alt={
                  planning?.alternativeText?.trim() ||
                  agendaPage?.planningTitle ||
                  labels.title
                }
                width={700}
                height={500}
                className={
                  styles.planningImage
                }
              />
            </div>
          )}

          {isPdf && (
            <a
              href={
                planningUrl
              }
              target="_blank"
              rel="noopener noreferrer"
              className={
                styles.planningButton
              }
            >
              {
                labels.openPlanning
              }
            </a>
          )}

         
        </section>
      )}

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