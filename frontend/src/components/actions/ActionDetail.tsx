import {
  BlocksRenderer,
  type BlocksContent,
} from "@strapi/blocks-react-renderer";

import type {
  StrapiAction,
} from "@/lib/strapi/actions";

import styles from "./ActionDetail.module.css";

type ActionDetailProps = {
  actionFr: StrapiAction;
  defaultLocale?: "fr" | "eu";
  actionEu?: StrapiAction;
};

function isBlocksContent(
  content: StrapiAction["description"]
): content is BlocksContent {
  return Array.isArray(content);
}

function Description({
  content,
}: {
  content: StrapiAction["description"];
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

export default function ActionDetail({
  actionFr,
  actionEu,
  defaultLocale = "fr",
}: ActionDetailProps) {
  const frenchContent = (<article className={styles.column}>
          <h2>
            {actionFr.title}
          </h2>

          {actionFr.summary && (
            <p className={styles.summary}>
              {actionFr.summary}
            </p>
          )}

          {actionFr.description && (
            <div
              className={`richText ${styles.description}`}
            >
              <Description
                content={
                  actionFr.description
                }
              />
            </div>
          )}
        </article>);
  const basqueContent = (<article className={styles.column}>
          {actionEu ? (
            <>
              <h2>
                {actionEu.title}
              </h2>

              {actionEu.summary && (
                <p className={styles.summary}>
                  {actionEu.summary}
                </p>
              )}

              {actionEu.description && (
                <div
                  className={`richText ${styles.description}`}
                >
                  <Description
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
        </article>);

  return (
    <section className={styles.wrapper}>
      <div className={styles.columns}>
        {defaultLocale === "eu" ? <>{basqueContent}{frenchContent}</> : <>{frenchContent}{basqueContent}</>}
        {/* FRANÇAIS */}


        {/* EUSKARA */}

      </div>
    </section>
  );
}