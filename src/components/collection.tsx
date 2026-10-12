"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { products, sampleEmail } from "@/lib/products";
import { Arrow, SectionLabel } from "./ui";

export default function Collection() {
  const [selected, setSelected] = useState(0);
  const [angle, setAngle] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const detailTrigger = useRef<HTMLButtonElement>(null);
  const product = products[selected];
  const select = (index: number) => { setSelected(index); setAngle(0); };

  return <section id="collections" className="collection section-shell">
    <div className="section-heading"><SectionLabel number="02">The collection</SectionLabel><div><span className="eyebrow">NATURE’S CHARACTER. YOUR SIGNATURE.</span><h2>A SURFACE<br />FOR EVERY STORY.</h2></div></div>
    <div className="collection-feature">
      <div className="slab-showroom"><div className="showroom-top"><span>THE MATERIAL EDIT / {product.code}</span><span className="showroom-cross">+</span></div>
        <div className="slab-turntable" style={{ transform: `perspective(1400px) rotateY(${angle}deg)` }}><Image key={product.code} src={product.image} alt={`${product.name} three-dimensional slab visualization`} fill sizes="(max-width: 900px) 90vw, 60vw" className="active-slab" /></div>
        <div className="slab-shadow" />
        <div className="angle-control"><span>EXPLORE THE ANGLE</span><input type="range" aria-label="Slab viewing angle" min="-20" max="20" value={angle} onChange={e => setAngle(Number(e.target.value))} /><span>{angle > 0 ? "+" : ""}{angle}°</span></div>
        <span className="showroom-note">3D MATERIAL VISUALIZATION</span>
      </div>
      <div className="product-info"><span className="eyebrow">{product.code} / {product.family}</span><h3>{product.name}</h3><p>{product.description}</p>
        <fieldset className="finish-options"><legend>SELECT A SURFACE</legend>{products.map((item, i) => <button key={item.code} onClick={() => select(i)} className={`finish-option ${selected === i ? "selected" : ""}`} aria-pressed={selected === i} aria-label={`Select ${item.name}`}><span className={`swatch ${item.swatch}`} /><span>{item.name}</span><span>{selected === i ? "↗" : "+"}</span></button>)}</fieldset>
        <div className="product-specs"><div><span>SLAB DIMENSIONS</span><p>3200 × 1600 mm</p></div><div><span>THICKNESS OPTIONS</span><p>12 / 20 / 30 mm</p></div></div>
        <a className="pill-link filled" href={sampleEmail(product.code, product.name)}>Enquire about a sample <Arrow /></a>
        <button ref={detailTrigger} className="text-link" onClick={() => dialog.current?.showModal()}>View surface details <Arrow diagonal /></button>
      </div>
    </div>
    <div className="product-grid">{products.map((item, i) => <button key={item.code} className={`product-card ${i === selected ? "is-selected" : ""}`} aria-pressed={i === selected} onClick={() => { select(i); document.querySelector(".collection-feature")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" }); }}><div className="product-card-image"><Image src={item.tile} alt={`${item.name} quartz sample tile`} fill sizes={i === products.length - 1 ? "(max-width: 900px) 62vw, 30vw" : "(max-width: 900px) 44vw, 30vw"} /></div><div className="product-card-caption"><div><span>{item.code}</span><h3>{item.name}</h3></div><Arrow diagonal /></div></button>)}</div>
    <div className="collection-footnote"><p>Visualizations inspired by QJ’s original surfaces. Always confirm colour and pattern with a physical sample.</p><a href="https://qjquartzstone.com/quartz-stone-collection-sri-lanka" target="_blank" rel="noreferrer" className="text-link">Explore the complete QJ range <Arrow diagonal /></a></div>
    <dialog ref={dialog} className="product-dialog" aria-labelledby="product-dialog-title" onClose={() => detailTrigger.current?.focus()} onClick={e => { if (e.target === dialog.current) dialog.current.close(); }}>
      <div className="dialog-content"><button className="dialog-close" aria-label="Close surface details" onClick={() => dialog.current?.close()}>×</button><span className="eyebrow">QJ / SURFACE DETAILS</span><h2 id="product-dialog-title">{product.name}</h2><p className="dialog-code">{product.code} · {product.tone}</p><div className="original-swatch"><Image src={product.original} alt={`Official manufacturer swatch for ${product.code} ${product.name}`} width={1114} height={600} sizes="(max-width: 900px) 90vw, 650px" /></div><span className="eyebrow">ORIGINAL QJ MANUFACTURER SWATCH</span><div className="dialog-specs"><p>Standard slab <strong>3200 × 1600 mm</strong></p><p>Thickness options <strong>12 / 20 / 30 mm</strong></p><p>Material <strong>Engineered quartz</strong></p></div><p className="dialog-note">The 3D views are design visualizations. Natural variation, lighting and screen settings affect appearance; request a physical sample before specifying.</p><a className="pill-link filled" href={sampleEmail(product.code, product.name)}>Request this surface <Arrow /></a></div>
    </dialog>
  </section>;
}
