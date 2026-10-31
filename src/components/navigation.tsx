"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/lib/dictionaries";
import { LANG_COOKIE, locales, localeNames, swapLocale, type Locale } from "@/lib/i18n";
import { useSaved, useSite } from "./site/site-provider";
import { Arrow, Brand, Heart } from "./ui";

const remember = (locale: Locale) => { document.cookie = `${LANG_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`; };

function LanguageSwitcher({ label, onPick }: { label: string; onPick?: () => void }) {
  const { lang } = useSite();
  const pathname = usePathname();
  const details = useRef<HTMLDetailsElement>(null);
  return <details ref={details} className="lang-switch"><summary aria-label={label}>{localeNames[lang]}<span aria-hidden="true">+</span></summary><ul>{locales.map(locale => <li key={locale}><a href={swapLocale(pathname, locale)} hrefLang={locale} lang={locale} aria-current={locale === lang ? "true" : undefined} onClick={() => { remember(locale); details.current?.removeAttribute("open"); onPick?.(); }}>{localeNames[locale]}</a></li>)}</ul></details>;
}

export default function Navigation({ t }: { t: Dictionary["nav"] }) {
  const { lang } = useSite();
  const { favourites } = useSaved();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const home = `/${lang}`;
  const links = [[t.collections, "/collections"], [t.visualiser, "/visualiser"], [t.projects, "/projects"], [t.manufacturing, "/manufacturing"], [t.resources, "/resources"], [t.journal, "/journal"]];
  const mobileLinks = [...links, [t.support, "/support/care"], [t.shortlist, "/shortlist"], [t.contactShort, "/contact"]];
  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); toggle.current?.focus(); }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);

  return <header className="site-header">
    <Brand href={home} label={t.home} />
    <nav className="desktop-nav" aria-label={t.main}>{links.map(([label, href]) => <Link key={href} href={`${home}${href}`}>{label}</Link>)}</nav>
    <div className="header-tools">
      <LanguageSwitcher label={t.language} />
      <Link className="header-shortlist" href={`${home}/shortlist`} aria-label={`${t.shortlist}: ${favourites.length}`}><Heart filled={favourites.length > 0} /><span>{favourites.length}</span></Link>
      <Link className="header-contact" href={`${home}/contact`}>{t.contact} <Arrow diagonal /></Link>
    </div>
    <button ref={toggle} type="button" className={`menu-toggle ${open ? "is-open" : ""}`} aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? t.closeMenu : t.openMenu} onClick={() => setOpen(!open)}><span /><span /></button>
    <nav id="mobile-nav" className="mobile-nav" aria-label={t.mobile} hidden={!open}>{mobileLinks.map(([label, href], i) => <Link key={href} href={`${home}${href}`} onClick={() => setOpen(false)}><span>{String(i + 1).padStart(2, "0")}</span>{label}<Arrow /></Link>)}<LanguageSwitcher label={t.language} onPick={() => setOpen(false)} /></nav>
  </header>;
}
