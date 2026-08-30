"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import Button from "@/components/ui/Button";

import styles from "./Sidebar.module.css";

type SidebarProps = {
  houseSlug: string;
  donationUrl?: string;
};

const navigationLinks = [
  {
    label: "Qui sommes-nous",
    href: "qui-sommes-nous",
  },
  {
    label: "Nos actions",
    href: "actions",
  },
  {
    label: "Agenda",
    href: "agenda",
  },
  {
    label: "Ressources",
    href: "ressources",
  },
  {
    label: "Nous rejoindre",
    href: "nous-rejoindre",
  },
  {
    label: "Contact",
    href: "contact",
  },
];

export default function Sidebar({
  houseSlug,
  donationUrl,
}: SidebarProps) {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);

  function toggleMenu() {
    setIsOpen((current) => !current);
  }

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.top}>
        <Link
          href="/"
          className={styles.logoLink}
          aria-label="Retour à l’accueil"
        >
          <Image
            src="/images/carre-vertical-200.png"
            alt="Maison des Femmes — Emazteen Etxea"
            width={220}
            height={220}
            priority
            className={styles.logo}
          />
        </Link>

        <button
          type="button"
          className={styles.burger}
          aria-label={
            isOpen
              ? "Fermer le menu"
              : "Ouvrir le menu"
          }
          aria-expanded={isOpen}
          onClick={toggleMenu}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div
        className={`${styles.menu} ${
          isOpen ? styles.menuOpen : ""
        }`}
      >
        <nav
          className={styles.navigation}
          aria-label="Navigation principale"
        >
          <ul>
            {navigationLinks.map((link) => {
              const href =
                `/${houseSlug}/${link.href}`;

              const isActive =
                pathname === href ||
                pathname.startsWith(
                  `${href}/`
                );

              return (
                <li key={link.href}>
                  <Link
                    href={href}
                    className={`${styles.navLink} ${
                      isActive
                        ? styles.active
                        : ""
                    }`}
                    aria-current={
                      isActive
                        ? "page"
                        : undefined
                    }
                    onClick={closeMenu}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={styles.donation}>
          <Button
            href={donationUrl ?? "#"}
            className={styles.donationButton}
          >
            Faire un don
          </Button>
        </div>
      </div>
    </aside>
  );
}