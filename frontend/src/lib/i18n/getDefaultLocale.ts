export type SiteLocale = "fr" | "eu";

export function getDefaultLocaleFromHost(host?: string | null): SiteLocale {
  const hostname = (host ?? "").toLowerCase().split(":")[0];
  return hostname === "mdf-ee.eus" || hostname.endsWith(".mdf-ee.eus")
    ? "eu" : "fr";
}

export function resolveLocale(host?: string | null, lang?: string | string[]): SiteLocale {
  const value = Array.isArray(lang) ? lang[0] : lang;
  return value === "eu" || value === "fr" ? value : getDefaultLocaleFromHost(host);
}

export function localizedHref(href: string, locale: SiteLocale): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const url = new URL(href, "https://mdf.invalid");
  if (!url.searchParams.has("lang")) url.searchParams.set("lang", locale);
  return url.pathname + url.search + url.hash;
}
