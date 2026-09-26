import { headers } from "next/headers";

import ContactForm from "@/components/contact/ContactForm";
import { getDefaultLocaleFromHost } from "@/lib/i18n/getDefaultLocale";

type ContactPageProps = {
  params: Promise<{
    houseSlug: string;
  }>;

  searchParams: Promise<{
    lang?: string;
  }>;
};

export default async function ContactPage({
  params,
  searchParams,
}: ContactPageProps) {
  const { houseSlug } = await params;
  const { lang } = await searchParams;

  const headersList = await headers();
  const host = headersList.get("host");

  const localeFromHost =
    getDefaultLocaleFromHost(host);

  const defaultLocale =
    lang === "fr" || lang === "eu"
      ? lang
      : localeFromHost;

  return (
    <ContactForm
      houseSlug={houseSlug}
      defaultLocale={defaultLocale}
    />
  );
}