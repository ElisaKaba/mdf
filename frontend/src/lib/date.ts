export function formatDateTime(
  value?: string | null,
  locale: "fr" | "eu" = "fr"
) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  return new Intl.DateTimeFormat(
    locale === "fr" ? "fr-FR" : "eu-ES",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",

      hour: "2-digit",
      minute: "2-digit",

      timeZone: "Europe/Paris",
    }
  ).format(date);
}

export function formatTime(
  value?: string | null,
  locale: "fr" | "eu" = "fr"
) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  return new Intl.DateTimeFormat(
    locale === "fr" ? "fr-FR" : "eu-ES",
    {
      hour: "2-digit",
      minute: "2-digit",

      timeZone: "Europe/Paris",
    }
  ).format(date);
}

export function formatDate(
  value?: string | null,
  locale: "fr" | "eu" = "fr"
) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  return new Intl.DateTimeFormat(
    locale === "fr" ? "fr-FR" : "eu-ES",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",

      timeZone: "Europe/Paris",
    }
  ).format(date);
}