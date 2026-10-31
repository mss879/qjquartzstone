"use client";

import Image from "next/image";
import { useState } from "react";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { Arrow, Lines, PillLink, SectionLabel } from "./ui";

const applications = [
  { code: "01", image: "/images/kitchen-secondary.webp", stone: "QJ707N / STATUARIO", alt: "Kitchen concept featuring a bold Statuario quartz island" },
  { code: "02", image: "/images/bathroom-concept.webp", stone: "QJ707N / STATUARIO", alt: "Bathroom concept featuring a Statuario quartz vanity" },
  { code: "03", image: "/images/lounge-concept.webp", stone: "QJ712 / PIETRA GREY", alt: "Charcoal Pietra Grey quartz visualized in a sunlit lounge" },
];

export default function Applications({ lang, t }: { lang: Locale; t: Dictionary["home"]["applications"] }) {
  const [active, setActive] = useState<number | null>(2);
  const [imageIndex, setImageIndex] = useState(2);
  const application = applications[imageIndex];
  return <section id="spaces" className="applications section-shell"><div className="section-heading"><SectionLabel number="03">{t.label}</SectionLabel><div><h2><Lines lines={t.title} /></h2><p className="heading-copy"><Lines lines={t.copy} /></p></div></div>
    <div className="application-layout"><div className="application-image"><Image key={application.code} src={application.image} alt={application.alt} fill sizes="(max-width: 900px) 90vw, 55vw" /><span className="image-caption">{application.stone} <span>INTERIOR CONCEPT</span></span></div>
    <div className="application-list">{applications.map((item, index) => <div key={item.code} className={`application-row ${active === index ? "expanded" : ""}`}><button id={`app-tab-${index}`} aria-expanded={active === index} aria-controls={`app-panel-${index}`} onClick={() => { setActive(active === index ? null : index); setImageIndex(index); }}><span>{item.code}</span><h3>{t.items[index].title}</h3><span>{active === index ? "−" : "+"}</span></button><div id={`app-panel-${index}`} role="region" aria-labelledby={`app-tab-${index}`} hidden={active !== index}><p>{t.items[index].description}</p><PillLink href={`/${lang}/consultation`}>{t.cta}</PillLink></div></div>)}<div className="application-bottom"><Arrow diagonal /><span><Lines lines={t.bottom} /></span></div></div></div>
  </section>;
}
