import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const beautifullyDelicious = localFont({
  src: "../fonts/BDSans-Black.woff2",
  variable: "--font-beautifully-delicious",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Maison des Femmes",
  description: "Maison des Femmes — Emazteen Etxea",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={beautifullyDelicious.variable}>
        {children}
      </body>
    </html>
  );
}