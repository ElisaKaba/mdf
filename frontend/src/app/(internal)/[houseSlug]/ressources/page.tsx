import ResourceDetail from "@/components/resources/ResourceDetail";
import {
  getResources,
  type StrapiResource,
} from "@/lib/strapi/resources";

type ResourcesPageProps = {
  params: Promise<{
    houseSlug: string;
  }>;
};

export default async function ResourcesPage({
  params,
}: ResourcesPageProps) {
  const { houseSlug } = await params;

  const [responseFr, responseEu] = await Promise.all([
    getResources("fr"),
    getResources("eu"),
  ]);

  const resourcesFr: StrapiResource[] =
    responseFr.data.filter(
      (resource) =>
        resource.house?.slug === houseSlug
    );

  const resourcesEu: StrapiResource[] =
    responseEu.data.filter(
      (resource) =>
        resource.house?.slug === houseSlug
    );

  if (resourcesFr.length === 0) {
    return (
      <section>
        <h1>Ressources</h1>

        <p>
          Aucun contenu publié pour le moment.
        </p>
      </section>
    );
  }

  return (
    <section>
      {resourcesFr.map((resourceFr) => {
        const resourceEu =
          resourcesEu.find(
            (resource) =>
              resource.documentId ===
              resourceFr.documentId
          );

        return (
          <ResourceDetail
            key={resourceFr.documentId}
            resourceFr={resourceFr}
            resourceEu={resourceEu}
          />
        );
      })}
    </section>
  );
}