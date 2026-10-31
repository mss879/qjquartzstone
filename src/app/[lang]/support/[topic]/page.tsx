import Link from "next/link";
import { notFound } from "next/navigation";
import InquiryForm from "@/components/site/inquiry-form";
import { DraftNote, PageHero, PillLink } from "@/components/ui";
import { getDictionary, type Dictionary } from "@/lib/dictionaries";
import { hasLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

const topics = ["care", "warranty", "faq", "after-sales"] as const;
type Topic = (typeof topics)[number];
const isTopic = (value: string): value is Topic => (topics as readonly string[]).includes(value);

export async function generateMetadata({ params }: PageProps<"/[lang]/support/[topic]">) {
  const { lang, topic } = await params;
  if (!hasLocale(lang) || !isTopic(topic)) return {};
  const { support } = await getDictionary(lang);
  return pageMetadata(lang, `/support/${topic}`, { title: support[topic].metaTitle, description: support[topic].metaDescription });
}

function Care({ dict }: { dict: Dictionary }) {
  const t = dict.support.care;
  return <div className="support-body"><span className="eyebrow">{t.published}</span><dl className="care-list">{t.items.map(item => <div key={item.title}><dt>{item.title}</dt><dd>{item.body}</dd></div>)}</dl><div className="draft-block"><h2>{t.draftTitle}</h2><DraftNote>{dict.common.draft}</DraftNote><ul>{t.draftItems.map(item => <li key={item}>{item}</li>)}</ul></div></div>;
}

function Warranty({ dict, base }: { dict: Dictionary; base: string }) {
  const t = dict.support.warranty;
  return <div className="support-body"><div className="draft-block"><h2>{t.pendingTitle}</h2><DraftNote>{t.pendingBadge}</DraftNote><p>{t.pendingCopy}</p><ul>{t.sections.map(item => <li key={item}>{item}</li>)}</ul></div><PillLink href={`${base}/support/after-sales`}>{t.cta}</PillLink></div>;
}

function Faq({ dict }: { dict: Dictionary }) {
  const { items } = dict.support.faq;
  return <div className="support-body">{items.map((item, index) => <details key={item.q} className="faq-item" open={index === 0}><summary><h2>{item.q}</h2><span className="details-plus">+</span></summary><p>{item.a}</p></details>)}</div>;
}

function AfterSales({ dict }: { dict: Dictionary }) {
  const t = dict.support["after-sales"];
  return <div className="support-body"><ol className="after-sales-steps">{t.steps.map(step => <li key={step.title}><h2>{step.title}</h2><p>{step.body}</p></li>)}</ol><InquiryForm kind="after-sales" t={dict.forms} remove={dict.common.remove} /></div>;
}

export default async function SupportPage({ params }: PageProps<"/[lang]/support/[topic]">) {
  const { lang, topic } = await params;
  if (!hasLocale(lang) || !isTopic(topic)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.support;
  const base = `/${lang}`;
  return <main id="main">
    <PageHero number="05" label={t.label} title={t[topic].title} copy={t[topic].copy} />
    <section className="support-layout section-shell"><nav className="support-nav" aria-label={t.label}>{topics.map(item => <Link key={item} href={`${base}/support/${item}`} aria-current={item === topic ? "page" : undefined}>{t.nav[item]}</Link>)}</nav>
      {topic === "care" && <Care dict={dict} />}{topic === "warranty" && <Warranty dict={dict} base={base} />}{topic === "faq" && <Faq dict={dict} />}{topic === "after-sales" && <AfterSales dict={dict} />}
    </section>
  </main>;
}
