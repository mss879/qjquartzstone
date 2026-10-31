import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DraftNote, PageHero } from "@/components/ui";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { projects as published } from "@/lib/data/content";

export async function generateMetadata({ params }: PageProps<"/[lang]/projects">) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { meta } = await getDictionary(lang);
  return pageMetadata(lang, "/projects", meta.projects);
}

export default async function ProjectsPage({ params, searchParams }: PageProps<"/[lang]/projects">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const [dict, query] = await Promise.all([getDictionary(lang), searchParams]);
  const { projects: t, common } = dict;
  const category = typeof query.category === "string" ? query.category : "";
  const projects = category ? published.filter(project => project.category === category) : published;
  const categories = [...new Set(published.map(project => project.category))];
  const base = `/${lang}/projects`;
  const label = (value: string) => t.categories[value as keyof typeof t.categories] ?? value;
  return <main id="main">
    <PageHero number="03" label={t.label} title={t.title} copy={t.copy} />
    <section className="projects section-shell">
      <nav className="chip-row" aria-label={t.label}><Link href={base} aria-current={!category ? "page" : undefined}>{t.all}</Link>{categories.map(item => <Link key={item} href={`${base}?category=${encodeURIComponent(item)}`} aria-current={category === item ? "page" : undefined}>{label(item)}</Link>)}</nav>
      {published.some(project => project.sample) && <p className="fine-print sample-banner">{t.sampleNote}</p>}
      <div className="project-grid">{projects.map(project => <article key={project.id}><Link href={`${base}/${project.slug}`}><span className="project-image"><Image src={project.images[0]} alt={project.title} fill sizes="(max-width: 900px) 90vw, 45vw" /></span><span className="eyebrow">{label(project.category)} · {project.location}</span><h2>{project.title}</h2>{project.sample && <DraftNote>{common.sample}</DraftNote>}</Link></article>)}</div>
    </section>
  </main>;
}
