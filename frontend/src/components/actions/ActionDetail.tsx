import Image from "next/image";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";

import type { StrapiAction } from "@/lib/strapi/actions";

import styles from "./ActionDetail.module.css";

type ActionDetailProps = {
  actionFr: StrapiAction;
  actionEu?: StrapiAction;
};

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";

function getStrapiMediaUrl(path?: string) {
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

export default function ActionDetail({
  actionFr,
  actionEu,
}: ActionDetailProps) {
  const imageUrl = getStrapiMediaUrl(
    actionFr.image?.url
  );

  return (
    <section className={styles.wrapper}>
      {imageUrl && (
        <div className={styles.imageWrapper}>
          <Image
            src={imageUrl}
            alt={
              actionFr.image?.alternativeText?.trim() ||
              actionFr.title
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

          <h1>{actionFr.title}</h1>

          {actionFr.summary && (
            <p className={styles.summary}>
              {actionFr.summary}
            </p>
          )}

          {actionFr.description && (
            <div className={styles.description}>
              <BlocksRenderer
                content={actionFr.description}
              />
            </div>
          )}
        </article>

        <article className={styles.column}>
          <p className={styles.language}>
            Euskara
          </p>

          {actionEu ? (
            <>
              <h2>{actionEu.title}</h2>

              {actionEu.summary && (
                <p className={styles.summary}>
                  {actionEu.summary}
                </p>
              )}

              {actionEu.description && (
                <div className={styles.description}>
                  <BlocksRenderer
                    content={actionEu.description}
                  />
                </div>
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