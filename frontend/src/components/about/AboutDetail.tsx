import Image from "next/image";

import {
  BlocksRenderer,
  type BlocksContent,
} from "@strapi/blocks-react-renderer";

import type { StrapiAboutPage } from "@/lib/strapi/about";

import styles from "./AboutDetail.module.css";

type AboutDetailProps = {
  aboutFr: StrapiAboutPage[];
  aboutEu: StrapiAboutPage[];
};

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ??
  "http://localhost:1337";

function getMediaUrl(
  path?: string
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

function isBlocksContent(
  content:
    | BlocksContent
    | string
    | null
    | undefined
): content is BlocksContent {
  return Array.isArray(content);
}

function Description({
  content,
}: {
  content:
    | BlocksContent
    | string
    | null
    | undefined;
}) {
  if (!content) {
    return null;
  }

  if (isBlocksContent(content)) {
    return (
      <BlocksRenderer
        content={content}
      />
    );
  }

  return <p>{content}</p>;
}

function getEuVersion(
  pageFr: StrapiAboutPage,
  aboutEu: StrapiAboutPage[]
) {
  return aboutEu.find(
    (pageEu) =>
      pageEu.slug === pageFr.slug
  );
}

export default function AboutDetail({
  aboutFr,
  aboutEu,
}: AboutDetailProps) {
  const mainPage =
    aboutFr.find(
      (page) =>
        page.slug === "qui-sommes-nous"
    ) ?? aboutFr[0];

  const image =
    mainPage.image?.[0];

  const imageUrl =
    getMediaUrl(image?.url);

  return (
    <section className={styles.wrapper}>
      {imageUrl && (
        <div className={styles.imageWrapper}>
          <Image
            src={imageUrl}
            alt={
              image?.alternativeText?.trim() ||
              mainPage.title
            }
            width={
              image?.width ?? 1200
            }
            height={
              image?.height ?? 600
            }
            className={styles.image}
            priority
          />
        </div>
      )}

      <div className={styles.sections}>
        {aboutFr.map((pageFr) => {
          const pageEu =
            getEuVersion(
              pageFr,
              aboutEu
            );

          return (
            <div
              key={pageFr.documentId}
              className={styles.section}
            >
              <article
                className={styles.column}
              >
                <h2>
                  {pageFr.title}
                </h2>

                {pageFr.summary && (
                  <p
                    className={
                      styles.summary
                    }
                  >
                    {pageFr.summary}
                  </p>
                )}

                <div
                  className={`richText ${styles.description}`}
                >
                  <Description
                    content={
                      pageFr.description
                    }
                  />
                </div>
              </article>

              <article
                className={styles.column}
              >
                {pageEu ? (
                  <>
                    <h2>
                      {pageEu.title}
                    </h2>

                    {pageEu.summary && (
                      <p
                        className={
                          styles.summary
                        }
                      >
                        {pageEu.summary}
                      </p>
                    )}

                    <div
                      className={`richText ${styles.description}`}
                    >
                      <Description
                        content={
                          pageEu.description
                        }
                      />
                    </div>
                  </>
                ) : (
                  <p
                    className={
                      styles.empty
                    }
                  >
                    Euskarazko edukia ez
                    dago oraindik
                    erabilgarri.
                  </p>
                )}
              </article>
            </div>
          );
        })}
      </div>
    </section>
  );
}