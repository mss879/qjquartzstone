import en from "@/dictionaries/en.json";
import { mergeCopy } from "./copy";
import type { Locale } from "./i18n";

export type Dictionary = typeof en;

const translations: Record<Exclude<Locale, "en">, () => Promise<unknown>> = {
  si: () => import("@/dictionaries/si.json").then(module => module.default),
  ta: () => import("@/dictionaries/ta.json").then(module => module.default),
  "zh-hant": () => import("@/dictionaries/zh-hant.json").then(module => module.default),
};

export const getDictionary = async (locale: Locale): Promise<Dictionary> => locale === "en" ? en : mergeCopy(en, await translations[locale]());
