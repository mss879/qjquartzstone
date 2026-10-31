import Link from "next/link";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { Arrow, Brand, Lines } from "../ui";

export default function SiteFooter({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const { footer: t, nav } = dict;
  const home = `/${lang}`;
  return <footer className="site-footer section-shell"><div className="footer-main">
    <div><Brand footer href={home} label={nav.home} /><p><Lines lines={t.tagline} /></p></div>
    <div className="footer-contact"><span className="eyebrow">{t.sriLanka}</span><p><Lines lines={t.address} /></p><a href="tel:+94112722112">+94 11 2 722 112</a><a href="tel:+94777977787">+94 777 977 787</a></div>
    <div className="footer-contact"><span className="eyebrow">{t.taiwan}</span><p><Lines lines={t.taiwanAddress} /></p><a href="tel:+886225361613">+886 2 2536 1613</a><Link href={`${home}/contact`}>{t.contactTeam} <Arrow diagonal /></Link></div>
    <nav className="footer-nav" aria-label={nav.footer}><span className="eyebrow">{t.explore}</span><Link href={`${home}/collections`}>{nav.collections}</Link><Link href={`${home}/visualiser`}>{nav.visualiser}</Link><Link href={`${home}/projects`}>{nav.projects}</Link><Link href={`${home}/manufacturing`}>{nav.manufacturing}</Link><Link href={`${home}/resources`}>{nav.resources}</Link><Link href={`${home}/journal`}>{nav.journal}</Link></nav>
    <nav className="footer-nav" aria-label={t.support}><span className="eyebrow">{t.support}</span><Link href={`${home}/samples`}>{t.samples}</Link><Link href={`${home}/consultation`}>{t.consultation}</Link><Link href={`${home}/support/care`}>{t.care}</Link><Link href={`${home}/support/warranty`}>{t.warranty}</Link><Link href={`${home}/support/faq`}>{t.faq}</Link><Link href={`${home}/support/after-sales`}>{t.afterSales}</Link></nav>
  </div><div className="footer-bottom"><span>{t.copyright}</span><span className="footer-credit">{t.credit} <strong>ARC AI</strong></span><a href="#top">{t.top}</a></div><p className="footer-disclaimer">{t.disclaimer}</p></footer>;
}
