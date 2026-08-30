import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div>
          <strong>Maison des Femmes — Emazteen Etxea</strong>
          <p>Un lieu d’accueil, d’écoute et d’accompagnement.</p>
        </div>

        <nav aria-label="Navigation du pied de page">
          <Link href="/mentions-legales">Mentions légales</Link>
          <Link href="/politique-confidentialite">
            Politique de confidentialité
          </Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </div>
    </footer>
  );
}