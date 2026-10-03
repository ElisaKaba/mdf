import { headers } from "next/headers";
import LocaleProvider from "@/components/LocaleProvider";
import { getDefaultLocaleFromHost } from "@/lib/i18n/getDefaultLocale";
import type { Metadata, Viewport  } from "next";
import localFont from "next/font/local";
import "./globals.css";


export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const beautifullyDelicious = localFont({
  src: "../fonts/BDSans-Black.woff2",
  variable: "--font-beautifully-delicious",
  display: "swap",
});

const beautifullyDeliciousBold = localFont({
  src: "../fonts/BDScript-Bold.woff2",
  variable: "--font-beautifully-delicious-bold",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Maison des Femmes",
  description: "Maison des Femmes — Emazteen Etxea",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = getDefaultLocaleFromHost((await headers()).get("host"));
  return (
    <html lang={locale}>
      <body className={beautifullyDelicious.variable}>
        <LocaleProvider defaultLocale={locale}>{children}</LocaleProvider>
      </body>
    </html>
  );
}