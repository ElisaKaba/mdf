import Image from "next/image";
import {
  BlocksRenderer,
  type BlocksContent,
} from "@strapi/blocks-react-renderer";

import type { StrapiJoin } from "@/lib/strapi/join";

import styles from "./JoinDetail.module.css";

type JoinDetailProps = {
  joinFr: StrapiJoin;
  joinEu?: StrapiJoin;
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
  description: StrapiJoin["description"]
): description is BlocksContent {
  return Array.isArray(description);
}

function Description({
  content,
}: {
  content: StrapiJoin["description"];
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

export default function JoinDetail({
  joinFr,
  joinEu,
}: JoinDetailProps) {
  const image = joinFr.image?.[0];

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
              joinFr.title
            }
            width={image?.width ?? 1200}
            height={image?.height ?? 600}
            className={styles.image}
            priority
          />
        </div>
      )}

      <div className={styles.columns}>
        <article className={styles.column}>
          <p className={styles.language}>
            Français
          </p>

          <h1>{joinFr.title}</h1>

          <div className={styles.description}>
            <Description
              content={joinFr.description}
            />
          </div>
        </article>

        <article className={styles.column}>
          <p className={styles.language}>
            Euskara
          </p>

          {joinEu ? (
            <>
              <h2>{joinEu.title}</h2>

              <div className={styles.description}>
                <Description
                  content={joinEu.description}
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