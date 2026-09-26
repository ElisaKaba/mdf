import { headers } from "next/headers";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";

import ActionDetail from "@/components/actions/ActionDetail";

import {
  getActions,
  type StrapiAction,
} from "@/lib/strapi/actions";

import {
  getActionsPage,
} from "@/lib/strapi/actionsPage";

import {
  getDefaultLocaleFromHost,
} from "@/lib/i18n/getDefaultLocale";

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

  /*
   * Détermine la langue prioritaire
   * selon le domaine.
   *
   * .eus => Euskara
   * .fr  => Français
   */
  const headersList = await headers();
  const host = headersList.get("host");

  const defaultLocale =
    getDefaultLocaleFromHost(host);

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
   * Action mise en avant
   */
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

  /*
   * Autres actions
   */
  const remainingActionsFr =
    featuredActionFr
      ? actionsFr.filter(
          (action) =>
            action.documentId !==
            featuredActionFr.documentId
        )
      : actionsFr;

  /*
   * Bloc français
   */
  const frenchIntro = (
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
  );

  /*
   * Bloc Euskara
   */
  const basqueIntro = (
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
  );

  return (
    <section
      className={styles.wrapper}
    >
      {/* IMAGE BANDEAU */}
      <img
        src="/images/cv-actions.png"
        alt="Nos actions"
        className="actionImg"
      />

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

      {/* QUE FAIT-ON ? / GURE EKINTZAK */}
      <div className={styles.columns}>
        {defaultLocale === "eu" ? (
          <>
            {basqueIntro}
            {frenchIntro}
          </>
        ) : (
          <>
            {frenchIntro}
            {basqueIntro}
          </>
        )}
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