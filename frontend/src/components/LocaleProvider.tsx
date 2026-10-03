"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import type { SiteLocale } from "@/lib/i18n/getDefaultLocale";

const LocaleContext = createContext<SiteLocale>("fr");
export const useSiteLocale = () => useContext(LocaleContext);

export default function LocaleProvider({ children, defaultLocale }: {
  children: ReactNode; defaultLocale: SiteLocale;
}) {
  const lang = useSearchParams().get("lang");
  const locale = lang === "fr" || lang === "eu" ? lang : defaultLocale;
  useEffect(() => { document.documentElement.lang = locale; }, [locale]);
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}
