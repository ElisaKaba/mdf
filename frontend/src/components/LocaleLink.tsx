"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useSiteLocale } from "./LocaleProvider";
import { localizedHref } from "@/lib/i18n/getDefaultLocale";

export default function LocaleLink({ href, ...props }: ComponentProps<typeof Link>) {
  const locale = useSiteLocale();
  return <Link {...props} href={typeof href === "string" ? localizedHref(href, locale) : href} />;
}
