import Image from "next/image";

import {
  BlocksRenderer,
} from "@strapi/blocks-react-renderer";

import ActionDetail from "@/components/actions/ActionDetail";

import {
  getActions,
  type StrapiAction,
} from "@/lib/strapi/actions";

import {
  getActionsPage,
} from "@/lib/strapi/actionsPage";

import styles from "./page.module.css";

type ActionsPageProps = {
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

function sortActions(
  actions: StrapiAction[]
): StrapiAction[] {
  return [...actions].sort(
    (a, b) =>
      (a.displayOrder ?? 999) -
      (b.displayOrder ?? 999)
  );
}

export default async function ActionsPage({
  params,
}: ActionsPageProps) {
  const { houseSlug } = await params;

  const [
    responseFr,
    responseEu,
    actionsPageFrResponse,
    actionsPageEuResponse,
  ] = await Promise.all([
    getActions("fr"),
    getActions("eu"),
    getActionsPage("fr"),
    getActionsPage("eu"),
  ]);

  const actionsFr = sortActions(
    responseFr.data.filter(
      (action: StrapiAction) =>
        action.house?.slug === houseSlug
    )
  );

  const actionsEu = sortActions(
    responseEu.data.filter(
      (action: StrapiAction) =>
        action.house?.slug === houseSlug
    )
  );

  const actionsPageFr =
    actionsPageFrResponse.data;

  const actionsPageEu =
    actionsPageEuResponse.data;

  const pageImage =
    actionsPageFr?.image;

  const imageUrl =
    getMediaUrl(
      pageImage?.url
    );

  const featuredActionFr =
    actionsFr.find(
      (action) =>
        action.displayOrder === 1
    ) ?? actionsFr[0];

  const featuredActionEu =
    featuredActionFr
      ? actionsEu.find(
          (action) =>
            action.documentId ===
            featuredActionFr.documentId
        )
      : undefined;

  const remainingActionsFr =
    featuredActionFr
      ? actionsFr.filter(
          (action) =>
            action.documentId !==
            featuredActionFr.documentId
        )
      : actionsFr;

  return (
    <section className={styles.wrapper}>
      {/* IMAGE BANDEAU */}
      {/* {imageUrl && (
        <div
          className={
            styles.pageImageWrapper
          }
        >
          <Image
            src={imageUrl}
            alt={
              pageImage
                ?.alternativeText
                ?.trim() ||
              "Nos actions"
            }
            width={
              pageImage?.width ??
              1200
            }
            height={
              pageImage?.height ??
              800
            }
            className={
              styles.pageImage
            }
            priority
          />
        </div>
      )} */
     <img src="/images/cv-actions.png" alt="Nos actions" className="actionImg"/>}

      {/* ACTION MISE EN AVANT */}
      {featuredActionFr && (
        <div
          className={
            styles.featuredAction
          }
        >
          <ActionDetail
            actionFr={
              featuredActionFr
            }
            actionEu={
              featuredActionEu
            }
          />
        </div>
      )}

      {/* QUE FAIT-ON ? */}
      <div className={styles.columns}>
        {/* FR */}
        <div
          className={
            styles.languageColumn
          }
        >
          <h1
            className={
              styles.sectionTitle
            }
          >
            {actionsPageFr
              ?.actionsTitle ??
              "Que fait-on ?"}
          </h1>

          {actionsPageFr
            ?.actionsIntro && (
            <div
              className={`richText ${styles.intro}`}
            >
              <BlocksRenderer
                content={
                  actionsPageFr
                    .actionsIntro
                }
              />
            </div>
          )}
        </div>

        {/* EU */}
        <div
          className={
            styles.languageColumn
          }
        >
          <h2
            className={
              styles.sectionTitle
            }
          >
            {actionsPageEu
              ?.actionsTitle ??
              "Gure ekintzak"}
          </h2>

          {actionsPageEu
            ?.actionsIntro && (
            <div
              className={`richText ${styles.intro}`}
            >
              <BlocksRenderer
                content={
                  actionsPageEu
                    .actionsIntro
                }
              />
            </div>
          )}
        </div>
      </div>

      {/* AUTRES ACTIONS */}
      {remainingActionsFr.length >
        0 && (
        <div
          className={
            styles.actionsList
          }
        >
          {remainingActionsFr.map(
            (
              actionFr:
                StrapiAction
            ) => {
              const actionEu =
                actionsEu.find(
                  (
                    action:
                      StrapiAction
                  ) =>
                    action.documentId ===
                    actionFr.documentId
                );

              return (
                <ActionDetail
                  key={
                    actionFr.documentId
                  }
                  actionFr={
                    actionFr
                  }
                  actionEu={
                    actionEu
                  }
                />
              );
            }
          )}
        </div>
      )}
    </section>
  );
}