import { notFound } from "next/navigation";
import Catalogue from "@/components/site/catalogue";
import { PageHero } from "@/components/ui";
import { parseFilters } from "@/lib/catalogue";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { allProducts } from "@/lib/data/products";

export async function generateMetadata({ params }: PageProps<"/[lang]/collections">) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { meta } = await getDictionary(lang);
  return pageMetadata(lang, "/collections", meta.collections);
}

export default async function CollectionsPage({ params, searchParams }: PageProps<"/[lang]/collections">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const [dict, query] = await Promise.all([getDictionary(lang), searchParams]);
  return <main id="main">
    <PageHero number="02" label={dict.catalogue.label} title={dict.catalogue.title} copy={dict.catalogue.copy} />
    <Catalogue products={allProducts} t={dict.catalogue} common={dict.common} initial={parseFilters(query)} />
  </main>;
}
