import { lang } from "next/root-params";
import { PageHero, PillLink } from "@/components/ui";
import { getDictionary } from "@/lib/dictionaries";
import { defaultLocale, hasLocale } from "@/lib/i18n";

export default async function NotFound() {
  const current = await lang();
  const locale = hasLocale(current) ? current : defaultLocale;
  const { notFound: t } = await getDictionary(locale);
  return <main id="main"><PageHero number="404" label="QJ" title={t.title} copy={t.copy}><div className="not-found-cta"><PillLink href={`/${locale}`}>{t.cta}</PillLink></div></PageHero></main>;
}
