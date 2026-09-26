import { headers } from "next/headers";

import JoinDetail from "@/components/join/JoinDetail";

import {
  getJoinContents,
  type StrapiJoin,
} from "@/lib/strapi/join";

import {
  getHouses,
  type StrapiHouse,
} from "@/lib/strapi/houses";

import {
  getDefaultLocaleFromHost,
} from "@/lib/i18n/getDefaultLocale";

type SupportPageProps = {
  params: Promise<{
    houseSlug: string;
  }>;
};

export default async function SupportPage({
  params,
}: SupportPageProps) {
  const { houseSlug } = await params;

  const headersList = await headers();
  const host = headersList.get("host");

  const defaultLocale =
    getDefaultLocaleFromHost(host);

const [
  responseFr,
  housesResponse,
] = await Promise.all([
  getJoinContents("fr"),
  getHouses("fr"),
]);

  /*
   * On trouve d'abord le contenu FR
   * grâce à la Maison.
   */
  const joinFr = responseFr.data.find(
    (item: StrapiJoin) =>
      item.house?.slug === houseSlug
  );

  /*
   * Puis on retrouve sa traduction EU
   * grâce au documentId.
   *
   * Cela évite de dépendre de la relation
   * house sur la localisation basque.
   */
  const joinEu = joinFr?.localizations?.find(
  (item: StrapiJoin) =>
    item.locale === "eu"
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
      defaultLocale={defaultLocale}
    />
  );
}