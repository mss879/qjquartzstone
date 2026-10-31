"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { products } from "@/lib/products";
import { Arrow, Lines, SectionLabel } from "./ui";

export default function Collection({ lang, t }: { lang: Locale; t: Dictionary["home"]["collection"] }) {
  const [selected, setSelected] = useState(0);
  const [angle, setAngle] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const detailTrigger = useRef<HTMLButtonElement>(null);
  const product = products[selected];
  const select = (index: number) => { setSelected(index); setAngle(0); };
  const sampleLink = `/${lang}/samples?surface=${product.code}`;

  return <section id="collections" className="collection section-shell">
    <div className="section-heading"><SectionLabel number="02">{t.label}</SectionLabel><div><span className="eyebrow">{t.eyebrow}</span><h2><Lines lines={t.title} /></h2></div></div>
    <div className="collection-feature">
      <div className="slab-showroom"><div className="showroom-top"><span>{t.edit} / {product.code}</span><span className="showroom-cross">+</span></div>
        <div className="slab-turntable" style={{ transform: `perspective(1400px) rotateY(${angle}deg)` }}><Image key={product.code} src={product.image} alt={`${product.name} ${t.slabAlt}`} fill sizes="(max-width: 900px) 90vw, 60vw" className="active-slab" /></div>
        <div className="slab-shadow" />
        <div className="angle-control"><span>{t.angle}</span><input type="range" aria-label={t.angleLabel} min="-20" max="20" value={angle} onChange={e => setAngle(Number(e.target.value))} /><span>{angle > 0 ? "+" : ""}{angle}°</span></div>
        <span className="showroom-note">{t.note}</span>
      </div>
      <div className="product-info"><span className="eyebrow">{product.code} / {product.family}</span><h3>{product.name}</h3><p>{product.description}</p>
        <fieldset className="finish-options"><legend>{t.select}</legend>{products.map((item, i) => <button key={item.code} onClick={() => select(i)} className={`finish-option ${selected === i ? "selected" : ""}`} aria-pressed={selected === i} aria-label={`${t.selectItem} ${item.name}`}><span className={`swatch ${item.swatch}`} /><span>{item.name}</span><span>{selected === i ? "↗" : "+"}</span></button>)}</fieldset>
        <div className="product-specs"><div><span>{t.dimensions}</span><p>3200 × 1600 mm</p></div><div><span>{t.thicknesses}</span><p>12 / 20 / 30 mm</p></div></div>
        <Link className="pill-link filled" href={sampleLink}>{t.sample} <Arrow /></Link>
        <button ref={detailTrigger} className="text-link" onClick={() => dialog.current?.showModal()}>{t.details} <Arrow diagonal /></button>
      </div>
    </div>
    <div className="product-grid">{products.map((item, i) => <button key={item.code} className={`product-card ${i === selected ? "is-selected" : ""}`} aria-pressed={i === selected} onClick={() => { select(i); document.querySelector(".collection-feature")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" }); }}><div className="product-card-image"><Image src={item.tile} alt={`${item.name} ${t.tile}`} fill sizes={i === products.length - 1 ? "(max-width: 900px) 62vw, 30vw" : "(max-width: 900px) 44vw, 30vw"} /></div><div className="product-card-caption"><div><span>{item.code}</span><h3>{item.name}</h3></div><Arrow diagonal /></div></button>)}</div>
    <div className="collection-footnote"><p>{t.footnote}</p><Link href={`/${lang}/collections`} className="text-link">{t.range} <Arrow diagonal /></Link></div>
    <dialog ref={dialog} className="product-dialog" aria-labelledby="product-dialog-title" onClose={() => detailTrigger.current?.focus()} onClick={e => { if (e.target === dialog.current) dialog.current.close(); }}>
      <div className="dialog-content"><button className="dialog-close" aria-label={t.close} onClick={() => dialog.current?.close()}>×</button><span className="eyebrow">{t.dialogEyebrow}</span><h2 id="product-dialog-title">{product.name}</h2><p className="dialog-code">{product.code} · {product.tone}</p><div className="original-swatch"><Image src={product.original} alt={`Official manufacturer swatch for ${product.code} ${product.name}`} width={1114} height={600} sizes="(max-width: 900px) 90vw, 650px" /></div><span className="eyebrow">{t.officialSwatch}</span><div className="dialog-specs"><p>{t.standardSlab} <strong>3200 × 1600 mm</strong></p><p>{t.thicknessOptions} <strong>12 / 20 / 30 mm</strong></p></div><p className="dialog-note">{t.dialogNote}</p><Link className="pill-link filled" href={sampleLink}>{t.request} <Arrow /></Link><Link className="text-link dialog-product-link" href={`/${lang}/collections/${product.slug}`}>{t.productPage} <Arrow diagonal /></Link></div>
    </dialog>
  </section>;
}
