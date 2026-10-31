import Image from "next/image";
import { notFound } from "next/navigation";
import ResourceLibrary from "@/components/site/resource-library";
import { PageHero, SectionLabel } from "@/components/ui";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { technicalData } from "@/lib/specs";
import { resources } from "@/lib/data/content";

export async function generateMetadata({ params }: PageProps<"/[lang]/resources">) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { meta } = await getDictionary(lang);
  return pageMetadata(lang, "/resources", meta.resources);
}

export default async function ResourcesPage({ params }: PageProps<"/[lang]/resources">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const { resources: t } = dict;
  return <main id="main">
    <PageHero number="05" label={t.label} title={t.title} copy={t.copy} />
    <ResourceLibrary resources={resources} t={t} all={dict.common.all} />
    <section id="technical-data" className="data-section section-shell"><div className="section-heading"><SectionLabel number="02">{t.dataTitle}</SectionLabel><div><p className="heading-copy">{t.dataCopy}</p><Image className="slab-diagram" src="/images/archive/slab-diagram.webp" alt="QJ slab dimensions: 3200 by 1600 mm in 20 and 30 mm thicknesses" width={1000} height={448} sizes="(max-width: 900px) 90vw, 60vw" /></div></div>
      <div className="data-scroll"><table className="data-table"><thead><tr><th scope="col">{t.property}</th><th scope="col">{t.standard}</th><th scope="col">{t.result}</th></tr></thead><tbody>{technicalData.map(([property, standard, value]) => <tr key={property}><th scope="row">{property}</th><td>{standard}</td><td>{value}</td></tr>)}</tbody></table></div>
    </section>
  </main>;
}
