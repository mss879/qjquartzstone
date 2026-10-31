"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { copyText } from "@/lib/clipboard";
import { fill } from "@/lib/copy";
import type { Dictionary } from "@/lib/dictionaries";
import { addFavourites, decodeShortlist, encodeShortlist, setNote, toggleFavourite } from "@/lib/shortlist";
import { Arrow, PillLink } from "../ui";
import { updateSaved, useSaved, useSite } from "./site-provider";

export default function ShortlistBoard({ encoded, t, remove, browse }: { encoded?: string; t: Dictionary["shortlist"]; remove: string; browse: string }) {
  const { lang, catalogue } = useSite();
  const saved = useSaved();
  const [copied, setCopied] = useState(false);
  const [adopted, setAdopted] = useState(false);
  const shared = encoded ? decodeShortlist(encoded) : null;
  const list = shared ? shared.items : saved.favourites;
  const entries = list.map(entry => ({ ...entry, product: catalogue.find(item => item.code === entry.code) })).filter(entry => entry.product);
  const codes = entries.map(entry => entry.code).join(",");
  const base = `/${lang}`;

  if (!entries.length) return <section className="empty-state section-shell"><p>{t.empty}</p><p className="fine-print">{t.emptyCopy}</p><PillLink href={`${base}/collections`}>{browse}</PillLink></section>;

  const share = async () => {
    const token = encodeShortlist({ name: saved.name, items: saved.favourites });
    await copyText(`${window.location.origin}${base}/shortlist?list=${token}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return <section className="shortlist-board section-shell">
    {shared ? <div className="shortlist-head"><div><span className="eyebrow">{t.sharedLabel}</span><h2>{shared.name || t.sharedLabel}</h2><p className="fine-print">{t.sharedCopy}</p></div><button type="button" className="pill-link" onClick={() => { updateSaved(current => addFavourites({ ...current, name: current.name || shared.name }, shared.items)); setAdopted(true); }}><span>{adopted ? t.savedAll : t.saveAll}</span><Arrow /></button></div>
      : <div className="shortlist-head"><label className="field"><span>{t.name}</span><input value={saved.name} placeholder={t.namePlaceholder} onChange={e => updateSaved(current => ({ ...current, name: e.target.value }))} /></label><span className="eyebrow">{fill(t.count, { count: entries.length })}</span></div>}
    <ul className="shortlist-items">{entries.map(({ code, note, product }) => <li key={code}><Link href={`${base}/collections/${product!.slug}`} className="shortlist-image"><Image src={product!.swatch} alt={`${code} ${product!.name}`} fill sizes="200px" /></Link><div><span className="eyebrow">{code}</span><h3><Link href={`${base}/collections/${product!.slug}`}>{product!.name}</Link></h3></div>{shared ? <p className="shortlist-note">{note}</p> : <><label className="field"><span>{t.note}</span><input value={note} placeholder={t.notePlaceholder} onChange={e => updateSaved(current => setNote(current, code, e.target.value))} /></label><button type="button" className="text-button" onClick={() => updateSaved(current => toggleFavourite(current, code))}>{remove}</button></>}</li>)}</ul>
    <div className="board-actions">{!shared && <button type="button" className="text-link" onClick={share}>{copied ? t.copied : t.share} <Arrow diagonal /></button>}<PillLink filled href={`${base}/contact?type=quotation&surface=${codes}`}>{t.enquire}</PillLink><PillLink href={`${base}/samples?surface=${codes}`}>{t.sample}</PillLink><PillLink href={`${base}/compare?surfaces=${entries.slice(0, 4).map(entry => entry.code).join(",")}`}>{t.compare}</PillLink></div>
  </section>;
}
