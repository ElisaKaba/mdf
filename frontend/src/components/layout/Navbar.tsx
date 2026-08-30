import Image from "next/image";
import Link from "next/link";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link
          href="/"
          className={styles.logoLink}
          aria-label="Retour à l’accueil"
        >
          <Image
            src="/images/logo-horizontal-200.png"
            alt="Maison des Femmes — Emazteen Etxea"
            width={320}
            height={70}
            priority
            className={styles.logo}
          />
        </Link>
      </div>
    </header>
  );
}