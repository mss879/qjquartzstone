import { notFound } from "next/navigation";
import ShortlistBoard from "@/components/site/shortlist-board";
import { PageHero } from "@/components/ui";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/shortlist">) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { meta } = await getDictionary(lang);
  return { ...pageMetadata(lang, "/shortlist", meta.shortlist), robots: { index: false } };
}

export default async function ShortlistPage({ params, searchParams }: PageProps<"/[lang]/shortlist">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const [dict, query] = await Promise.all([getDictionary(lang), searchParams]);
  return <main id="main">
    <PageHero number="03" label={dict.shortlist.label} title={dict.shortlist.title} copy={dict.shortlist.copy} />
    <ShortlistBoard encoded={typeof query.list === "string" ? query.list : undefined} t={dict.shortlist} remove={dict.common.remove} browse={dict.compare.browse} />
  </main>;
}
