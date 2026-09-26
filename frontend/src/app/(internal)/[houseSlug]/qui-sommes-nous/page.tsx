import { headers } from "next/headers";

import {
  BlocksRenderer,
  type BlocksContent,
} from "@strapi/blocks-react-renderer";

import {
  getAboutPages,
  type StrapiAboutPage,
} from "@/lib/strapi/about";

import {
  getDefaultLocaleFromHost,
} from "@/lib/i18n/getDefaultLocale";

import styles from "./page.module.css";

type AboutPageProps = {
  params: Promise<{
    houseSlug: string;
  }>;
};

function sortAboutPages(
  pages: StrapiAboutPage[]
) {
  return [...pages].sort(
    (a, b) =>
      (a.displayOrder ?? 999) -
      (b.displayOrder ?? 999)
  );
}

function AboutContent({
  page,
}: {
  page: StrapiAboutPage;
}) {
  return (
    <section className={styles.column}>
      <h2 className={styles.title}>
        {page.title}
      </h2>

      {page.summary && (
        <p className={styles.summary}>
          {page.summary}
        </p>
      )}

      {page.description && (
        <div
          className={`richText ${styles.description}`}
        >
          <BlocksRenderer
            content={
              page.description as BlocksContent
            }
          />
        </div>
      )}
    </section>
  );
}

export default async function AboutPage({
  params,
}: AboutPageProps) {
  const { houseSlug } = await params;

  const headersList = await headers();
  const host = headersList.get("host");

  const defaultLocale =
    getDefaultLocaleFromHost(host);

  const [
    responseFr,
    responseEu,
  ] = await Promise.all([
    getAboutPages("fr"),
    getAboutPages("eu"),
  ]);

  const pagesFr = sortAboutPages(
    responseFr.data.filter(
      (page) =>
        page.house?.slug === houseSlug
    )
  );

  const pagesEu = sortAboutPages(
    responseEu.data.filter(
      (page) =>
        page.house?.slug === houseSlug
    )
  );

  if (pagesFr.length === 0) {
    return (
      <section>
        <h1>
          Qui sommes-nous ?
        </h1>

        <p>
          Aucun contenu publié pour le moment.
        </p>
      </section>
    );
  }

  return (
    <section className={styles.wrapper}>
      {/* IMAGE BANDEAU */}
      <div
        className={
          styles.pageImageWrapper
        }
      >
        <img
          src="/images/qui-sommes-nous.png"
          alt="Femmes de la Maison des femmes"
          className="quiImg"
        />
      </div>

      {/* SECTIONS FR / EU */}
      {pagesFr.map(
        (pageFr) => {
          const pageEu =
            pagesEu.find(
              (page) =>
                page.documentId ===
                pageFr.documentId
            ) ??
            pagesEu.find(
              (page) =>
                page.displayOrder ===
                pageFr.displayOrder
            );

          const frenchContent = (
            <AboutContent
              page={pageFr}
            />
          );

          const basqueContent =
            pageEu ? (
              <AboutContent
                page={pageEu}
              />
            ) : (
              <div
                className={
                  styles.column
                }
              >
                <p
                  className={
                    styles.empty
                  }
                >
                  Euskarazko edukia
                  ez dago oraindik
                  erabilgarri.
                </p>
              </div>
            );

          return (
            <div
              key={
                pageFr.documentId
              }
              className={styles.row}
            >
              {defaultLocale ===
              "eu" ? (
                <>
                  {basqueContent}
                  {frenchContent}
                </>
              ) : (
                <>
                  {frenchContent}
                  {basqueContent}
                </>
              )}
            </div>
          );
        }
      )}
    </section>
  );
}