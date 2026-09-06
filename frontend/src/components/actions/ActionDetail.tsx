import Image from "next/image";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";

import type {
  StrapiAction,
  StrapiActionImage,
} from "@/lib/strapi/actions";

import styles from "./ActionDetail.module.css";

type ActionDetailProps = {
  actionFr: StrapiAction;
  actionEu?: StrapiAction;
};

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ??
  "http://localhost:1337";

function getStrapiMediaUrl(
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

function ActionImage({
  image,
  fallbackAlt,
}: {
  image?: StrapiActionImage;
  fallbackAlt: string;
}) {
  if (!image) {
    return null;
  }

  const imageUrl =
    getStrapiMediaUrl(image.url);

  if (!imageUrl) {
    return null;
  }

  return (
    <div className={styles.imageWrapper}>
      <Image
        src={imageUrl}
        alt={
          image.alternativeText?.trim() ||
          fallbackAlt
        }
        width={image.width ?? 600}
        height={image.height ?? 800}
        className={styles.image}
      />
    </div>
  );
}

export default function ActionDetail({
  actionFr,
  actionEu,
}: ActionDetailProps) {
  const images =
    actionFr.image ?? [];

  const imageFr = images[0];
  const imageEu = images[1];

  return (
    <section className={styles.wrapper}>
      <div className={styles.columns}>
        <article className={styles.column}>
          <ActionImage
            image={imageFr}
            fallbackAlt={actionFr.title}
          />

          <h1>
            {actionFr.title}
          </h1>

          {actionFr.summary && (
            <p className={styles.summary}>
              {actionFr.summary}
            </p>
          )}

          {actionFr.description && (
            <div
              className={`richText ${styles.description}`}
            >
              <BlocksRenderer
                content={
                  actionFr.description
                }
              />
            </div>
          )}
        </article>

        <article className={styles.column}>
          <ActionImage
            image={imageEu}
            fallbackAlt={
              actionEu?.title ??
              actionFr.title
            }
          />

          {actionEu ? (
            <>
              <h2>
                {actionEu.title}
              </h2>

              {actionEu.summary && (
                <p
                  className={
                    styles.summary
                  }
                >
                  {actionEu.summary}
                </p>
              )}

              {actionEu.description && (
                <div
                  className={`richText ${styles.description}`}
                >
                  <BlocksRenderer
                    content={
                      actionEu.description
                    }
                  />
                </div>
              )}
            </>
          ) : (
            <p className={styles.empty}>
              Euskarazko edukia ez dago
              oraindik erabilgarri.
            </p>
          )}
        </article>
      </div>
    </section>
  );
}