"use client";

import Link from "@/components/LocaleLink";
import { useSiteLocale } from "@/components/LocaleProvider";

export default function LegalFooterLinks({ houseSlug }: { houseSlug: string }) {
  const locale = useSiteLocale();
  const labels = locale === "eu" ? {
    navigation: "Orri-oineko nabigazioa",
    legal: "Lege-oharrak",
    privacy: "Pribatutasun-politika",
    contact: "Harremana",
  } : {
    navigation: "Navigation du pied de page",
    legal: "Mentions légales",
    privacy: "Politique de confidentialité",
    contact: "Contact",
  };

  return (
    <nav aria-label={labels.navigation}>
      <Link href={`/${houseSlug}/mentions-legales`}>{labels.legal}</Link>
      {" · "}
      <Link href={`/${houseSlug}/politique-de-confidentialite`}>{labels.privacy}</Link>
      {" · "}
      <Link href={`/${houseSlug}/contact`}>{labels.contact}</Link>
    </nav>
  );
}
