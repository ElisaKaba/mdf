import JoinDetail from "@/components/join/JoinDetail";

import {
  getJoinContents,
  type StrapiJoin,
} from "@/lib/strapi/join";

import {
  getHouses,
  type StrapiHouse,
} from "@/lib/strapi/houses";

type SupportPageProps = {
  params: Promise<{
    houseSlug: string;
  }>;
};

export default async function SupportPage({
  params,
}: SupportPageProps) {
  const { houseSlug } = await params;

  const [
    responseFr,
    responseEu,
    housesResponse,
  ] = await Promise.all([
    getJoinContents("fr"),
    getJoinContents("eu"),
    getHouses("fr"),
  ]);

  const joinFr = responseFr.data.find(
    (item: StrapiJoin) =>
      item.house?.slug === houseSlug
  );

  const joinEu = responseEu.data.find(
    (item: StrapiJoin) =>
      item.house?.slug === houseSlug
  );

  const house = housesResponse.data.find(
    (item: StrapiHouse) =>
      item.slug === houseSlug
  );

  if (!joinFr) {
    return (
      <section>
        <h1>Nous soutenir</h1>

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
      houseSlug={houseSlug}
      donationUrl={
        house?.donationUrl ?? null
      }
    />
  );
}