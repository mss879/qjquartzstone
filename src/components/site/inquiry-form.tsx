"use client";

import Image from "next/image";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { fill } from "@/lib/copy";
import type { Dictionary } from "@/lib/dictionaries";
import { validateSubmission, type Submission } from "@/lib/inquiry";
import type { InquiryKind } from "@/lib/types";
import { Arrow } from "../ui";
import { useSaved, useSite } from "./site-provider";

type T = Dictionary["forms"];

function Field({ name, label, error, type = "text", required, rows, autoComplete, children }: { name: string; label: string; error?: string; type?: string; required?: boolean; rows?: number; autoComplete?: string; children?: ReactNode }) {
  const id = `field-${name}`;
  const shared = { id, name, required, autoComplete, "aria-invalid": Boolean(error) || undefined, "aria-describedby": error ? `${id}-error` : undefined };
  return <label className="field" htmlFor={id}><span>{label}{required && " *"}</span>{children ? <select {...shared} defaultValue="">{children}</select> : rows ? <textarea {...shared} rows={rows} /> : <input {...shared} type={type} />}{error && <em id={`${id}-error`}>{error}</em>}</label>;
}

const options = (values: [string, string][]) => <><option value="" disabled>—</option>{values.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</>;

/** Demo form: validates and shows the real confirmation, but sends nothing until the website backend is built. */
export default function InquiryForm({ kind: initialKind, kinds, kindLabels, preselected = [], t, remove }: { kind: InquiryKind; kinds?: InquiryKind[]; kindLabels?: Record<string, string>; preselected?: string[]; t: T; remove: string }) {
  const { catalogue } = useSite();
  const { favourites } = useSaved();
  const [kind, setKind] = useState(initialKind);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [reference, setReference] = useState("");
  const [added, setAdded] = useState<string[]>(preselected);
  const [removed, setRemoved] = useState<string[]>([]);
  const [consultationType, setConsultationType] = useState("");
  // Saved favourites join every request automatically, so the team sees what the customer was considering.
  const selected = useMemo(() => [...new Set([...added, ...favourites.map(item => item.code)])].filter(code => !removed.includes(code)), [added, favourites, removed]);
  const items = selected.map(code => catalogue.find(item => item.code === code)).filter(item => item !== undefined);
  const showProducts = kind !== "distributor";

  if (reference) return <div className="form-success" role="status"><h2>{t.thanksTitle}</h2><p>{fill(t.thanks, { reference })}</p><p className="draft-note">{t.demoNote}</p><button type="button" className="text-link" onClick={() => setReference("")}>{t.another} <Arrow diagonal /></button></div>;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const fields = Object.fromEntries(new FormData(event.currentTarget).entries()) as Submission;
    const invalid = validateSubmission(kind, { ...fields, consultationType }, selected);
    const messages = { required: t.required, invalidEmail: t.invalidEmail, pickProduct: t.pickProduct };
    setErrors(Object.fromEntries(Object.entries(invalid).map(([field, code]) => [field, messages[code]])));
    if (Object.keys(invalid).length) return;
    setReference(`QJ-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`);
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };

  return <form className="inquiry-form" onSubmit={submit} noValidate>
    {kinds && <fieldset className="form-choice"><legend>{t.enquiryType}</legend>{kinds.map(value => <label key={value}><input type="radio" checked={kind === value} onChange={() => setKind(value)} /><span>{kindLabels?.[value]}</span></label>)}</fieldset>}
    <div className="form-grid">
      <Field name="name" label={t.name} required error={errors.name} autoComplete="name" />
      <Field name="email" label={t.email} type="email" required error={errors.email} autoComplete="email" />
      <Field name="phone" label={t.phone} type="tel" required={kind !== "contact" && kind !== "distributor" && kind !== "after-sales"} error={errors.phone} autoComplete="tel" />
      <Field name="company" label={t.company} required={kind === "distributor"} error={errors.company} autoComplete="organization" />
      <Field name="country" label={t.country} required={kind === "distributor"} error={errors.country} autoComplete="country-name" />
      <Field name="city" label={t.city} autoComplete="address-level2" />
      {kind === "sample" && <div className="field-wide"><Field name="deliveryAddress" label={t.deliveryAddress} required error={errors.deliveryAddress} autoComplete="street-address" /></div>}
      {kind === "consultation" && <>
        <label className="field" htmlFor="field-consultationType"><span>{t.consultationType} *</span><select id="field-consultationType" name="consultationType" value={consultationType} onChange={e => setConsultationType(e.target.value)} aria-invalid={Boolean(errors.consultationType) || undefined}>{options([["showroom", t.showroom], ["site", t.site]])}</select>{errors.consultationType && <em>{errors.consultationType}</em>}</label>
        <Field name="preferredDate" label={t.preferredDate} type="date" required error={errors.preferredDate} />
        <Field name="preferredTime" label={t.preferredTime} required error={errors.preferredTime}>{options([["morning", t.morning], ["afternoon", t.afternoon], ["evening", t.evening]])}</Field>
        {consultationType === "site" && <div className="field-wide"><Field name="siteAddress" label={t.siteAddress} required error={errors.siteAddress} autoComplete="street-address" /></div>}
      </>}
      {(kind === "quotation" || kind === "sample" || kind === "consultation") && <Field name="projectType" label={t.projectType}>{options([["residential", t.residential], ["commercial", t.commercial], ["hospitality", t.hospitality]])}</Field>}
      {kind === "quotation" && <Field name="areaSize" label={t.areaSize} type="number" />}
      {kind === "distributor" && <>
        <Field name="website" label={t.website} type="url" autoComplete="url" />
        <Field name="market" label={t.market} required error={errors.market} />
        <Field name="volume" label={t.volume} type="number" />
        <Field name="warehouse" label={t.warehouse}>{options([["yes", t.yes], ["no", t.no]])}</Field>
        <div className="field-wide"><Field name="experience" label={t.experience} rows={4} required error={errors.experience} /></div>
      </>}
      {kind === "after-sales" && <>
        <Field name="orderReference" label={t.orderReference} />
        <Field name="installedDate" label={t.installedDate} type="date" />
        <div className="field-wide"><Field name="issue" label={t.issue} rows={4} required error={errors.issue} /></div>
      </>}
    </div>
    {showProducts && <div className="form-products"><div className="form-products-head"><span>{t.products}{(kind === "sample" || kind === "quotation") && " *"}</span>{favourites.length > 0 && <span className="eyebrow">{t.shortlistIncluded}</span>}</div>
      {items.length ? <ul>{items.map(item => <li key={item.code}><Image src={item.swatch} alt="" width={40} height={40} /><span>{item.code} {item.name}</span><button type="button" aria-label={`${remove}: ${item.name}`} onClick={() => { setAdded(added.filter(code => code !== item.code)); setRemoved([...removed, item.code]); }}>×</button></li>)}</ul> : <p className="fine-print">{t.noProducts}</p>}
      <select aria-label={t.addProduct} value="" onChange={e => { const code = e.target.value; if (code) { setAdded([...added, code]); setRemoved(removed.filter(item => item !== code)); } }}><option value="">{t.addProduct}</option>{catalogue.filter(item => !selected.includes(item.code)).map(item => <option key={item.code} value={item.code}>{item.code} {item.name}</option>)}</select>
      {errors.products && <em className="field-error">{errors.products}</em>}
    </div>}
    {kind !== "distributor" && kind !== "after-sales" && <Field name="message" label={t.message} rows={4} required={kind === "contact"} error={errors.message} />}
    <div className="form-submit"><button type="submit" className="pill-link filled"><span>{t.submit}</span><Arrow /></button><p className="fine-print">{t.privacy}</p></div>
  </form>;
}
