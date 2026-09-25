import Image from "next/image";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";

import {
  getPartners,
  type StrapiPartner,
} from "@/lib/strapi/partners";



import styles from "./page.module.css";

type PartnersPageProps = {
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

function sortPartners(
  partners: StrapiPartner[]
) {
  return [...partners].sort(
    (a, b) =>
      (a.displayOrder ?? 999) -
      (b.displayOrder ?? 999)
  );
}

function PartnerCard({
  partner,
}: {
  partner: StrapiPartner;
}) {
  const logoUrl =
    getMediaUrl(partner.logo?.url);

  return (
    <article className={styles.card}>
      {logoUrl && (
        <div className={styles.logoWrapper}>
          <Image
            src={logoUrl}
            alt={
              partner.logo?.alternativeText?.trim() ||
              partner.name
            }
            width={220}
            height={120}
            className={styles.logo}
          />
        </div>
      )}

      <div className={styles.cardContent}>
        <h3>
          {partner.name}
        </h3>

        {partner.description && (
          <div
            className={`richText ${styles.description}`}
          >
            <BlocksRenderer
              content={
                partner.description
              }
            />
          </div>
        )}

        {partner.websiteUrl && (
          <a
            href={partner.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            Voir le site
          </a>
        )}
      </div>
    </article>
  );
}

function PartnerGroup({
  titleFr,
  titleEu,
  partners,
}: {
  titleFr: string;
  titleEu: string;
  partners: StrapiPartner[];
}) {
  return (
    <details
      className={styles.group}
      open
    >
      <summary
        className={styles.groupHeader}
      >
        <div
          className={styles.groupTitles}
        >
          <h2
            className={styles.groupTitle}
          >
            {titleFr}
          </h2>

          <h2
            className={styles.groupTitle}
          >
            {titleEu}
          </h2>
        </div>
      </summary>

      <div
        className={styles.groupContent}
      >
        {partners.length > 0 ? (
          <div className={styles.cards}>
            {partners.map(
              (partner) => (
                <PartnerCard
                  key={
                    partner.documentId
                  }
                  partner={partner}
                />
              )
            )}
          </div>
        ) : (
          <p className={styles.empty}>
            Aucun partenaire renseigné
            pour le moment.
          </p>
        )}
      </div>
    </details>
  );
}

export default async function PartnersPage({
  params,
}: PartnersPageProps) {
  const { houseSlug } = await params;

  const [
    partnersResponse,
  ] = await Promise.all([
    getPartners("fr"),
  ]);

  const partners = sortPartners(
    partnersResponse.data.filter(
      (partner) =>
        partner.house?.slug ===
        houseSlug
    )
  );

  const worksWithUs =
    partners.filter(
      (partner) =>
        partner.category ===
        "works_with_us"
    );

  const funders =
    partners.filter(
      (partner) =>
        partner.category ===
        "funders"
    );

  const artists =
    partners.filter(
      (partner) =>
        partner.category ===
        "artists"
    );

  return (
    <section className={styles.wrapper}>
     
      {/* TITRES DE PAGE */}
      <div
        className={
          styles.pageHeadings
        }
      >
        <h1
          className={
            styles.pageTitle
          }
        >
          Partenaires
        </h1>

        <h2
          className={
            styles.pageTitle
          }
        >
          Partnerak
        </h2>
      </div>

      {/* PARTENAIRES */}
      <PartnerGroup
        titleFr="On travaille avec elleux"
        titleEu="Gurekin lan egiten dute"
        partners={worksWithUs}
      />

      {/* FINANCEURS */}
      <PartnerGroup
        titleFr="Iels nous financent"
        titleEu="Finantzatzen gaituzte"
        partners={funders}
      />

      {/* ARTISTES */}
      <PartnerGroup
        titleFr="Artistes"
        titleEu="Artistak"
        partners={artists}
      />
    </section>
  );
}