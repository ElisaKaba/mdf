export type SiteLocale = "fr" | "eu";

export function getDefaultLocaleFromHost(
  host?: string | null
): SiteLocale {
  if (!host) {
    return "fr";
  }

  const normalizedHost = host.toLowerCase();

  if (
    normalizedHost.includes("mdf-ee.eus") ||
    normalizedHost.includes("localhost")
  ) {
    return "eu";
  }

  return "fr";
}