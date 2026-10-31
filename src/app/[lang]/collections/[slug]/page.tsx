import Link from "next/link";
import { notFound } from "next/navigation";
import { CompareButton, ProductCard, SaveButton } from "@/components/site/product-card";
import SlabInspector from "@/components/site/slab-inspector";
import RoomPreview from "@/components/visualiser/room-preview";
import { Arrow, PillLink, SectionLabel } from "@/components/ui";
import { relatedProducts } from "@/lib/catalogue";
import { allProducts } from "@/lib/data/products";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

const crops = [["18%", "22%"], ["62%", "38%"], ["84%", "78%"]];
const findProduct = (slug: string) => allProducts.find(item => item.slug === slug);

export async function generateMetadata({ params }: PageProps<"/[lang]/collections/[slug]">) {
  const { lang, slug } = await params;
  const product = findProduct(slug);
  if (!hasLocale(lang) || !product) return {};
  return pageMetadata(lang, `/collections/${slug}`, { title: `${product.code} ${product.name} | QJ Quartz Stone`, description: product.description });
}

export default async function ProductPage({ params }: PageProps<"/[lang]/collections/[slug]">) {
  const { lang, slug } = await params;
  const product = findProduct(slug);
  if (!hasLocale(lang) || !product) notFound();
  const dict = await getDictionary(lang);
  const { product: t, catalogue, common } = dict;
  const base = `/${lang}`;
  const spec = [
    [common.collection, catalogue.collections[product.collection]],
    [common.tone, product.tone],
    [common.material, common.engineeredQuartz],
    [common.finish, product.finishes.map(value => catalogue.finishes[value as keyof typeof catalogue.finishes] ?? value).join(", ")],
    [common.thickness, `${product.thicknesses.join(" / ")} mm`],
    [t.sizes, "3200 × 1600 mm"],
    [catalogue.slabSizes.custom, t.customSize],
    [common.application, product.applications.map(value => catalogue.applications[value as keyof typeof catalogue.applications] ?? value).join(", ")],
    [t.waterAbsorption, "<0.011%"], [t.compression, "209 MPa"], [t.flexural, "42.4 MPa"], [t.density, "2.3–2.4 g/cm³"], [t.guarantee, t.guaranteeValue],
  ];
  const downloads = [
    [t.specSheet, `/downloads/spec-sheets/${product.code.toLowerCase()}.pdf`, "PDF"], [t.texture, `/textures/${product.code.toLowerCase()}.jpg`, "JPG"], [t.technical, "/downloads/qj-technical-data.pdf", "PDF"], [t.care, "/downloads/qj-care-guide.pdf", "PDF"],
  ];
  return <main id="main" className="product-page">
    <section className="product-hero section-shell">
      <div className="product-hero-visual"><SlabInspector src={product.swatch} alt={`${t.fullSlab}: ${product.code} ${product.name}`} hint={t.hoverZoom} /></div>
      <div className="product-hero-info"><nav className="crumbs"><Link href={`${base}/collections`}>{dict.nav.collections}</Link><span>/</span><Link href={`${base}/collections?collection=${product.collection}`}>{catalogue.collections[product.collection]}</Link></nav><span className="eyebrow">{product.code}</span><h1>{product.name}</h1><p>{product.description}</p>
        <div className="product-actions"><SaveButton code={product.code} withLabel /><CompareButton code={product.code} withLabel /></div>
        <div className="product-cta"><PillLink filled href={`${base}/samples?surface=${product.code}`}>{t.sample}</PillLink><PillLink href={`${base}/visualiser?counter=${product.code}`}>{t.visualise}</PillLink><PillLink href={`${base}/consultation?surface=${product.code}`}>{t.consult}</PillLink><Link className="text-link" href={`${base}/contact?type=quotation&surface=${product.code}`}>{t.quote} <Arrow diagonal /></Link></div>
      </div>
    </section>
    <section className="product-section section-shell"><div className="section-heading"><SectionLabel number="01">{t.closeUps}</SectionLabel><p className="heading-copy">{t.closeUpsCopy}</p></div><div className="closeups">{crops.map(([x, y], index) => <figure key={x}><span role="img" aria-label={`${t.closeUp} ${index + 1}: ${product.name}`} style={{ backgroundImage: `url(${product.swatch})`, backgroundPosition: `${x} ${y}` }} /><figcaption>{t.closeUp} 0{index + 1}</figcaption></figure>)}</div></section>
    <section className="product-section section-shell"><div className="section-heading"><SectionLabel number="02">{t.installed}</SectionLabel><p className="heading-copy">{t.installedCopy}</p></div><RoomPreview code={product.code} swatch={product.swatch} labels={{ kitchen: t.kitchen, bathroom: t.bathroom, living: t.living }} /></section>
    <section className="product-section product-columns section-shell">
      <div><SectionLabel number="03">{t.specs}</SectionLabel><dl className="spec-list">{spec.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><p className="fine-print">{t.note}</p></div>
      <div><SectionLabel number="04">{t.downloads}</SectionLabel><ul className="download-list">{downloads.map(([label, href, format]) => <li key={href}><a href={href} download><span>{label}</span><span>{format} <Arrow diagonal /></span></a></li>)}</ul></div>
    </section>
    <section className="product-section section-shell"><SectionLabel number="05">{t.related}</SectionLabel><div className="surface-grid surface-grid-wide">{relatedProducts(allProducts, product).map(item => <ProductCard key={item.code} code={item.code} slug={item.slug} name={item.name} swatch={item.swatch} caption={catalogue.collections[item.collection]} />)}</div></section>
  </main>;
}
