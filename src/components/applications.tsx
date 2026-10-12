"use client";

import Image from "next/image";
import { useState } from "react";
import { Arrow, PillLink, SectionLabel } from "./ui";

const applications = [
  { title: "Kitchens & countertops", code: "01", image: "/images/kitchen-secondary.webp", stone: "QJ707N / STATUARIO", description: "The heart of a home deserves a surface with character. Explore quartz for countertops, waterfall islands and continuous backsplashes.", alt: "Kitchen concept featuring a bold Statuario quartz island" },
  { title: "Bathrooms & vanities", code: "02", image: "/images/bathroom-concept.webp", stone: "QJ707N / STATUARIO", description: "Make everyday rituals feel considered. QJ surfaces bring a cohesive material language to vanity tops and bathroom interiors.", alt: "Bathroom concept featuring a Statuario quartz vanity" },
  { title: "Living & hospitality", code: "03", image: "/images/lounge-concept.webp", stone: "QJ712 / PIETRA GREY", description: "Create a moment of contrast. Pietra Grey brings a grounded material palette to a lounge or hospitality interior. Talk to QJ about the right specification for your space.", alt: "Charcoal Pietra Grey quartz visualized in a sunlit lounge" },
];

export default function Applications() {
  const [active, setActive] = useState<number | null>(2);
  const [imageIndex, setImageIndex] = useState(2);
  const application = applications[imageIndex];
  return <section id="spaces" className="applications section-shell"><div className="section-heading"><SectionLabel number="03">Made for living</SectionLabel><div><h2>GOOD DESIGN.<br />GREAT EVERYDAY.</h2><p className="heading-copy">A material that finds its place.<br />In your space. In your life.</p></div></div>
    <div className="application-layout"><div className="application-image"><Image key={application.title} src={application.image} alt={application.alt} fill sizes="(max-width: 900px) 90vw, 55vw" /><span className="image-caption">{application.stone} <span>INTERIOR CONCEPT</span></span></div>
    <div className="application-list">{applications.map((item, index) => <div key={item.code} className={`application-row ${active === index ? "expanded" : ""}`}><button id={`app-tab-${index}`} aria-expanded={active === index} aria-controls={`app-panel-${index}`} onClick={() => { setActive(active === index ? null : index); setImageIndex(index); }}><span>{item.code}</span><h3>{item.title}</h3><span>{active === index ? "−" : "+"}</span></button><div id={`app-panel-${index}`} role="region" aria-labelledby={`app-tab-${index}`} hidden={active !== index}><p>{item.description}</p><PillLink href={`mailto:info@qjquartzstone.com?subject=${encodeURIComponent(`Enquiry — ${item.title}`)}`}>Discuss your space</PillLink></div></div>)}<div className="application-bottom"><Arrow diagonal /><span>One material.<br />Countless possibilities.</span></div></div></div>
  </section>;
}
