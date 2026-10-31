import Image from "next/image";
import { notFound } from "next/navigation";
import InquiryForm from "@/components/site/inquiry-form";
import { Lines, PageHero, PillLink, SectionLabel } from "@/components/ui";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { qualityHighlights } from "@/lib/specs";

const stepImages = [
  { src: "/images/archive/quartz-mine.webp", alt: "QJ team members inspecting a quartz mining site", width: 1280, height: 698 },
  { src: "/images/archive/quartz-sand.webp", alt: "Fine quartz sand poured from a pair of hands", width: 1000, height: 664 },
  { src: "/images/archive/slab-inspection.webp", alt: "QJ staff inspecting a polished quartz slab in the factory", width: 1000, height: 562 },
  { src: "/images/archive/water-recycling.webp", alt: "Settling tanks at QJ’s water recycling plant", width: 664, height: 1000 },
];

export async function generateMetadata({ params }: PageProps<"/[lang]/manufacturing">) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { meta } = await getDictionary(lang);
  return pageMetadata(lang, "/manufacturing", meta.manufacturing);
}

export default async function ManufacturingPage({ params }: PageProps<"/[lang]/manufacturing">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const { manufacturing: t } = dict;
  return <main id="main">
    <PageHero number="05" label={t.label} title={t.title} copy={t.copy}><p className="page-intro">{t.partners}</p></PageHero>
    <section className="process section-shell"><div className="section-heading"><SectionLabel number="01">{t.processLabel}</SectionLabel><div><h2><Lines lines={t.processTitle} /></h2></div></div>
      <ol className="process-steps">{t.steps.map((step, index) => <li key={step.title}><figure className={stepImages[index].height > stepImages[index].width ? "is-portrait" : ""}><Image src={stepImages[index].src} alt={stepImages[index].alt} fill sizes="(max-width: 900px) 90vw, 45vw" /></figure><div><span className="tools-number">0{index + 1}</span><h3>{step.title}</h3><p>{step.body}</p></div></li>)}</ol>
    </section>
    <section className="quality section-shell"><div className="section-heading"><SectionLabel number="02">{t.qualityLabel}</SectionLabel><div><h2><Lines lines={t.qualityTitle} /></h2><p className="heading-copy">{t.qualityCopy}</p></div></div>
      <dl className="quality-grid">{qualityHighlights.map(([value, label, standard]) => <div key={label}><dd>{value}</dd><dt>{label}</dt><span>{standard}</span></div>)}</dl><PillLink href={`/${lang}/resources#technical-data`}>{t.fullData}</PillLink>
    </section>
    <section className="capabilities section-shell"><div className="section-heading"><SectionLabel number="03">{t.capabilitiesLabel}</SectionLabel><div><h2><Lines lines={t.capabilitiesTitle} /></h2></div></div>
      <div className="spec-strip capability-strip">{t.capabilities.map(item => <div key={item.label}><span>{item.label}</span><strong>{item.value}{item.unit && <span>{item.unit}</span>}</strong></div>)}</div><p className="heading-copy">{t.customCut}</p>
    </section>
    <section id="distributors" className="export section-shell"><div className="section-heading"><SectionLabel number="04">{t.exportLabel}</SectionLabel><div><h2><Lines lines={t.exportTitle} /></h2><p className="heading-copy">{t.exportCopy}</p></div></div>
      <InquiryForm kind="distributor" t={dict.forms} remove={dict.common.remove} /><p className="community-note">{t.community}</p>
    </section>
  </main>;
}
