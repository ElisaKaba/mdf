import type { SiteLocale } from "./getDefaultLocale";

const messages: Record<string, string> = {
  "L’événement est introuvable.": "Ekitaldia ez da aurkitu.",
  "Le titre de l’événement est manquant.": "Ekitaldiaren izenburua falta da.",
  "La Maison des Femmes est introuvable.": "Emazteen Etxea ez da aurkitu.",
  "Le prénom doit contenir au moins 2 caractères.": "Izenak gutxienez 2 karaktere izan behar ditu.",
  "Le prénom est trop long.": "Izena luzeegia da.",
  "Le nom doit contenir au moins 2 caractères.": "Deiturak gutxienez 2 karaktere izan behar ditu.",
  "Le nom est trop long.": "Deitura luzeegia da.",
  "L’adresse e-mail est obligatoire.": "Helbide elektronikoa nahitaezkoa da.",
  "Saisissez une adresse e-mail valide.": "Sartu baliozko helbide elektroniko bat.",
  "Le numéro de téléphone est trop long.": "Telefono zenbakia luzeegia da.",
  "Le nombre de participantes doit être un nombre entier.": "Parte-hartzaile kopuruak zenbaki osoa izan behar du.",
  "Il faut au moins 1 participante.": "Gutxienez parte-hartzaile bat behar da.",
  "Vous pouvez inscrire au maximum 10 participantes.": "Gehienez 10 parte-hartzaile inskriba ditzakezu.",
  "Le message ne peut pas dépasser 1000 caractères.": "Mezuak ezin ditu 1000 karaktere baino gehiago izan.",
  "Le message ne peut pas dépasser 2000 caractères.": "Mezuak ezin ditu 2000 karaktere baino gehiago izan.",
  "Le message doit contenir au moins 10 caractères.": "Mezuak gutxienez 10 karaktere izan behar ditu.",
  "La précision du sujet est trop longue.": "Gaiaren zehaztapena luzeegia da.",
  "Précisez votre demande.": "Zehaztu zure eskaera.",
  "Impossible de récupérer les informations de l’activité.": "Ezin izan da jardueraren informazioa eskuratu.",
  "Cette activité est introuvable.": "Jarduera hau ez da aurkitu.",
  "Cette activité ne correspond pas à la Maison des Femmes sélectionnée.": "Jarduera hau ez dagokio hautatutako Emazteen Etxeari.",
  "Les inscriptions à cette activité sont maintenant closes.": "Jarduera honetarako izen-ematea itxita dago.",
  "Impossible de vérifier les places disponibles pour le moment.": "Une honetan ezin da egiaztatu zenbat leku dauden libre.",
  "Cette activité est complète.": "Jarduera hau beteta dago.",
  "Cette adresse e-mail est déjà inscrite à cette activité.": "Helbide elektroniko hau dagoeneko inskribatuta dago jarduera honetan.",
  "L’inscription n’a pas pu être enregistrée. Réessayez dans quelques instants.": "Ezin izan da izen-ematea erregistratu. Saiatu berriro une baten buruan.",
  "Votre inscription a bien été enregistrée.": "Zure izen-ematea behar bezala erregistratu da.",
  "Votre message n’a pas pu être enregistré. Réessayez dans quelques instants.": "Ezin izan da mezua erregistratu. Saiatu berriro une baten buruan.",
  "Votre message a bien été envoyé. La Maison des Femmes pourra revenir vers vous.": "Zure mezua bidali da. Emazteen Etxea zurekin harremanetan jarri ahal izango da.",
  "Une erreur inattendue est survenue. Réessayez dans quelques instants.": "Ustekabeko errore bat gertatu da. Saiatu berriro une baten buruan.",
};

function translate(message: string, field = false): string {
  const remaining = message.match(/^Il ne reste que (\d+) places? disponibles?\.$/);
  if (remaining) return `${remaining[1]} leku baino ez dira gelditzen.`;
  return messages[message] ?? (field
    ? "Egiaztatu eremu honen balioa."
    : "Ustekabeko errore bat gertatu da. Saiatu berriro une baten buruan.");
}

type FormResponse = {
  message?: string;
  fieldErrors?: Record<string, string>;
  [key: string]: unknown;
};

export function localizeFormResponse(body: FormResponse, locale: SiteLocale): FormResponse {
  if (locale === "fr") return body;
  return {
    ...body,
    ...(body.message ? { message: translate(body.message) } : {}),
    ...(body.fieldErrors ? { fieldErrors: Object.fromEntries(
      Object.entries(body.fieldErrors).map(([field, message]) => [field, translate(message, true)])
    ) } : {}),
  };
}
