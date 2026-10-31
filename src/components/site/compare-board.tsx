"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Dictionary } from "@/lib/dictionaries";
import { copyText } from "@/lib/clipboard";
import { addFavourites } from "@/lib/shortlist";
import type { Product } from "@/lib/types";
import { Arrow, PillLink } from "../ui";
import { SaveButton } from "./product-card";
import { updateSaved, useSaved, useSite } from "./site-provider";

/** A compare link opens the same comparison for anyone; without one the visitor's own selection is shown. */
export default function CompareBoard({ products, linked, t, catalogue, common }: { products: Product[]; linked: string[]; t: Dictionary["compare"]; catalogue: Dictionary["catalogue"]; common: Dictionary["common"] }) {
  const { lang } = useSite();
  const { compare } = useSaved();
  const [copied, setCopied] = useState(false);
  const codes = linked.length ? linked : compare;
  const items = codes.map(code => products.find(product => product.code === code)).filter(item => item !== undefined).slice(0, 4);
  if (!items.length) return <section className="empty-state section-shell"><p>{t.empty}</p><p className="fine-print">{t.emptyCopy}</p><PillLink href={`/${lang}/collections`}>{t.browse}</PillLink></section>;
  const rows: [string, (product: Product) => string][] = [
    [common.code, product => product.code],
    [common.collection, product => catalogue.collections[product.collection]],
    [common.tone, product => product.tone],
    [common.colour, product => product.colours.map(value => catalogue.colours[value as keyof typeof catalogue.colours] ?? value).join(", ")],
    [common.pattern, product => catalogue.patterns[product.pattern as keyof typeof catalogue.patterns] ?? product.pattern],
    [common.finish, product => product.finishes.map(value => catalogue.finishes[value as keyof typeof catalogue.finishes] ?? value).join(", ")],
    [common.thickness, product => `${product.thicknesses.join(" / ")} mm`],
    [common.slabSize, product => product.slabSizes.map(value => catalogue.slabSizes[value as keyof typeof catalogue.slabSizes] ?? value).join(", ")],
    [common.application, product => product.applications.map(value => catalogue.applications[value as keyof typeof catalogue.applications] ?? value).join(", ")],
  ];
  const share = async () => {
    await copyText(`${window.location.origin}/${lang}/compare?surfaces=${items.map(item => item.code).join(",")}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };
  return <section className="compare-board section-shell">
    <div className="compare-scroll"><table style={{ "--columns": items.length } as React.CSSProperties}><thead><tr><td />{items.map(item => <th key={item.code} scope="col"><Link href={`/${lang}/collections/${item.slug}`}><span className="compare-image"><Image src={item.swatch} alt={`${item.code} ${item.name}`} fill sizes="(max-width: 900px) 60vw, 22vw" /></span><span className="compare-name">{item.name}</span></Link><SaveButton code={item.code} withLabel /></th>)}</tr></thead><tbody>{rows.map(([label, value]) => <tr key={label}><th scope="row">{label}</th>{items.map(item => <td key={item.code}>{value(item)}</td>)}</tr>)}</tbody></table></div>
    <div className="board-actions"><button type="button" className="text-link" onClick={share}>{copied ? t.copied : t.share} <Arrow diagonal /></button><PillLink filled href={`/${lang}/samples?surface=${items.map(item => item.code).join(",")}`}>{common.enquire}</PillLink><button type="button" className="text-link" onClick={() => updateSaved(saved => addFavourites(saved, items.map(item => ({ code: item.code, note: "" }))))}>{catalogue.save} <Arrow diagonal /></button></div>
  </section>;
}
