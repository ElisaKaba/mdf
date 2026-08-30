import Link from "next/link";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <p className={styles.eyebrow}>
          Maison des Femmes — Emazteen Etxea
        </p>

        <h1>
          Un lieu d’accueil, d’écoute et d’accompagnement pour toutes les femmes
        </h1>

        <p className={styles.description}>
          La Maison des Femmes accueille, informe et accompagne les femmes dans
          un espace chaleureux, accessible et bienveillant.
        </p>

        <div className={styles.actions}>
          <a href="#don" className={styles.primaryButton}>
            Faire un don
          </a>

          <Link href="/actions" className={styles.secondaryButton}>
            Découvrir nos actions
          </Link>
        </div>
      </div>

      <div className={styles.imagePlaceholder}>
        Image du bandeau
      </div>
    </section>
  );
}