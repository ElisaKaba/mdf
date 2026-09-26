import Image from "next/image";
import Link from "next/link";

import {
  BlocksRenderer,
  type BlocksContent,
} from "@strapi/blocks-react-renderer";

import type { StrapiJoin } from "@/lib/strapi/join";

import styles from "./JoinDetail.module.css";

type JoinDetailProps = {
  joinFr: StrapiJoin;
  joinEu?: StrapiJoin;
  houseSlug: string;
  donationUrl?: string | null;
  defaultLocale: "fr" | "eu";
};

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ??
  "http://localhost:1337";

function getMediaUrl(path?: string) {
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

function isBlocksContent(
  content:
    | BlocksContent
    | string
    | null
    | undefined
): content is BlocksContent {
  return Array.isArray(content);
}

function RichContent({
  content,
}: {
  content:
    | BlocksContent
    | string
    | null
    | undefined;
}) {
  if (!content) {
    return null;
  }

  if (isBlocksContent(content)) {
    return (
      <BlocksRenderer
        content={content}
      />
    );
  }

  return <p>{content}</p>;
}

type SupportCardProps = {
  title?: string | null;
  content?:
    | BlocksContent
    | string
    | null;
  buttonLabel: string;
  href: string;
  external?: boolean;
};

function SupportCard({
  title,
  content,
  buttonLabel,
  href,
  external = false,
}: SupportCardProps) {
  if (!title && !content) {
    return null;
  }

  return (
    <article className={styles.supportCard}>
      {title && <h3>{title}</h3>}

      {content && (
        <div
          className={`richText ${styles.cardText}`}
        >
          <RichContent
            content={content}
          />
        </div>
      )}

      {external ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.cardButton}
        >
          {buttonLabel}
        </a>
      ) : (
        <Link
          href={href}
          className={styles.cardButton}
        >
          {buttonLabel}
        </Link>
      )}
    </article>
  );
}

export default function JoinDetail({
  joinFr,
  joinEu,
  houseSlug,
  donationUrl,
  defaultLocale,
}: JoinDetailProps) {
  const image =
    joinFr.image?.[0];

  const imageUrl =
    getMediaUrl(image?.url);

  const contactUrlFr =
  `/${houseSlug}/contact?lang=fr`;

const contactUrlEu =
  `/${houseSlug}/contact?lang=eu`;

  const frenchIntro = (
    <article className={styles.column}>
      <h1>{joinFr.title}</h1>

      <div
        className={`richText ${styles.description}`}
      >
        <RichContent
          content={joinFr.description}
        />
      </div>
    </article>
  );

  const basqueIntro = (
    <article className={styles.column}>
      {joinEu ? (
        <>
          <h2>{joinEu.title}</h2>

          <div
            className={`richText ${styles.description}`}
          >
            <RichContent
              content={joinEu.description}
            />
          </div>
        </>
      ) : (
        <p className={styles.empty}>
          Euskarazko edukia ez dago
          oraindik erabilgarri.
        </p>
      )}
    </article>
  );

  const volunteerFr = (
    <SupportCard
      title={joinFr.volunteerTitle}
      content={joinFr.volunteerText}
      buttonLabel="Nous contacter"
      href={contactUrlFr}
    />
  );

  const volunteerEu = joinEu ? (
    <SupportCard
      title={joinEu.volunteerTitle}
      content={joinEu.volunteerText}
      buttonLabel="Harremanetan jarri"
      href={contactUrlEu}
    />
  ) : null;

  const financialFr = donationUrl ? (
    <SupportCard
      title={joinFr.financialTitle}
      content={joinFr.financialText}
      buttonLabel="Faire un don"
      href={donationUrl}
      external
    />
  ) : null;

  const financialEu =
    donationUrl && joinEu ? (
      <SupportCard
        title={joinEu.financialTitle}
        content={joinEu.financialText}
        buttonLabel="Dohaintza egin"
        href={donationUrl}
        external
      />
    ) : null;

  const patronFr = (
    <SupportCard
      title={joinFr.patronTitle}
      content={joinFr.patronText}
      buttonLabel="Nous contacter"
      href={contactUrlFr}
    />
  );

  const patronEu = joinEu ? (
    <SupportCard
      title={joinEu.patronTitle}
      content={joinEu.patronText}
      buttonLabel="Harremanetan jarri"
      href={contactUrlEu}
    />
  ) : null;

  return (
    <section className={styles.wrapper}>
      {/* IMAGE DE TÊTE */}
      {/* {imageUrl && (
        <div className={styles.imageWrapper}>
          <Image
            src={imageUrl}
            alt={
              image?.alternativeText?.trim() ||
              joinFr.title
            }
            width={image?.width ?? 1200}
            height={image?.height ?? 600}
            className={styles.image}
            priority
          />
        </div>
      )} */}

      <div>
        <img
          src="/images/nous-soutenir.png"
          alt="Soutien"
          className="localeSubImage"
        />
      </div>

      {/* INTRODUCTION */}
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

      {/* DEVENIR BÉNÉVOLE */}
      <div className={styles.supportRow}>
        {defaultLocale === "eu" ? (
          <>
            {volunteerEu}
            {volunteerFr}
          </>
        ) : (
          <>
            {volunteerFr}
            {volunteerEu}
          </>
        )}
      </div>

      {/* SOUTIEN FINANCIER */}
      {donationUrl && (
        <div className={styles.supportRow}>
          {defaultLocale === "eu" ? (
            <>
              {financialEu}
              {financialFr}
            </>
          ) : (
            <>
              {financialFr}
              {financialEu}
            </>
          )}
        </div>
      )}

      {/* DEVENIR MÉCÈNE */}
      <div className={styles.supportRow}>
        {defaultLocale === "eu" ? (
          <>
            {patronEu}
            {patronFr}
          </>
        ) : (
          <>
            {patronFr}
            {patronEu}
          </>
        )}
      </div>
    </section>
  );
}