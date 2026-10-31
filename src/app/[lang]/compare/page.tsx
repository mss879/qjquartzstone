import { notFound } from "next/navigation";
import CompareBoard from "@/components/site/compare-board";
import { PageHero } from "@/components/ui";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { allProducts } from "@/lib/data/products";

export async function generateMetadata({ params }: PageProps<"/[lang]/compare">) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { meta } = await getDictionary(lang);
  return { ...pageMetadata(lang, "/compare", meta.compare), robots: { index: false } };
}

export default async function ComparePage({ params, searchParams }: PageProps<"/[lang]/compare">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const [dict, query] = await Promise.all([getDictionary(lang), searchParams]);
  const linked = typeof query.surfaces === "string" ? query.surfaces.split(",").filter(Boolean) : [];
  return <main id="main">
    <PageHero number="03" label={dict.compare.label} title={dict.compare.title} copy={dict.compare.copy} />
    <CompareBoard products={allProducts} linked={linked} t={dict.compare} catalogue={dict.catalogue} common={dict.common} />
  </main>;
}
