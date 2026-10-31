import { notFound } from "next/navigation";
import InquiryForm from "@/components/site/inquiry-form";
import { PageHero } from "@/components/ui";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { meta } = await getDictionary(lang);
  return pageMetadata(lang, "/contact", meta.contact);
}

export default async function ContactPage({ params, searchParams }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const [dict, query] = await Promise.all([getDictionary(lang), searchParams]);
  const { requests: t, footer, forms } = dict;
  const preselected = typeof query.surface === "string" ? query.surface.split(",") : [];
  return <main id="main">
    <PageHero number="06" label={t.contactLabel} title={t.contactTitle} copy={t.contactCopy} />
    <section className="form-section form-with-aside section-shell">
      <InquiryForm kind={query.type === "quotation" ? "quotation" : "contact"} kinds={["contact", "quotation"]} kindLabels={{ contact: forms.general, quotation: forms.quotation }} preselected={preselected} t={forms} remove={dict.common.remove} />
      <aside className="office-list" aria-label={t.offices}><span className="eyebrow">{t.offices}</span>
        <div><h2>{footer.sriLanka}</h2><p>{footer.address.join(", ")}</p><a href="tel:+94112722112">{t.office}: +94 11 2 722 112</a><a href="tel:+94777977787">{t.mobile}: +94 777 977 787</a></div>
        <div><h2>{footer.taiwan}</h2><p>{footer.taiwanAddress.join(", ")}</p><a href="tel:+886225361613">{t.office}: +886 2 2536 1613</a><a href="tel:+886917765567">{t.mobile}: +886 917 765 567</a></div>
        <div><h2>{t.email}</h2><a href="mailto:info@qjquartzstone.com">info@qjquartzstone.com</a></div>
      </aside>
    </section>
  </main>;
}
