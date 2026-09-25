import Image from "next/image";

import {
  BlocksRenderer,
  type BlocksContent,
} from "@strapi/blocks-react-renderer";

import {
  getAboutPages,
  type StrapiAboutPage,
} from "@/lib/strapi/about";

import styles from "./page.module.css";

type AboutPageProps = {
  params: Promise<{
    houseSlug: string;
  }>;
};

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ??
  "http://localhost:1337";

function getMediaUrl(
  path?: string | null
) {
  if (!path) {
    return undefined;
  }

  if (
    path.startsWith("http://") ||
    path.startsWith("https://")
  ) {
    return path;
  }

  return `${STRAPI_URL}${path}`;
}

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

  /*
   * Image bandeau :
   * image de la première entrée
   * selon displayOrder.
   */
  const pageImage =
    pagesFr[0]?.image?.[0];

  const imageUrl =
    getMediaUrl(
      pageImage?.url
    );

  return (
    <section className={styles.wrapper}>
      {/* IMAGE BANDEAU */}
      {/* {imageUrl && ( */}
        <div
          className={
            styles.pageImageWrapper
          }
        >
          {/* <Image
            src={imageUrl}
            alt={
              pageImage
                ?.alternativeText
                ?.trim() ||
              "Maison des Femmes"
            }
            width={
              pageImage?.width ??
              1600
            }
            height={
              pageImage?.height ??
              900
            }
            className={
              styles.pageImage
            }
            priority
          />*/}
      <img src="/images/qui-sommes-nous.png" alt="Femmes de la Maison des femmes" className="quiImg"/>
        </div> 

      {/* SECTIONS FR / EU */}
      {pagesFr.map(
        (pageFr) => {
          /*
           * On essaie d'abord
           * d'associer les traductions
           * avec documentId.
           *
           * Sinon on utilise
           * displayOrder.
           */
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

          return (
            <div
              key={
                pageFr.documentId
              }
              className={styles.row}
            >
              {/* FRANÇAIS */}
              <AboutContent
                page={pageFr}
              />

              {/* EUSKARA */}
              {pageEu ? (
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
              )}
            </div>
          );
        }
      )}
    </section>
  );
}