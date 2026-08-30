import AboutDetail from "@/components/about/AboutDetail";

import {
  getAboutPages,
  type StrapiAboutPage,
} from "@/lib/strapi/about";

type AboutPageProps = {
  params: Promise<{
    houseSlug: string;
  }>;
};

export default async function AboutPage({
  params,
}: AboutPageProps) {
  const { houseSlug } = await params;

  const [responseFr, responseEu] =
    await Promise.all([
      getAboutPages("fr"),
      getAboutPages("eu"),
    ]);

  const aboutFr =
    responseFr.data.find(
      (item: StrapiAboutPage) =>
        item.house?.slug === houseSlug
    );

  const aboutEu =
    responseEu.data.find(
      (item: StrapiAboutPage) =>
        item.house?.slug === houseSlug
    );

  if (!aboutFr) {
    return (
      <section>
        <h1>Qui sommes-nous ?</h1>

        <p>
          Aucun contenu publié pour le moment.
        </p>
      </section>
    );
  }

  return (
    <AboutDetail
      aboutFr={aboutFr}
      aboutEu={aboutEu}
    />
  );
}