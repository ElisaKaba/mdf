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

function getMediaUrl(path?: string | null) {
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

function sortPartners(partners: StrapiPartner[]) {
  return [...partners].sort(
    (a, b) =>
      (a.displayOrder ?? 999) -
      (b.displayOrder ?? 999)
  );
}

function PartnerCard({
  partner,
  locale,
}: {
  partner: StrapiPartner;
  locale: "fr" | "eu";
}) {
  const logoUrl = getMediaUrl(
    partner.logo?.url
  );

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
        <h3>{partner.name}</h3>

        {partner.description && (
          <div className={`richText ${styles.description}`}>
            <BlocksRenderer
              content={partner.description}
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
            {locale === "fr"
              ? "Voir le site"
              : "Webgunea ikusi"}
          </a>
        )}
      </div>
    </article>
  );
}

function PartnerGroup({
  title,
  partners,
  locale,
}: {
  title: string;
  partners: StrapiPartner[];
  locale: "fr" | "eu";
}) {
  return (
    <section className={styles.group}>
      <h2 className={styles.groupTitle}>
        {title}
      </h2>

      {partners.length > 0 ? (
        <div className={styles.cards}>
          {partners.map((partner) => (
            <PartnerCard
              key={partner.documentId}
              partner={partner}
              locale={locale}
            />
          ))}
        </div>
      ) : (
        <p className={styles.empty}>
          {locale === "fr"
            ? "Aucun partenaire renseigné pour le moment."
            : "Oraingoz ez dago bazkiderik."}
        </p>
      )}
    </section>
  );
}

export default async function PartnersPage({
  params,
}: PartnersPageProps) {
  const { houseSlug } = await params;

  const [responseFr, responseEu] =
    await Promise.all([
      getPartners("fr"),
      getPartners("eu"),
    ]);

  const partnersFr = sortPartners(
    responseFr.data.filter(
      (partner) =>
        partner.house?.slug === houseSlug
    )
  );

  const partnersEu = sortPartners(
    responseEu.data.filter(
      (partner) =>
        partner.house?.slug === houseSlug
    )
  );

  const worksWithUsFr =
    partnersFr.filter(
      (partner) =>
        partner.category ===
        "works_with_us"
    );

  const fundersFr =
    partnersFr.filter(
      (partner) =>
        partner.category === "funders"
    );

  const worksWithUsEu =
    partnersEu.filter(
      (partner) =>
        partner.category ===
        "works_with_us"
    );

  const fundersEu =
    partnersEu.filter(
      (partner) =>
        partner.category === "funders"
    );

  return (
    <section className={styles.wrapper}>
      <div className={styles.columns}>
        <div className={styles.languageColumn}>
          <p className={styles.language}>
            Français
          </p>

          <h1 className={styles.pageTitle}>
            Partenaires
          </h1>

          <PartnerGroup
            title="On travaille avec eux"
            partners={worksWithUsFr}
            locale="fr"
          />

          <PartnerGroup
            title="Ils nous financent"
            partners={fundersFr}
            locale="fr"
          />
        </div>

        <div className={styles.languageColumn}>
          <p className={styles.language}>
            Euskara
          </p>

          <h2 className={styles.pageTitle}>
            Partnerak
          </h2>

          <PartnerGroup
            title="Gurekin lan egiten dute"
            partners={worksWithUsEu}
            locale="eu"
          />

          <PartnerGroup
            title="Finantzatzen gaituzte"
            partners={fundersEu}
            locale="eu"
          />
        </div>
      </div>
    </section>
  );
}