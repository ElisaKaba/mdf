import { BlocksRenderer } from "@strapi/blocks-react-renderer";

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

  /*
   * Première action de la page.
   * Ici : Journées du Matrimoine si displayOrder = 1.
   */
  const featuredActionFr =
    actionsFr.find(
      (action) => action.displayOrder === 1
    ) ?? actionsFr[0];

  const featuredActionEu =
    featuredActionFr
      ? actionsEu.find(
          (action) =>
            action.documentId ===
            featuredActionFr.documentId
        )
      : undefined;

  /*
   * Les autres actions seront affichées
   * après "Que fait-on ?".
   */
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
      {/* ACTION MISE EN AVANT TOUT EN HAUT */}
      {featuredActionFr && (
        <div className={styles.featuredAction}>
          <ActionDetail
            actionFr={featuredActionFr}
            actionEu={featuredActionEu}
          />
        </div>
      )}

      {/* QUE FAIT-ON ? */}
      <div className={styles.columns}>
        <div className={styles.languageColumn}>
          <h1 className={styles.sectionTitle}>
            {actionsPageFr?.actionsTitle ??
              "Que fait-on ?"}
          </h1>

          {actionsPageFr?.actionsIntro && (
            <div
              className={`richText ${styles.intro}`}
            >
              <BlocksRenderer
                content={
                  actionsPageFr.actionsIntro
                }
              />
            </div>
          )}
        </div>

        <div className={styles.languageColumn}>
          <h2 className={styles.sectionTitle}>
            {actionsPageEu?.actionsTitle ??
              "Zer egiten dugu?"}
          </h2>

          {actionsPageEu?.actionsIntro && (
            <div
              className={`richText ${styles.intro}`}
            >
              <BlocksRenderer
                content={
                  actionsPageEu.actionsIntro
                }
              />
            </div>
          )}
        </div>
      </div>

      {/* AUTRES ACTIONS */}
      {remainingActionsFr.length > 0 && (
        <div className={styles.actionsList}>
          {remainingActionsFr.map(
            (actionFr: StrapiAction) => {
              const actionEu =
                actionsEu.find(
                  (action: StrapiAction) =>
                    action.documentId ===
                    actionFr.documentId
                );

              return (
                <ActionDetail
                  key={actionFr.documentId}
                  actionFr={actionFr}
                  actionEu={actionEu}
                />
              );
            }
          )}
        </div>
      )}

      {/* OÙ VA-T-ON ? */}
      <div className={styles.columns}>
        <div className={styles.languageColumn}>
          <h2 className={styles.sectionTitle}>
            {actionsPageFr
              ?.whereWeAreGoingTitle ??
              "Où va-t-on ?"}
          </h2>

          {actionsPageFr?.whereWeAreGoing && (
            <div
              className={`richText ${styles.intro}`}
            >
              <BlocksRenderer
                content={
                  actionsPageFr.whereWeAreGoing
                }
              />
            </div>
          )}
        </div>

        <div className={styles.languageColumn}>
          <h2 className={styles.sectionTitle}>
            {actionsPageEu
              ?.whereWeAreGoingTitle ??
              "Nora goaz?"}
          </h2>

          {actionsPageEu?.whereWeAreGoing && (
            <div
              className={`richText ${styles.intro}`}
            >
              <BlocksRenderer
                content={
                  actionsPageEu.whereWeAreGoing
                }
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}