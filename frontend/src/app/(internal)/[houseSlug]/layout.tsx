import type { ReactNode } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";

import Sidebar from "@/components/layout/Sidebar";
import { getHouses } from "@/lib/strapi/houses";

import styles from "../internal-layout.module.css";

type HouseLayoutProps = {
  children: ReactNode;
  params: Promise<{
    houseSlug: string;
  }>;
};

export default async function HouseLayout({
  children,
  params,
}: HouseLayoutProps) {
  const { houseSlug } = await params;

  const response = await getHouses("fr");

  const house = response.data.find(
    (item) => item.slug === houseSlug
  );

  if (!house) {
    notFound();
  }

  return (
    <div className={styles.layout}>
      <div className={styles.body}>
        <Sidebar
          houseSlug={house.slug}
          donationUrl={house.donationUrl ?? undefined}
        />

        <div className={styles.mainColumn}>
          <header className={styles.houseHeader}>
            <p className={styles.houseName}>
              Maison des Femmes — {house.city}
            </p>
          </header>

          <main className={styles.content}>
            {children}
          </main>
        </div>
      </div>

      <footer className={styles.footer}>
        <div className={styles.socials}>
          {house.facebookUrl && (
            <a
              href={house.facebookUrl}
              aria-label={`Facebook de ${house.name}`}
              className={styles.socialLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/images/facebook.png"
                alt=""
                width={34}
                height={34}
                className={styles.socialIcon}
              />
            </a>
          )}

          {house.instagramUrl && (
            <a
              href={house.instagramUrl}
              aria-label={`Instagram de ${house.name}`}
              className={styles.socialLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/images/instagram.png"
                alt=""
                width={34}
                height={34}
                className={styles.socialIcon}
              />
            </a>
          )}
        </div>
      </footer>
    </div>
  );
}