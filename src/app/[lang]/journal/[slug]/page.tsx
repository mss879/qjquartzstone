import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Arrow } from "@/components/ui";
import { fill } from "@/lib/copy";
import { articles } from "@/lib/data/content";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale, htmlLang } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

const findArticle = (slug: string) => articles.find(article => article.slug === slug);

export async function generateMetadata({ params }: PageProps<"/[lang]/journal/[slug]">) {
  const { lang, slug } = await params;
  const article = findArticle(slug);
  if (!hasLocale(lang) || !article) return {};
  return pageMetadata(lang, `/journal/${slug}`, { title: `${article.title} | QJ Quartz Stone`, description: article.excerpt });
}

export default async function ArticlePage({ params }: PageProps<"/[lang]/journal/[slug]">) {
  const { lang, slug } = await params;
  const article = findArticle(slug);
  if (!hasLocale(lang) || !article) notFound();
  const { journal: t, common } = await getDictionary(lang);
  const date = new Intl.DateTimeFormat(htmlLang[lang], { year: "numeric", month: "long", day: "numeric" });
  const paragraphs = article.body.split(/\n\n+/);
  const minutes = Math.max(1, Math.round(article.body.split(/\s+/).length / 200));
  return <main id="main">
    <article className="article section-shell">
      <Link className="text-link article-back" href={`/${lang}/journal`}>{t.back} <Arrow diagonal /></Link>
      <header><span className="eyebrow">{t.categories[article.category as keyof typeof t.categories] ?? article.category} · {date.format(new Date(article.date))} · {fill(t.minutes, { count: minutes })}</span><h1>{article.title}</h1><p className="heading-copy">{article.excerpt}</p></header>
      <figure className="article-image"><Image src={article.image} alt={article.imageAlt} fill priority sizes="(max-width: 900px) 90vw, 80vw" /></figure>
      <div className="article-body">{lang !== "en" && <p className="fine-print">{common.englishOnly}</p>}<div lang="en">{paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div></div>
    </article>
  </main>;
}
