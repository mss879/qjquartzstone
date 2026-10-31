"use client";

import Image from "next/image";
import Link from "next/link";
import { toggleCompare, toggleFavourite } from "@/lib/shortlist";
import { CompareIcon, Heart } from "../ui";
import { updateSaved, useSaved, useSite } from "./site-provider";

export function SaveButton({ code, withLabel = false }: { code: string; withLabel?: boolean }) {
  const { labels } = useSite();
  const saved = useSaved().favourites.some(item => item.code === code);
  return <button type="button" className={`icon-button ${saved ? "is-on" : ""}`} aria-pressed={saved} aria-label={labels.save} onClick={() => updateSaved(current => toggleFavourite(current, code))}><Heart filled={saved} />{withLabel && <span>{saved ? labels.saved : labels.save}</span>}</button>;
}

export function CompareButton({ code, withLabel = false }: { code: string; withLabel?: boolean }) {
  const { labels } = useSite();
  const { compare } = useSaved();
  const on = compare.includes(code);
  const full = !on && compare.length >= 4;
  return <button type="button" className={`icon-button ${on ? "is-on" : ""}`} aria-pressed={on} aria-label={labels.compare} title={full ? labels.limit : undefined} disabled={full} onClick={() => updateSaved(current => toggleCompare(current, code))}><CompareIcon />{withLabel && <span>{on ? labels.comparing : labels.compare}</span>}</button>;
}

export function ProductCard({ code, slug, name, swatch, caption }: { code: string; slug: string; name: string; swatch: string; caption?: string }) {
  const { lang } = useSite();
  return <article className="surface-card">
    <Link href={`/${lang}/collections/${slug}`} className="surface-card-link"><span className="surface-card-image"><Image src={swatch} alt={`${code} ${name}`} fill sizes="(max-width: 700px) 46vw, (max-width: 1200px) 30vw, 22vw" /></span><span className="surface-card-code">{code}</span><h3>{name}</h3>{caption && <span className="surface-card-caption">{caption}</span>}</Link>
    <div className="surface-card-actions"><SaveButton code={code} /><CompareButton code={code} /></div>
  </article>;
}
