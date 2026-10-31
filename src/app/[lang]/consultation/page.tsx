import { notFound } from "next/navigation";
import InquiryForm from "@/components/site/inquiry-form";
import { PageHero } from "@/components/ui";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/consultation">) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { meta } = await getDictionary(lang);
  return pageMetadata(lang, "/consultation", meta.consultation);
}

export default async function ConsultationPage({ params, searchParams }: PageProps<"/[lang]/consultation">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const [dict, query] = await Promise.all([getDictionary(lang), searchParams]);
  const preselected = typeof query.surface === "string" ? query.surface.split(",") : [];
  return <main id="main">
    <PageHero number="04" label={dict.requests.consultationLabel} title={dict.requests.consultationTitle} copy={dict.requests.consultationCopy} />
    <section className="form-section section-shell"><InquiryForm kind="consultation" preselected={preselected} t={dict.forms} remove={dict.common.remove} /></section>
  </main>;
}
