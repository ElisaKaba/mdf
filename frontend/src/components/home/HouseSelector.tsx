"use client";

import type { StrapiHouse } from "@/lib/strapi/houses";

import styles from "./HouseSelector.module.css";

type HouseSelectorProps = {
  houses: StrapiHouse[];
  value: string;
  onChange: (slug: string) => void;
};

export default function HouseSelector({
  houses,
  value,
  onChange,
}: HouseSelectorProps) {
  return (
    <div className={styles.wrapper}>
      <label
        htmlFor="house-selector"
        className={styles.label}
      >
        Choisir ma Maison des Femmes
      </label>

      <select
        id="house-selector"
        className={styles.select}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
      >
        <option value="" disabled>
          Sélectionner une maison
        </option>

        {houses.map((house) => (
          <option
            key={house.documentId}
            value={house.slug}
          >
            {house.city}
          </option>
        ))}
      </select>
    </div>
  );
}