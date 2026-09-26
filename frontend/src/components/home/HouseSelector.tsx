"use client";

import type { StrapiHouse } from "@/lib/strapi/houses";

import styles from "./HouseSelector.module.css";

type HouseSelectorProps = {
  houses: StrapiHouse[];

  value: string;

  onChange: (
    value: string
  ) => void;

  label: string;

  placeholder: string;
};

export default function HouseSelector({
  houses,
  value,
  onChange,
  label,
  placeholder,
}: HouseSelectorProps) {
  return (
    <div className={styles.wrapper}>
      <label
        htmlFor="house-selector"
        className={styles.label}
      >
        {label}
      </label>

      <select
        id="house-selector"
        className={styles.select}
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
      >
        <option
          value=""
          disabled
        >
          {placeholder}
        </option>

        {houses.map(
          (house) => (
            <option
              key={
                house.documentId
              }
              value={house.slug}
            >
              {house.name}
            </option>
          )
        )}
      </select>
    </div>
  );
}