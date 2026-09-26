import Image from "next/image";

import styles from "./loading.module.css";

export default function Loading() {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <Image
          src="/images/logo-horizontal-400.png"
          alt="Maison des Femmes — Emazteen Etxea"
          width={400}
          height={160}
          priority
          className={styles.logo}
        />

        <div
          className={styles.spinner}
          aria-hidden="true"
        />

        <p className={styles.text}>
          Chargement de la Maison des Femmes…
        </p>

        <p className={styles.subtext}>
          Notre serveur de démonstration se réveille.
          Cela peut prendre quelques instants.
        </p>
      </div>
    </main>
  );
}