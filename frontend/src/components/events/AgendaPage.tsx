"use client";

import { useState } from "react";

import Pill from "@/components/ui/Pill";
import type { Event, EventCategory } from "@/types/event";
import EventCard from "@/components/events/EventCard";
import styles from "./AgendaPage.module.css";

type AgendaPageProps = {
  eventsFr: Event[];
  eventsEu: Event[];
};

type Filter = "tous" | EventCategory;
type Locale = "fr" | "eu";

export default function AgendaPage({
  eventsFr,
  eventsEu,
}: AgendaPageProps) {
  const [filter, setFilter] = useState<Filter>("tous");
  const [locale, setLocale] = useState<Locale>("fr");

  const events = locale === "fr" ? eventsFr : eventsEu;

  const filteredEvents =
    filter === "tous"
      ? events
      : events.filter((event) => event.category === filter);

  const labels =
    locale === "fr"
      ? {
          title: "Agenda",
          all: "Tous",
          workshops: "Ateliers",
          permanences: "Permanences",
          events: "Événements",
          switchLanguage: "Euskaraz",
          from: "à",
        }
      : {
          title: "Agenda",
          all: "Guztiak",
          workshops: "Tailerrak",
          permanences: "Permanenteak",
          events: "Ekitaldiak",
          switchLanguage: "Français",
          from: "-",
        };

  return (
    <section className={styles.agenda}>
      <div className={styles.header}>
        <h1>{labels.title}</h1>

        <button
          type="button"
          className={styles.languageButton}
          onClick={() =>
            setLocale((current) =>
              current === "fr" ? "eu" : "fr"
            )
          }
        >
          {labels.switchLanguage}
        </button>
      </div>

      <div className={styles.filters}>
        <Pill
          label={labels.all}
          active={filter === "tous"}
          onClick={() => setFilter("tous")}
        />

        <Pill
          label={labels.workshops}
          active={filter === "atelier"}
          onClick={() => setFilter("atelier")}
        />

        <Pill
          label={labels.permanences}
          active={filter === "permanence"}
          onClick={() => setFilter("permanence")}
        />

        <Pill
          label={labels.events}
          active={filter === "evenement"}
          onClick={() => setFilter("evenement")}
        />
      </div>

      <div className={styles.events}>
      {filteredEvents.map((event) => (
  <EventCard
    key={event.id}
    event={event}
    locale={locale}
  />
))}
      </div>
    </section>
  );
}