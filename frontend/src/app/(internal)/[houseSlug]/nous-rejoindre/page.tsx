import JoinDetail from "@/components/join/JoinDetail";

import {
  getJoinContents,
  type StrapiJoin,
} from "@/lib/strapi/join";

type JoinPageProps = {
  params: Promise<{
    houseSlug: string;
  }>;
};

export default async function JoinPage({
  params,
}: JoinPageProps) {
  const { houseSlug } = await params;

  const [responseFr, responseEu] = await Promise.all([
    getJoinContents("fr"),
    getJoinContents("eu"),
  ]);

  const joinFr = responseFr.data.find(
    (item: StrapiJoin) =>
      item.house?.slug === houseSlug
  );

  const joinEu = responseEu.data.find(
    (item: StrapiJoin) =>
      item.house?.slug === houseSlug
  );

  if (!joinFr) {
    return (
      <section>
        <h1>Nous rejoindre</h1>

        <p>
          Aucun contenu publié pour le moment.
        </p>
      </section>
    );
  }

  return (
    <JoinDetail
      joinFr={joinFr}
      joinEu={joinEu}
    />
  );
}