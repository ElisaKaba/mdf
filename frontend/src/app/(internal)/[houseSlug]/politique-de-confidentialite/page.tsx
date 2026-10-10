import { headers } from "next/headers";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";

import {
  getPrivacyPage,
} from "@/lib/strapi/privacyPage";

import {
  resolveLocale,
} from "@/lib/i18n/getDefaultLocale";

import styles from "./page.module.css";

type PrivacyPageProps = {
  searchParams: Promise<{
    lang?: string | string[];
  }>;
};

export default async function PrivacyPage({
  searchParams,
}: PrivacyPageProps) {
  const headersList =
    await headers();

  const host =
    headersList.get("host") ?? "";

  const locale =
    resolveLocale(
      host,
      (await searchParams).lang
    );

  const response =
    await getPrivacyPage(locale);

  const privacyPage =
    response.data;

  if (!privacyPage) {
    return (
      <section className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.title}>
            {locale === "eu"
              ? "Pribatutasun-politika"
              : "Politique de confidentialité"}
          </h1>

          <p className={styles.empty}>
            {locale === "eu"
              ? "Edukia ez dago erabilgarri."
              : "Le contenu n’est pas disponible."}
          </p>
        </div>
      </section>
    );
  }

  const formattedDate =
    privacyPage.lastUpdated
      ? new Intl.DateTimeFormat(
          locale === "eu"
            ? "eu-ES"
            : "fr-FR",
          {
            dateStyle: "long",
          }
        ).format(
          new Date(
            privacyPage.lastUpdated
          )
        )
      : null;

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            {privacyPage.title}
          </h1>

          {formattedDate && (
            <p className={styles.updated}>
              {locale === "eu"
                ? "Azken eguneraketa"
                : "Dernière mise à jour"}
              {" : "}
              {formattedDate}
            </p>
          )}
        </header>

        {privacyPage.content && (
          <div
            className={`richText ${styles.content}`}
          >
            <BlocksRenderer
              content={
                privacyPage.content
              }
            />
          </div>
        )}
      </div>
    </section>
  );
}