import { headers } from "next/headers";
import { resolveLocale } from "@/lib/i18n/getDefaultLocale";
import legalStyles from "../LegalPages.module.css";

type PageProps = {
  searchParams: Promise<{ lang?: string | string[] }>;
};

export default async function MentionsLegalesPage({ searchParams }: PageProps) {
  const locale = resolveLocale((await headers()).get("host"), (await searchParams).lang);
  const frenchContent = (
<section lang="fr" className={legalStyles.column}>
      <h1>Mentions légales</h1>

      <h2>Éditeur du site</h2>

      <p>
        Le présent site est édité par la Maison des Femmes
        d’Iparralde.
      </p>

      <p>
        Adresse : 100 allée de Oihangaray, 64122 Urrugne
      </p>

      <p>
        Contact :{" "}
        <a href="mailto:emazteen.etxea@gmail.com">
          emazteen.etxea@gmail.com
        </a>
      </p>

      <h2>Responsable de la publication</h2>

      <p>
        La responsable de la publication est la Maison des Femmes
        d’Iparralde.
      </p>

      <h2>Hébergement</h2>

      <p>
        Le site est destiné à être hébergé par DigitalOcean.
      </p>

      <p>
        DigitalOcean, LLC
        <br />
        101 Avenue of the Americas
        <br />
        New York, NY 10013
        <br />
        États-Unis
      </p>

      <h2>Propriété intellectuelle</h2>

      <p>
        Les contenus présents sur ce site, notamment les textes,
        photographies, illustrations, éléments graphiques et logos,
        sont protégés par les règles relatives à la propriété
        intellectuelle.
      </p>

      <p>
        Toute reproduction, représentation, modification ou
        utilisation de tout ou partie du site sans autorisation
        préalable est interdite, sauf exceptions prévues par la loi.
      </p>

      <h2>Protection des données personnelles</h2>

      <p>
        Les informations relatives à la collecte et au traitement des
        données personnelles sont détaillées dans la politique de
        confidentialité du site.
      </p>

      <h2>Responsabilité</h2>

      <p>
        La Maison des Femmes d’Iparralde s’efforce de fournir des
        informations aussi exactes et à jour que possible. Elle ne peut
        toutefois garantir l’absence d’erreurs ou d’omissions dans les
        contenus publiés.
      </p>

      <p>
        Les liens vers des sites externes sont proposés à titre
        informatif. La Maison des Femmes d’Iparralde n’est pas
        responsable du contenu de ces sites tiers.
      </p>
    </section>
  );
  const basqueContent = (
<section lang="eu" className={legalStyles.column}>
      <h1> Lege-oharrak </h1>

      <h2> Webgunearen argitaratzailea </h2>

      <p> Webgune hau Iparraldeko Emazteen Etxeak argitaratzen du. </p>

      <p> Helbidea: 100 allée de Oihangaray, 64122 Urrugne </p>

      <p> Harremana: {" "}
        <a href="mailto:emazteen.etxea@gmail.com"> emazteen.etxea@gmail.com </a>
      </p>

      <h2> Argitalpenaren arduraduna </h2>

      <p> Argitalpenaren arduraduna Iparraldeko Emazteen Etxea da. </p>

      <h2> Ostatatzea </h2>

      <p> Webgunea DigitalOcean-en ostatatzeko aurreikusita dago. </p>

      <p> DigitalOcean, LLC <br /> 101 Avenue of the Americas <br /> New York, NY 10013 <br /> Ameriketako Estatu Batuak </p>

      <h2> Jabetza intelektuala </h2>

      <p> Webgune honetako edukiak, bereziki testuak, argazkiak, ilustrazioak, elementu grafikoak eta logotipoak, jabetza intelektualari buruzko arauek babesten dituzte. </p>

      <p> Webgune osoa edo haren zati bat erreproduzitzea, jendaurrean aurkeztea, aldatzea edo erabiltzea debekatuta dago aurretiko baimenik gabe, legeak aurreikusitako salbuespenetan izan ezik. </p>

      <h2> Datu pertsonalen babesa </h2>

      <p> Datu pertsonalen bilketari eta tratamenduari buruzko informazioa webgunearen pribatutasun-politikan zehazten da. </p>

      <h2> Erantzukizuna </h2>

      <p> Iparraldeko Emazteen Etxea ahalik eta informazio zehatzena eta eguneratuena ematen ahalegintzen da. Hala ere, ezin du bermatu argitaratutako edukietan akatsik edo hutsunerik ez egotea. </p>

      <p> Kanpoko webguneetarako estekak informatzeko eskaintzen dira. Iparraldeko Emazteen Etxea ez da hirugarrenen webgune horien edukiaren erantzule. </p>
    </section>
  );
  return (
    <div className={legalStyles.page}>
      <div className={legalStyles.columns}>
        {locale === "eu" ? <>{basqueContent}{frenchContent}</> : <>{frenchContent}{basqueContent}</>}
      </div>
    </div>
  );
}
