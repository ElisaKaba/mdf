import { headers } from "next/headers";
import { resolveLocale } from "@/lib/i18n/getDefaultLocale";
import legalStyles from "../LegalPages.module.css";
import styles from "./PolitiqueConfidentialite.module.css";

type PageProps = {
  searchParams: Promise<{ lang?: string | string[] }>;
};

export default async function PolitiqueConfidentialitePage({ searchParams }: PageProps) {
  const locale = resolveLocale((await headers()).get("host"), (await searchParams).lang);
  const frenchContent = (
<section lang="fr" className={styles.container}>
        <h1>Politique de confidentialité</h1>

        <p className={styles.intro}>
          La Maison des Femmes d’Iparralde – Iparraldeko Emazteen
          Etxea accorde une attention particulière à la protection
          des données personnelles des personnes qui utilisent son
          site internet.
        </p>

        <p>
          La présente politique explique quelles données sont
          collectées, pourquoi elles sont utilisées, qui peut y
          accéder, combien de temps elles sont conservées et quels
          sont vos droits.
        </p>

        <section>
          <h2>1. Responsable du traitement</h2>

          <p>
            Le responsable du traitement est :
          </p>

          <p>
            <strong>
              Iparraldeko Emazteen Etxea – Maison des Femmes
              d’Iparralde
            </strong>
            <br />
            100 allée de Oihangaray
            <br />
            64122 Urrugne
            <br />
            France
          </p>

          <p>
            Pour toute question relative aux données personnelles ou
            pour exercer vos droits :
          </p>

          <p>
            <a href="mailto:emazteen.etxea@gmail.com">
              emazteen.etxea@gmail.com
            </a>
          </p>
        </section>

        <section>
          <h2>2. Données collectées</h2>

          <h3>Inscription à une activité ou un événement</h3>

          <p>
            Lors d’une inscription, les données suivantes peuvent
            être collectées :
          </p>

          <ul>
            <li>nom ;</li>
            <li>prénom ;</li>
            <li>adresse e-mail ;</li>
            <li>numéro de téléphone, lorsqu’il est renseigné ;</li>
            <li>nombre de participantes inscrites ;</li>
            <li>activité ou événement concerné ;</li>
            <li>
              contenu du message facultatif éventuellement transmis
              avec l’inscription.
            </li>
          </ul>

          <p>
            Le numéro de téléphone et le message sont facultatifs.
          </p>

          <p>
            Aucune donnée sensible n’est demandée dans le formulaire
            d’inscription. Il est demandé aux utilisatrices de ne pas
            transmettre dans le champ libre d’informations sensibles
            qui ne seraient pas nécessaires à la gestion de leur
            inscription.
          </p>

          <h3>Formulaire de contact</h3>

          <p>
            Lors de l’utilisation du formulaire de contact, les
            données suivantes sont collectées :
          </p>

          <ul>
            <li>nom ;</li>
            <li>prénom ;</li>
            <li>adresse e-mail ;</li>
            <li>sujet de la demande ;</li>
            <li>contenu du message.</li>
          </ul>

          <p>
            Il est demandé aux utilisatrices de ne pas transmettre
            dans le champ libre d’informations sensibles qui ne
            seraient pas nécessaires au traitement de leur demande.
          </p>
        </section>

        <section>
          <h2>3. Finalités des traitements</h2>

          <h3>Gestion des inscriptions</h3>

          <p>
            Les données d’inscription sont utilisées pour :
          </p>

          <ul>
            <li>
              enregistrer les participantes à une activité ou un
              événement ;
            </li>

            <li>
              gérer le nombre de places disponibles ;
            </li>

            <li>
              contacter les personnes inscrites lorsque cela est
              nécessaire au bon déroulement de l’activité ;
            </li>

            <li>
              prendre en compte les informations facultatives
              transmises avec l’inscription ;
            </li>

            <li>
              assurer le suivi administratif des inscriptions.
            </li>
          </ul>

          <p>
            La base légale de ce traitement est l’exécution de mesures
            prises à la demande de la personne concernée en vue de son
            inscription et de sa participation à l’activité.
          </p>

          <h3>Bilans d’activité</h3>

          <p>
            Les informations relatives aux inscriptions peuvent
            également être utilisées pour établir les bilans
            d’activité de l’association et suivre l’évolution de ses
            actions.
          </p>

          <p>
            La Maison des Femmes d’Iparralde poursuit à ce titre son
            intérêt légitime à documenter, évaluer et rendre compte de
            son activité associative.
          </p>

          <p>
            Les données sont anonymisées lorsque l’identification des
            personnes n’est plus nécessaire.
          </p>

          <h3>Gestion des demandes de contact</h3>

          <p>
            Les données du formulaire de contact sont utilisées
            exclusivement pour recevoir, orienter et traiter les
            demandes adressées à la Maison des Femmes d’Iparralde et,
            lorsque cela est nécessaire, y répondre.
          </p>

          <p>
            Ce traitement repose sur l’intérêt légitime de
            l’association à répondre aux personnes qui la contactent.
          </p>
        </section>

        <section>
          <h2>4. Caractère obligatoire des informations</h2>

          <p>
            Les champs signalés comme obligatoires sont nécessaires
            pour permettre le traitement de l’inscription ou de la
            demande.
          </p>

          <p>
            À défaut de fournir ces informations, l’inscription ou
            l’envoi du formulaire ne pourra pas être traité.
          </p>
        </section>

        <section>
          <h2>5. Destinataires des données</h2>

          <p>
            Les données personnelles ne sont accessibles qu’aux
            personnes qui en ont besoin dans le cadre de leurs
            missions.
          </p>

          <p>Peuvent notamment y avoir accès :</p>

          <ul>
            <li>
              les salariées habilitées de la Maison des Femmes
              d’Iparralde ;
            </li>

            <li>
              les bénévoles expressément autorisées à gérer les
              activités ou les demandes concernées ;
            </li>

            <li>
              la personne chargée de la maintenance technique du site
              lorsqu’un accès est strictement nécessaire à une
              intervention.
            </li>
          </ul>

          <p>
            Les accès techniques et administratifs sont limités selon
            le principe du moindre privilège.
          </p>
        </section>

        <section>
          <h2>6. Prestataires techniques</h2>

          <p>
            Le site utilise ou peut utiliser plusieurs prestataires
            techniques nécessaires à son fonctionnement.
          </p>

          <h3>DigitalOcean</h3>

          <p>
            DigitalOcean est utilisé pour l’hébergement des
            applications, de la base de données et des médias du site.
            Les ressources de production sont configurées dans une
            région située dans l’Union européenne.
          </p>

          <h3>Supabase</h3>

          <p>
            Supabase peut être utilisé temporairement pour le stockage
            technique de certaines données issues des formulaires
            pendant la phase de transition vers l’infrastructure de
            production.
          </p>

          <h3>Google – Gmail</h3>

          <p>
            Gmail est utilisé par l’association pour recevoir et
            traiter les courriels adressés à{" "}
            <a href="mailto:emazteen.etxea@gmail.com">
              emazteen.etxea@gmail.com
            </a>
            .
          </p>

          <h3>OVHcloud</h3>

          <p>
            OVHcloud est utilisé notamment pour la gestion des noms de
            domaine et des services de messagerie associés aux
            domaines de l’association.
          </p>
        </section>

        <section>
          <h2>7. Transferts de données hors Union européenne</h2>

          <p>
            Certains prestataires utilisés par l’association peuvent
            être établis hors de l’Union européenne ou faire appel à
            des sous-traitants situés hors de l’Espace économique
            européen.
          </p>

          <p>
            Lorsque des transferts internationaux de données
            personnelles ont lieu, ils sont encadrés conformément à la
            réglementation applicable.
          </p>

          <p>
            L’association privilégie lorsque cela est possible le
            stockage principal des données dans une région située dans
            l’Union européenne.
          </p>
        </section>

        <section>
          <h2>8. Durées de conservation</h2>

          <h3>Inscriptions aux activités</h3>

          <p>
            Les données nominatives liées aux inscriptions sont
            conservées pendant une durée maximale de{" "}
            <strong>deux ans</strong> à compter de l’événement ou de
            l’activité concernée.
          </p>

          <p>
            Cette durée permet à l’association d’assurer le suivi de
            ses activités et de préparer ses bilans.
          </p>

          <p>
            À l’issue de cette période, les informations permettant
            d’identifier directement les personnes sont supprimées ou
            anonymisées.
          </p>

          <p>
            Les statistiques véritablement anonymisées peuvent être
            conservées plus longtemps.
          </p>

          <h3>Demandes de contact</h3>

          <p>
            Les informations issues du formulaire de contact sont
            conservées pendant une durée maximale de{" "}
            <strong>un an</strong> à compter du dernier échange avec la
            personne concernée.
          </p>
        </section>

        <section>
          <h2>9. Sécurité</h2>

          <p>
            La Maison des Femmes d’Iparralde met en œuvre des mesures
            techniques et organisationnelles destinées à protéger les
            données personnelles.
          </p>

          <p>Ces mesures comprennent notamment :</p>

          <ul>
            <li>l’utilisation de connexions HTTPS ;</li>
            <li>des accès individuels aux outils d’administration ;</li>
            <li>
              la limitation des droits d’accès selon les fonctions ;
            </li>
            <li>l’absence de comptes administrateurs partagés ;</li>
            <li>l’utilisation de mots de passe robustes ;</li>
            <li>
              l’activation de l’authentification à deux facteurs
              lorsqu’elle est disponible ;
            </li>
            <li>des sauvegardes régulières ;</li>
            <li>
              la maintenance et les mises à jour de sécurité des
              logiciels utilisés.
            </li>
          </ul>
        </section>

        <section>
          <h2>10. Cookies et traceurs</h2>

          <p>
            Le site n’utilise actuellement aucun outil publicitaire,
            aucun pixel de suivi et aucun outil de mesure d’audience
            nécessitant le consentement des utilisatrices.
          </p>

          <p>
            Il peut utiliser uniquement des éléments techniques
            nécessaires au fonctionnement du site ou à la mémorisation
            d’un choix effectué par l’utilisatrice, par exemple un
            choix de langue.
          </p>

          <p>
            Ces éléments ne sont pas utilisés à des fins publicitaires
            ou de profilage.
          </p>

          <p>
            En conséquence, aucun bandeau de consentement aux cookies
            n’est nécessaire dans la configuration actuelle du site.
          </p>
        </section>

        <section>
          <h2>11. Vos droits</h2>

          <p>
            Toute personne concernée dispose, selon les conditions
            prévues par la réglementation, des droits suivants :
          </p>

          <ul>
            <li>droit d’accès à ses données ;</li>
            <li>droit de rectification ;</li>
            <li>droit à l’effacement ;</li>
            <li>droit à la limitation du traitement ;</li>
            <li>
              droit d’opposition aux traitements fondés sur l’intérêt
              légitime ;
            </li>
            <li>
              droit à la portabilité lorsque les conditions prévues par
              le RGPD sont réunies.
            </li>
          </ul>

          <p>
            Pour exercer ces droits :
          </p>

          <p>
            <a href="mailto:emazteen.etxea@gmail.com">
              emazteen.etxea@gmail.com
            </a>
          </p>

          <p>
            La Maison des Femmes d’Iparralde répond aux demandes dans
            les meilleurs délais et au plus tard dans un délai d’un
            mois à compter de leur réception.
          </p>

          <p>
            Toute personne dispose également du droit d’introduire une
            réclamation auprès de la Commission nationale de
            l’informatique et des libertés – CNIL.
          </p>
        </section>

        <section>
          <h2>12. Absence de vente ou de prospection commerciale</h2>

          <p>
            Les données recueillies sur le site ne sont ni vendues ni
            louées à des tiers.
          </p>

          <p>
            Elles ne sont pas utilisées à des fins de prospection
            commerciale ou publicitaire.
          </p>
        </section>

        <section>
          <h2>13. Mise à jour</h2>

          <p>
            La présente politique est mise à jour lorsque les
            traitements de données, l’architecture technique ou les
            prestataires utilisés par le site évoluent.
          </p>

          <p>
            <strong>Dernière mise à jour : septembre 2026.</strong>
          </p>
        </section>
      </section>
  );
  const basqueContent = (
<section lang="eu" className={styles.container}>
        <h1> Pribatutasun-politika </h1>

        <p className={styles.intro}> Iparraldeko Emazteen Etxeak – Maison des Femmes d’Iparralde-k arreta berezia jartzen du bere webgunea erabiltzen duten pertsonen datu pertsonalak babesteko. </p>

        <p> Politika honek azaltzen du zer datu biltzen diren, zertarako erabiltzen diren, nork eskura ditzakeen, zenbat denboraz gordetzen diren eta zer eskubide dituzun. </p>

        <section>
          <h2> 1. Tratamenduaren arduraduna </h2>

          <p> Tratamenduaren arduraduna hau da: </p>

          <p>
            <strong> Iparraldeko Emazteen Etxea – Maison des Femmes d’Iparralde </strong>
            <br /> 100 allée de Oihangaray <br /> 64122 Urrugne <br /> Frantzia </p>

          <p> Datu pertsonalei buruzko edozein galderatarako edo zure eskubideak baliatzeko: </p>

          <p>
            <a href="mailto:emazteen.etxea@gmail.com"> emazteen.etxea@gmail.com </a>
          </p>
        </section>

        <section>
          <h2> 2. Bildutako datuak </h2>

          <h3> Jarduera edo ekitaldi batean izena ematea </h3>

          <p> Izena ematean, honako datu hauek bil daitezke: </p>

          <ul>
            <li> deitura; </li>
            <li> izena; </li>
            <li> helbide elektronikoa; </li>
            <li> telefono zenbakia, ematen denean; </li>
            <li> izena emandako parte-hartzaile kopurua; </li>
            <li> dagokion jarduera edo ekitaldia; </li>
            <li> izen-ematearekin batera bidalitako aukerako mezuaren edukia. </li>
          </ul>

          <p> Telefono zenbakia eta mezua aukerakoak dira. </p>

          <p> Izen-emateko formularioan ez da datu sentikorrik eskatzen. Erabiltzaileei eskatzen zaie testu libreko eremuan ez bidaltzeko izen-ematea kudeatzeko beharrezkoak ez diren informazio sentikorrak. </p>

          <h3> Harremanetarako formularioa </h3>

          <p> Harremanetarako formularioa erabiltzean, honako datu hauek biltzen dira: </p>

          <ul>
            <li> deitura; </li>
            <li> izena; </li>
            <li> helbide elektronikoa; </li>
            <li> eskaeraren gaia; </li>
            <li> mezuaren edukia. </li>
          </ul>

          <p> Erabiltzaileei eskatzen zaie testu libreko eremuan ez bidaltzeko beren eskaera tratatzeko beharrezkoak ez diren informazio sentikorrak. </p>
        </section>

        <section>
          <h2> 3. Tratamenduen helburuak </h2>

          <h3> Izen-emateen kudeaketa </h3>

          <p> Izen-emateko datuak honako hauetarako erabiltzen dira: </p>

          <ul>
            <li> jarduera edo ekitaldi batean parte-hartzaileak erregistratzeko; </li>

            <li> libre dauden lekuen kopurua kudeatzeko; </li>

            <li> izena emandako pertsonekin harremanetan jartzeko, jarduera ongi gauzatzeko beharrezkoa denean; </li>

            <li> izen-ematearekin batera emandako aukerako informazioa kontuan hartzeko; </li>

            <li> izen-emateen jarraipen administratiboa egiteko. </li>
          </ul>

          <p> Tratamendu honen lege-oinarria interesdunak eskatutako neurriak gauzatzea da, jardueran izena eman eta parte hartu ahal izateko. </p>

          <h3> Jarduera-balantzeak </h3>

          <p> Izen-emateei buruzko informazioa elkartearen jarduera-balantzeak egiteko eta haren ekintzen bilakaeraren jarraipena egiteko ere erabil daiteke. </p>

          <p> Iparraldeko Emazteen Etxeak bere elkarte-jarduera dokumentatzeko, ebaluatzeko eta haren berri emateko interes legitimoa du. </p>

          <p> Pertsonak identifikatzea beharrezkoa ez denean, datuak anonimizatzen dira. </p>

          <h3> Harremanetarako eskaeren kudeaketa </h3>

          <p> Harremanetarako formularioaren datuak Iparraldeko Emazteen Etxeari zuzendutako eskaerak jasotzeko, bideratzeko eta tratatzeko erabiltzen dira soilik, eta, beharrezkoa denean, erantzuteko. </p>

          <p> Tratamendu honen oinarria elkartearekin harremanetan jartzen diren pertsonei erantzuteko duen interes legitimoa da. </p>
        </section>

        <section>
          <h2> 4. Nahitaezko informazioa </h2>

          <p> Nahitaezko gisa adierazitako eremuak beharrezkoak dira izen-ematea edo eskaera tratatzeko. </p>

          <p> Informazio hori eman ezean, ezin izango da izen-ematea edo bidalitako formularioa tratatu. </p>
        </section>

        <section>
          <h2> 5. Datuen hartzaileak </h2>

          <p> Datu pertsonalak beren eginkizunak betetzeko behar dituzten pertsonek soilik eskura ditzakete. </p>

          <p> Besteak beste, honako hauek izan dezakete sarbidea: </p>

          <ul>
            <li> Iparraldeko Emazteen Etxeko langile baimenduek; </li>

            <li> dagokion jarduera edo eskaera kudeatzeko berariazko baimena duten boluntarioek; </li>

            <li> webgunearen mantentze teknikoaz arduratzen den pertsonak, esku-hartze baterako sarbidea ezinbestekoa denean. </li>
          </ul>

          <p> Sarbide teknikoak eta administratiboak gutxieneko pribilegioaren printzipioaren arabera mugatzen dira. </p>
        </section>

        <section>
          <h2> 6. Zerbitzu teknikoen hornitzaileak </h2>

          <p> Webguneak bere funtzionamendurako beharrezkoak diren hainbat zerbitzu teknikoen hornitzaile erabiltzen ditu edo erabil ditzake. </p>

          <h3> DigitalOcean </h3>

          <p> DigitalOcean webgunearen aplikazioak, datu-basea eta multimedia-fitxategiak ostatatzeko erabiltzen da. Produkzioko baliabideak Europar Batasunean kokatutako eskualde batean konfiguratuta daude. </p>

          <h3> Supabase </h3>

          <p> Supabase aldi baterako erabil daiteke formularioetatik datozen datu batzuk teknikoki gordetzeko, produkzioko azpiegiturara igarotzeko fasean. </p>

          <h3> Google – Gmail </h3>

          <p> Elkarteak Gmail erabiltzen du honako helbide honetara bidalitako mezu elektronikoak jasotzeko eta tratatzeko: {" "}
            <a href="mailto:emazteen.etxea@gmail.com"> emazteen.etxea@gmail.com </a> . </p>

          <h3> OVHcloud </h3>

          <p> OVHcloud, bereziki, elkartearen domeinu-izenak eta domeinu horiei lotutako posta elektronikoaren zerbitzuak kudeatzeko erabiltzen da. </p>
        </section>

        <section>
          <h2> 7. Datuen transferentziak Europar Batasunetik kanpo </h2>

          <p> Elkarteak erabiltzen dituen hornitzaile batzuk Europar Batasunetik kanpo egon daitezke, edo Europako Esparru Ekonomikotik kanpo dauden azpikontratistak erabil ditzakete. </p>

          <p> Datu pertsonalen nazioarteko transferentziak egiten direnean, aplikatzekoa den araudiaren arabera arautzen dira. </p>

          <p> Ahal denean, elkarteak datuen biltegiratze nagusia Europar Batasunean kokatutako eskualde batean egitea lehenesten du. </p>
        </section>

        <section>
          <h2> 8. Gordetzeko epeak </h2>

          <h3> Jardueretarako izen-emateak </h3>

          <p> Izen-emateei lotutako datu nominalak gehienez honako epe honetan gordetzen dira: {" "}
            <strong> bi urte </strong> , dagokion ekitaldia edo jarduera egiten denetik zenbatuta. </p>

          <p> Epe horrek elkarteari aukera ematen dio bere jardueren jarraipena egiteko eta balantzeak prestatzeko. </p>

          <p> Epe hori amaitzean, pertsonak zuzenean identifikatzeko aukera ematen duen informazioa ezabatu edo anonimizatu egiten da. </p>

          <p> Benetan anonimizatutako estatistikak denbora luzeagoz gorde daitezke. </p>

          <h3> Harremanetarako eskaerak </h3>

          <p> Harremanetarako formularioaren informazioa gehienez honako epe honetan gordetzen da: {" "}
            <strong> urte bat </strong> , interesdunarekin izandako azken komunikaziotik zenbatuta. </p>
        </section>

        <section>
          <h2> 9. Segurtasuna </h2>

          <p> Iparraldeko Emazteen Etxeak datu pertsonalak babesteko neurri teknikoak eta antolakuntzakoak ezartzen ditu. </p>

          <p> Neurri horien artean daude, besteak beste: </p>

          <ul>
            <li> HTTPS konexioak erabiltzea; </li>
            <li> administrazio-tresnetarako sarbide indibidualak; </li>
            <li> sarbide-eskubideak eginkizunen arabera mugatzea; </li>
            <li> administratzaile-kontuak ez partekatzea; </li>
            <li> pasahitz sendoak erabiltzea; </li>
            <li> bi faktoreko autentifikazioa aktibatzea, erabilgarri dagoenean; </li>
            <li> aldizkako babeskopiak egitea; </li>
            <li> erabiltzen diren programen mantentzea eta segurtasun-eguneraketak egitea. </li>
          </ul>
        </section>

        <section>
          <h2> 10. Cookieak eta jarraipen-tresnak </h2>

          <p> Webguneak gaur egun ez du publizitate-tresnarik, jarraipen-pixelik edo erabiltzaileen baimena behar duen audientzia neurtzeko tresnarik erabiltzen. </p>

          <p> Webgunearen funtzionamendurako edo erabiltzaileak egindako hautu bat gogoratzeko beharrezkoak diren elementu teknikoak soilik erabil ditzake, adibidez hizkuntza-hautua gordetzeko. </p>

          <p> Elementu horiek ez dira publizitaterako edo profilak egiteko erabiltzen. </p>

          <p> Ondorioz, webgunearen egungo konfigurazioan ez da beharrezkoa cookieak onartzeko baimen-banderolarik. </p>
        </section>

        <section>
          <h2> 11. Zure eskubideak </h2>

          <p> Interesdun orok honako eskubide hauek ditu, araudiak ezarritako baldintzetan: </p>

          <ul>
            <li> bere datuak eskuratzeko eskubidea; </li>
            <li> datuak zuzentzeko eskubidea; </li>
            <li> datuak ezabatzeko eskubidea; </li>
            <li> tratamendua mugatzeko eskubidea; </li>
            <li> interes legitimoan oinarritutako tratamenduei aurka egiteko eskubidea; </li>
            <li> datuen eramangarritasunerako eskubidea, Datuak Babesteko Erregelamendu Orokorrak (DBEO) ezarritako baldintzak betetzen direnean. </li>
          </ul>

          <p> Eskubide horiek baliatzeko: </p>

          <p>
            <a href="mailto:emazteen.etxea@gmail.com"> emazteen.etxea@gmail.com </a>
          </p>

          <p> Iparraldeko Emazteen Etxeak ahalik eta lasterren erantzuten die eskaerei, eta gehienez hilabeteko epean, jasotzen dituenetik zenbatuta. </p>

          <p> Pertsona orok eskubidea du, halaber, erreklamazio bat aurkezteko Informatikaren eta Askatasunen Batzorde Nazionalean (CNIL). </p>
        </section>

        <section>
          <h2> 12. Datuak ez saltzea eta merkataritza-prospekziorik ez egitea </h2>

          <p> Webgunean bildutako datuak ez zaizkie hirugarrenei saltzen edo alokatzen. </p>

          <p> Ez dira merkataritza-prospekziorako edo publizitaterako erabiltzen. </p>
        </section>

        <section>
          <h2> 13. Eguneratzea </h2>

          <p> Politika hau eguneratzen da webguneak erabiltzen dituen datu-tratamenduak, arkitektura teknikoa edo hornitzaileak aldatzen direnean. </p>

          <p>
            <strong> Azken eguneratzea: 2026ko iraila. </strong>
          </p>
        </section>
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
