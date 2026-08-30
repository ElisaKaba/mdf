import ActionDetail from "@/components/actions/ActionDetail";
import {
  getActions,
  type StrapiAction,
} from "@/lib/strapi/actions";

type ActionsPageProps = {
  params: Promise<{
    houseSlug: string;
  }>;
};

export default async function ActionsPage({
  params,
}: ActionsPageProps) {
  const { houseSlug } = await params;

  const [responseFr, responseEu] = await Promise.all([
    getActions("fr"),
    getActions("eu"),
  ]);

  const actionsFr: StrapiAction[] = responseFr.data.filter(
    (action: StrapiAction) =>
      action.house?.slug === houseSlug
  );

  const actionsEu: StrapiAction[] = responseEu.data.filter(
    (action: StrapiAction) =>
      action.house?.slug === houseSlug
  );

  if (actionsFr.length === 0) {
    return (
      <section>
        <h1>Nos actions</h1>

        <p>
          Aucun contenu publié pour le moment.
        </p>
      </section>
    );
  }

  return (
    <section>
      {actionsFr.map((actionFr: StrapiAction) => {
        const actionEu = actionsEu.find(
          (action: StrapiAction) =>
            action.documentId === actionFr.documentId
        );

        return (
          <ActionDetail
            key={actionFr.documentId}
            actionFr={actionFr}
            actionEu={actionEu}
          />
        );
      })}
    </section>
  );
}