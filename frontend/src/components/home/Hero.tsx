"use client";

import { useState } from "react";
import Image from "next/image";

import Button from "@/components/ui/Button";
import HouseSelector from "@/components/home/HouseSelector";

import type { StrapiHouse } from "@/lib/strapi/houses";

import styles from "./Hero.module.css";

type HeroProps = {
  houses?: StrapiHouse[];
};

export default function Hero({
  houses = [],
}: HeroProps) {
  const [houseSlug, setHouseSlug] = useState("");

  const selectedHouse = houses.find(
    (house) => house.slug === houseSlug
  );

  return (
    <main className={styles.hero}>
      <header className={styles.header}>
        <Image
          src="/images/logo-horizontal-400.png"
          alt="Maison des Femmes — Emazteen Etxea"
          width={650}
          height={160}
          priority
          className={styles.logo}
        />

        <p className={styles.intro}>
          Un lieu d’accueil, d’écoute et d’action pour les femmes
          du Pays Basque.
        </p>
      </header>

      <div className={styles.imageWrapper}>
        <Image
          src="/images/femmes-bandeau-nb.png"
          alt=""
          width={1600}
          height={700}
          priority
          className={styles.heroImage}
        />
      </div>

      <section className={styles.selectorSection}>
        <HouseSelector
          houses={houses}
          value={houseSlug}
          onChange={setHouseSlug}
        />

        <Button
          href={
            selectedHouse
              ? `/${selectedHouse.slug}/qui-sommes-nous`
              : undefined
          }
          disabled={!selectedHouse}
          className={styles.discoverButton}
        >
          Découvrir cette maison
        </Button>
      </section>
    </main>
  );
}