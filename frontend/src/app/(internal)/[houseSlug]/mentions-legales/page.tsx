import { headers } from "next/headers";
import {
  BlocksRenderer,
} from "@strapi/blocks-react-renderer";

import {
  getLegalPage,
} from "@/lib/strapi/legalPage";

import {
  resolveLocale,
} from "@/lib/i18n/getDefaultLocale";

import styles from "./page.module.css";

type LegalPageProps = {
  searchParams: Promise<{
    lang?: string | string[];
  }>;
};

export default async function LegalPage({
  searchParams,
}: LegalPageProps) {
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
    await getLegalPage(locale);

  const legalPage =
    response.data;

  if (!legalPage) {
    return (
      <section className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.title}>
            {locale === "eu"
              ? "Lege-oharrak"
              : "Mentions légales"}
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
    legalPage.lastUpdated
      ? new Intl.DateTimeFormat(
          locale === "eu"
            ? "eu-ES"
            : "fr-FR",
          {
            dateStyle: "long",
          }
        ).format(
          new Date(
            legalPage.lastUpdated
          )
        )
      : null;

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            {legalPage.title}
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

        {legalPage.content && (
          <div
            className={`richText ${styles.content}`}
          >
            <BlocksRenderer
              content={
                legalPage.content
              }
            />
          </div>
        )}
      </div>
    </section>
  );
}