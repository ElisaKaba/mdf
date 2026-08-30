import Image from "next/image";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";

import type { StrapiResource } from "@/lib/strapi/resources";

import styles from "./ResourceDetail.module.css";

type ResourceDetailProps = {
  resourceFr: StrapiResource;
  resourceEu?: StrapiResource;
};

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";

function getMediaUrl(path?: string) {
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

export default function ResourceDetail({
  resourceFr,
  resourceEu,
}: ResourceDetailProps) {
  const imageUrl = getMediaUrl(
    resourceFr.image?.url
  );

  return (
    <section className={styles.wrapper}>
      {imageUrl && (
        <div className={styles.imageWrapper}>
          <Image
            src={imageUrl}
            alt={
              resourceFr.image?.alternativeText?.trim() ||
              resourceFr.title
            }
            width={1200}
            height={600}
            className={styles.image}
          />
        </div>
      )}

      <div className={styles.columns}>
        <article className={styles.column}>
          <p className={styles.language}>
            Français
          </p>

          <h1>{resourceFr.title}</h1>

          {resourceFr.summary && (
            <p className={styles.summary}>
              {resourceFr.summary}
            </p>
          )}

          {resourceFr.description && (
            <div className={styles.description}>
              <BlocksRenderer
                content={resourceFr.description}
              />
            </div>
          )}

          {resourceFr.externalUrl && (
            <a
              href={resourceFr.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              Consulter la ressource
            </a>
          )}
        </article>

        <article className={styles.column}>
          <p className={styles.language}>
            Euskara
          </p>

          {resourceEu ? (
            <>
              <h2>{resourceEu.title}</h2>

              {resourceEu.summary && (
                <p className={styles.summary}>
                  {resourceEu.summary}
                </p>
              )}

              {resourceEu.description && (
                <div className={styles.description}>
                  <BlocksRenderer
                    content={resourceEu.description}
                  />
                </div>
              )}

              {resourceEu.externalUrl && (
                <a
                  href={resourceEu.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Baliabidea ikusi
                </a>
              )}
            </>
          ) : (
            <p className={styles.empty}>
              Euskarazko edukia ez dago oraindik erabilgarri.
            </p>
          )}
        </article>
      </div>
    </section>
  );
}