export const locales = ["en", "si", "ta", "zh-hant"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
export const LANG_COOKIE = "qj_lang";

export const localeNames: Record<Locale, string> = { en: "English", si: "සිංහල", ta: "தமிழ்", "zh-hant": "繁體中文" };
export const htmlLang: Record<Locale, string> = { en: "en", si: "si", ta: "ta", "zh-hant": "zh-Hant" };
export const countryLocales: Record<string, Locale> = { LK: "si", TW: "zh-hant", HK: "zh-hant", MO: "zh-hant" };

export const hasLocale = (value: string): value is Locale => (locales as readonly string[]).includes(value);

const browserLanguages = (header: string) => header.split(",").map(part => {
  const [tag, q] = part.trim().split(";q=");
  return { tag: tag.toLowerCase(), q: q ? Number(q) : 1 };
}).filter(item => item.tag && item.q > 0).sort((a, b) => b.q - a.q).map(item => item.tag);

function fromBrowser(tag: string): Locale | undefined {
  if (tag.startsWith("zh")) return /hant|tw|hk|mo/.test(tag) ? "zh-hant" : undefined;
  return locales.find(locale => locale === tag.split("-")[0]);
}

/** A remembered choice wins, then country, then the browser. Sri Lanka has two national languages, so a Tamil browser keeps Tamil there. */
export function detectLocale({ cookie, country, acceptLanguage }: { cookie?: string; country?: string; acceptLanguage?: string }): Locale {
  if (cookie && hasLocale(cookie)) return cookie;
  const preferred = browserLanguages(acceptLanguage ?? "").map(fromBrowser).filter(Boolean) as Locale[];
  const code = country?.toUpperCase();
  if (code === "LK" && preferred[0] === "ta") return "ta";
  if (code && countryLocales[code]) return countryLocales[code];
  return preferred[0] ?? defaultLocale;
}

export const localizedPath = (locale: Locale, path = "") => `/${locale}${path === "/" ? "" : path}`;

export function swapLocale(pathname: string, locale: Locale) {
  const [, first, ...rest] = pathname.split("/");
  return `/${[locale, ...(hasLocale(first) ? rest : [first, ...rest])].filter(Boolean).join("/")}`;
}
