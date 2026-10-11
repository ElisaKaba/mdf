import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";

const beautifullyDelicious = localFont({
  src: "./fonts/BDSans-Black.woff2",
  variable: "--font-beautifully-delicious",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Maison des Femmes — Emazteen Etxea",
    template: "%s | Maison des Femmes — Emazteen Etxea",
  },

  description:
    "Maison des Femmes — Emazteen Etxea : accueil, accompagnement, activités, événements et ressources au Pays Basque.",

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    siteName: "Maison des Femmes — Emazteen Etxea",
    title: "Maison des Femmes — Emazteen Etxea",
    description:
      "Accueil, accompagnement, activités, événements et ressources de la Maison des Femmes — Emazteen Etxea au Pays Basque.",
    locale: "fr_FR",
    alternateLocale: ["eu_ES"],
  },

  alternates: {
    languages: {
      fr: "https://mdf-ee.fr",
      eu: "https://mdf-ee.eus",
    },
  },

  icons: {
    icon: "/icon.png",
  },
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <html lang="fr">
      <body className={beautifullyDelicious.variable}>
        {children}
      </body>
    </html>
  );
}