import Image from "next/image";

import {
  BlocksRenderer,
  type BlocksContent,
} from "@strapi/blocks-react-renderer";

import {
  getAboutPages,
  type StrapiAboutPage,
} from "@/lib/strapi/about";
import { randomBytes } from "crypto";

type AboutPageProps = {
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

function sortAboutPages(
  pages: StrapiAboutPage[]
) {
  return [...pages].sort(
    (a, b) =>
      (a.displayOrder ?? 999) -
      (b.displayOrder ?? 999)
  );
}

function AboutContent({
  page,
}: {
  page: StrapiAboutPage;
}) {
  return (
    <section
      style={{
        minWidth: 0,
      }}
    >
      <h2
        style={{
          margin: "0 0 1rem",
          color: "var(--color-primary)",
          fontFamily:
            "var(--font-beautifully-delicious), sans-serif",
          fontSize: "1.8rem",
          fontWeight: 400,
          lineHeight: 1.2,
        }}
      >
        {page.title}
      </h2>

      {page.summary && (
        <p
          style={{
            margin: "0 0 1rem",
            lineHeight: 1.65,
          }}
        >
          {page.summary}
        </p>
      )}

      {page.description && (
        <div className="richText">
          <BlocksRenderer
            content={
              page.description as BlocksContent
            }
          />
        </div>
      )}
    </section>
  );
}

export default async function AboutPage({
  params,
}: AboutPageProps) {
  const { houseSlug } = await params;

  const [
    responseFr,
    responseEu,
  ] = await Promise.all([
    getAboutPages("fr"),
    getAboutPages("eu"),
  ]);

  const pagesFr = sortAboutPages(
    responseFr.data.filter(
      (page) =>
        page.house?.slug === houseSlug
    )
  );

  const pagesEu = sortAboutPages(
    responseEu.data.filter(
      (page) =>
        page.house?.slug === houseSlug
    )
  );

  if (pagesFr.length === 0) {
    return (
      <section>
        <h1>Qui sommes-nous ?</h1>

        <p>
          Aucun contenu publié pour le moment.
        </p>
      </section>
    );
  }

  /*
   * L'image utilisée pour le bandeau
   * vient de la première entrée FR
   * selon displayOrder.
   */
  const pageImage =
    pagesFr[0]?.image?.[0];

 const imageUrl =
    getMediaUrl(
      
    pageImage?.url
     );
  return (
    <section
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "3rem",
      }}
    >
      {/* IMAGE BANDEAU */}
      {/* {imageUrl && (
      
          style={{
            width: "100%",
            height: "400px",

            overflow: "hidden",

            borderRadius:
              "var(--radius-md)",
          }}
        > */}
          <div>
          <img src= "/images/qui-sommes-nous.png" alt="Maison des femmes" className="quiImg"
            
            width={
              pageImage?.width ??
              1200
            }
            height={
              pageImage?.height ??
              800
            }
            style={{
              display: "block",
                 
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition:
                "center",
            }}
        
          />
        </div>
      

      {/* CONTENUS */}
      {pagesFr.map(
        (pageFr) => {
          const pageEu =
            pagesEu.find(
              (page) =>
                page.documentId ===
                pageFr.documentId
            ) ??
            pagesEu.find(
              (page) =>
                page.displayOrder ===
                pageFr.displayOrder
            );

          return (
            <div
              key={
                pageFr.documentId
              }
              style={{
                display: "grid",

                gridTemplateColumns:
                  "repeat(2, minmax(0, 1fr))",

                gap: "3rem",

                width: "100%",

                alignItems:
                  "start",
              }}
            >
              {/* FRANÇAIS */}
              <AboutContent
                page={pageFr}
              />

              {/* EUSKARA */}
              <div>
                {pageEu ? (
                  <AboutContent
                    page={pageEu}
                  />
                ) : (
                  <p
                    style={{
                      margin: 0,

                      color:
                        "var(--color-text-muted)",

                      fontStyle:
                        "italic",
                    }}
                  >
                    Euskarazko
                    edukia ez dago
                    oraindik
                    erabilgarri.
                  </p>
                )}
              </div>
            </div>
          );
        }
      )}
    </section>
  );
}