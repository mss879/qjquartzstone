import type { Metadata } from "next";
import { htmlLang, locales, type Locale } from "./i18n";

export function alternates(locale: Locale, path: string) {
  return {
    canonical: `/${locale}${path}`,
    languages: { ...Object.fromEntries(locales.map(item => [htmlLang[item], `/${item}${path}`])), "x-default": `/en${path}` },
  };
}

export const pageMetadata = (locale: Locale, path: string, { title, description }: { title: string; description: string }): Metadata => ({ title, description, alternates: alternates(locale, path) });
