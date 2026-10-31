import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale, htmlLang } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { articles as allArticles } from "@/lib/data/content";

export async function generateMetadata({ params }: PageProps<"/[lang]/journal">) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { meta } = await getDictionary(lang);
  return pageMetadata(lang, "/journal", meta.journal);
}

export default async function JournalPage({ params, searchParams }: PageProps<"/[lang]/journal">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const [dict, query] = await Promise.all([getDictionary(lang), searchParams]);
  const { journal: t } = dict;
  const live = [...allArticles].sort((a, b) => b.date.localeCompare(a.date));
  const category = typeof query.category === "string" ? query.category : "";
  const articles = category ? live.filter(article => article.category === category) : live;
  const categories = [...new Set(live.map(article => article.category))];
  const date = new Intl.DateTimeFormat(htmlLang[lang], { year: "numeric", month: "long", day: "numeric" });
  const base = `/${lang}/journal`;
  return <main id="main">
    <PageHero number="05" label={t.label} title={t.title} copy={t.copy} />
    <section className="journal section-shell">
      <nav className="chip-row" aria-label={t.label}><Link href={base} aria-current={!category ? "page" : undefined}>{t.all}</Link>{categories.map(item => <Link key={item} href={`${base}?category=${encodeURIComponent(item)}`} aria-current={category === item ? "page" : undefined}>{t.categories[item as keyof typeof t.categories] ?? item}</Link>)}</nav>
      {articles.length ? <div className="journal-grid">{articles.map(article => <article key={article.id}><Link href={`${base}/${article.slug}`}><span className="journal-image"><Image src={article.image} alt={article.imageAlt} fill sizes="(max-width: 900px) 90vw, 30vw" /></span><span className="eyebrow">{t.categories[article.category as keyof typeof t.categories] ?? article.category} · {date.format(new Date(article.date))}</span><h2>{article.title}</h2><p>{article.excerpt}</p></Link></article>)}</div> : <p className="empty-state">{t.empty}</p>}
    </section>
  </main>;
}
