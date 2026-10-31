import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Arrow, DraftNote, PillLink } from "@/components/ui";
import { projects } from "@/lib/data/content";
import { allProducts } from "@/lib/data/products";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

const findProject = (slug: string) => projects.find(item => item.slug === slug);

export async function generateMetadata({ params }: PageProps<"/[lang]/projects/[slug]">) {
  const { lang, slug } = await params;
  const project = findProject(slug);
  if (!hasLocale(lang) || !project) return {};
  return pageMetadata(lang, `/projects/${slug}`, { title: `${project.title} | QJ Quartz Stone`, description: project.summary });
}

export default async function ProjectPage({ params }: PageProps<"/[lang]/projects/[slug]">) {
  const { lang, slug } = await params;
  const project = findProject(slug);
  if (!hasLocale(lang) || !project) notFound();
  const { projects: t, common } = await getDictionary(lang);
  const base = `/${lang}`;
  const designs = project.designs.map(code => allProducts.find(item => item.code === code)).filter(item => item !== undefined);
  return <main id="main">
    <article className="project-detail section-shell">
      <Link className="text-link article-back" href={`${base}/projects`}>{t.back} <Arrow diagonal /></Link>
      <header><span className="eyebrow">{t.categories[project.category as keyof typeof t.categories] ?? project.category}</span><h1>{project.title}</h1>{project.sample && <DraftNote>{common.sample}</DraftNote>}<p className="heading-copy" lang="en">{project.summary}</p></header>
      {project.images.map((image, index) => <figure key={image} className="project-hero-image"><Image src={image} alt={project.title} fill priority={index === 0} sizes="(max-width: 900px) 90vw, 85vw" /></figure>)}
      <dl className="spec-list project-facts"><div><dt>{t.location}</dt><dd>{project.location}</dd></div><div><dt>{t.application}</dt><dd lang="en">{project.application}</dd></div><div><dt>{t.designs}</dt><dd className="project-designs">{designs.map(item => <Link key={item.code} href={`${base}/collections/${item.slug}`}><Image src={item.swatch} alt="" width={36} height={36} />{item.code} {item.name}</Link>)}</dd></div></dl>
      {project.sample && <p className="fine-print sample-banner">{t.sampleNote}</p>}
      <PillLink filled href={`${base}/consultation?surface=${project.designs.join(",")}`}>{t.similar}</PillLink>
    </article>
  </main>;
}
