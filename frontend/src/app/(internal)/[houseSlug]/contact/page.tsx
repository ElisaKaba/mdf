import { headers } from "next/headers";

import ContactForm from "@/components/contact/ContactForm";
import { getDefaultLocaleFromHost } from "@/lib/i18n/getDefaultLocale";

type ContactPageProps = {
  params: Promise<{
    houseSlug: string;
  }>;
};

export default async function ContactPage({
  params,
}: ContactPageProps) {
  const { houseSlug } = await params;

  const headersList = await headers();
  const host = headersList.get("host");

  const defaultLocale =
    getDefaultLocaleFromHost(host);

  return (
    <ContactForm
      houseSlug={houseSlug}
      defaultLocale={defaultLocale}
    />
  );
}