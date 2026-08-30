import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Maison des Femmes",
  description: "Site de la Maison des Femmes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}