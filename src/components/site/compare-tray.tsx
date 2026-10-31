"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toggleCompare } from "@/lib/shortlist";
import { Arrow } from "../ui";
import { updateSaved, useSaved, useSite } from "./site-provider";

export default function CompareTray() {
  const { lang, catalogue, labels } = useSite();
  const { compare } = useSaved();
  const pathname = usePathname();
  if (!compare.length || pathname.endsWith("/compare")) return null;
  const items = compare.map(code => catalogue.find(item => item.code === code)).filter(item => item !== undefined);
  return <aside className="compare-tray" aria-label={labels.tray}><span className="eyebrow">{labels.tray}</span><ul>{items.map(item => <li key={item.code}><Image src={item.swatch} alt="" width={44} height={44} /><button type="button" aria-label={`${labels.comparing}: ${item.name}`} onClick={() => updateSaved(saved => toggleCompare(saved, item.code))}>×</button></li>)}</ul><Link className="pill-link filled" href={`/${lang}/compare?surfaces=${compare.join(",")}`}><span>{labels.open}</span><Arrow /></Link></aside>;
}
