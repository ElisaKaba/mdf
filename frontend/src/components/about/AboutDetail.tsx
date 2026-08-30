import Image from "next/image";
import {
  BlocksRenderer,
  type BlocksContent,
} from "@strapi/blocks-react-renderer";

import type { StrapiAboutPage } from "@/lib/strapi/about";

import styles from "./AboutDetail.module.css";

type AboutDetailProps = {
  aboutFr: StrapiAboutPage;
  aboutEu?: StrapiAboutPage;
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

function isBlocksContent(
  description: StrapiAboutPage["description"]
): description is BlocksContent {
  return Array.isArray(description);
}

function Description({
  content,
}: {
  content: StrapiAboutPage["description"];
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

export default function AboutDetail({
  aboutFr,
  aboutEu,
}: AboutDetailProps) {
  const image = aboutFr.image?.[0];

  const imageUrl = getMediaUrl(
    image?.url
  );

  return (
    <section className={styles.wrapper}>
      {imageUrl && (
        <div className={styles.imageWrapper}>
          <Image
            src={imageUrl}
            alt={
              image?.alternativeText?.trim() ||
              aboutFr.title
            }
            width={image?.width ?? 1200}
            height={image?.height ?? 600}
            className={styles.image}
          />
        </div>
      )}

      <div className={styles.columns}>
        <article className={styles.column}>
          <p className={styles.language}>
            Français
          </p>

          <h1>{aboutFr.title}</h1>

          {aboutFr.summary && (
            <p className={styles.summary}>
              {aboutFr.summary}
            </p>
          )}

          <div className={styles.description}>
            <Description
              content={aboutFr.description}
            />
          </div>
        </article>

        <article className={styles.column}>
          <p className={styles.language}>
            Euskara
          </p>

          {aboutEu ? (
            <>
              <h2>{aboutEu.title}</h2>

              {aboutEu.summary && (
                <p className={styles.summary}>
                  {aboutEu.summary}
                </p>
              )}

              <div className={styles.description}>
                <Description
                  content={aboutEu.description}
                />
              </div>
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