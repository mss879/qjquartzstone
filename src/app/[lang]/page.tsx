import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import MaterialStory from "@/components/material-story";
import Collection from "@/components/collection";
import Applications from "@/components/applications";
import { Arrow, Lines, PillLink, SectionLabel } from "@/components/ui";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale } from "@/lib/i18n";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { home: t } = await getDictionary(lang);
  const base = `/${lang}`;
  const toolLinks = [`${base}/visualiser`, `${base}/shortlist`, `${base}/samples`, `${base}/resources`];
  return <main id="main">
    <section className="hero section-shell" aria-labelledby="hero-title">
      <div className="hero-kicker"><span>{t.kicker}</span><span>{t.route}</span></div>
      <h1 id="hero-title" className="hero-title">{t.title.map(line => <span key={line}>{line}</span>)}</h1>
      <div className="hero-sculpture hero-sculpture-right"><Image src="/images/quartz-sculpture.webp" alt="An expressive ribbon sculpture in finely veined white quartz" fill priority sizes="(max-width: 900px) 65vw, 42vw" /></div>
      <div className="hero-sculpture hero-sculpture-left" aria-hidden="true"><Image src="/images/hero-dark.webp" alt="" fill priority sizes="(max-width: 900px) 46vw, 30vw" /></div>
      <p className="hero-support-copy"><Lines lines={t.support} /></p>
      <div className="hero-bottom">
        <a href="#about" className="scroll-cue">
          <span className="scroll-arrow" aria-hidden="true"><Arrow /></span>
          <span className="scroll-cue-label"><span className="scroll-cue-desktop-label"><Lines lines={t.cue} /></span><span className="scroll-cue-mobile-label">{t.cueMobile}</span></span>
        </a>
        <div className="hero-intro"><a href="#collections" className="pill-link"><span>{t.cta}</span><Arrow /></a></div>
        <div className="hero-index"><span>01 — 05</span><span className="hero-index-line" /><span>{t.edit}</span></div>
      </div>
    </section>
    <section id="about" className="about section-shell">
      <div className="section-heading"><SectionLabel number="01">{t.aboutLabel}</SectionLabel><div><h2 className="about-statement">{t.aboutTitle[0]}<br />{t.aboutTitle[1]}<br /><span className="clay">{t.aboutTitle[2]}</span></h2><div className="about-copy"><span className="eyebrow">{t.aboutEyebrow}</span><div>{t.aboutBody.map(paragraph => <p key={paragraph}>{paragraph}</p>)}<PillLink href={`${base}/manufacturing`}>{t.aboutCta}</PillLink></div></div></div></div>
      <div className="about-images"><figure className="about-detail"><div className="origin-stamp"><span className="origin-label">{t.partnership}</span><div className="origin-partner"><strong>{t.taiwan}</strong><span>Queens Ceramic Inc.</span></div><span className="origin-connector" aria-hidden="true">+</span><div className="origin-partner"><strong>{t.sriLanka}</strong><span>Jaysons Holdings (Pvt) Ltd</span></div></div><figcaption>{t.partnershipCaption}</figcaption></figure><figure className="about-space"><div className="about-space-image"><Image src="/images/dining-concept.webp" alt="Breeze quartz visualized as a warm cream dining table" fill sizes="(max-width: 900px) 80vw, 60vw" /></div><figcaption><span>QJ227 / BREEZE</span><span>INTERIOR CONCEPT</span></figcaption></figure></div>
      <div className="about-marquee" aria-hidden="true"><span>{t.marquee[0]}</span>{" "}<span>{t.marquee[1]}</span></div>
    </section>
    <MaterialStory t={t.story} />
    <Collection lang={lang} t={t.collection} />
    <Applications lang={lang} t={t.applications} />
    <section className="tools section-shell"><div className="section-heading"><SectionLabel number="04">{t.tools.label}</SectionLabel><div><h2><Lines lines={t.tools.title} /></h2></div></div>
      <div className="tools-grid">{t.tools.items.map((item, index) => <Link key={item.title} href={toolLinks[index]}><span className="tools-number">0{index + 1}</span><h3>{item.title}</h3><p>{item.body}</p><span className="tools-cta">{item.cta} <Arrow diagonal /></span></Link>)}</div>
    </section>
    <section id="craft" className="craft section-shell"><div className="section-heading"><SectionLabel number="05">{t.craft.label}</SectionLabel><div><h2><Lines lines={t.craft.title} /></h2><p className="heading-copy"><Lines lines={t.craft.copy} /></p></div></div>
      <div className="craft-layout"><div className="craft-visual"><Image src="/images/craft-detail.webp" alt={t.craft.visualAlt} fill sizes="(max-width: 900px) 90vw, 45vw" /><span className="craft-visual-label">{t.craft.visualLabel}</span><span className="craft-visual-index">QJ<br />905</span></div><div className="craft-steps">
        {t.craft.steps.map((step, index) => <details key={step.title} open={index === 0}><summary><span>0{index + 1}</span><h3>{step.title}</h3><span className="details-plus">+</span></summary><p>{step.body}</p></details>)}
        <PillLink href={`${base}/manufacturing`}>{t.craft.cta}</PillLink>
      </div></div>
      <div className="spec-strip"><div><span>{t.craft.standard}</span><strong>3200 × 1600<span>mm</span></strong></div><div><span>{t.craft.thickness}</span><strong>12 / 20 / 30<span>mm</span></strong></div><Link href={`${base}/resources#technical-data`}><span>{t.craft.specified}</span><span>{t.craft.specifiedCta} <Arrow diagonal /></span></Link></div>
    </section>
    <section id="contact" className="contact section-shell"><div className="contact-top"><SectionLabel number="06">{t.contact.label}</SectionLabel><span className="eyebrow">{t.contact.audience}</span></div><Link href={`${base}/contact`} className="contact-title"><span>{t.contact.title[0]}<br /><span className="contact-indent">{t.contact.title[1]}</span><br />{t.contact.title[2]}</span><span className="contact-arrow"><Arrow diagonal /></span></Link><div className="contact-bottom"><p><Lines lines={t.contact.copy} /></p><a href="mailto:info@qjquartzstone.com" className="contact-email">info@qjquartzstone.com <Arrow diagonal /></a></div></section>
  </main>;
}
