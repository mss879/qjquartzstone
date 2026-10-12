import Image from "next/image";
import type { ReactNode } from "react";

export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={diagonal ? "arrow diagonal" : "arrow"}><path d="M4 12h15M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.25" /></svg>;
}

export function PillLink({ href, children, light = false }: { href: string; children: ReactNode; light?: boolean }) {
  return <a href={href} className={`pill-link ${light ? "light" : ""}`}><span>{children}</span><Arrow /></a>;
}

export function SectionLabel({ number, children }: { number: string; children: ReactNode }) {
  return <div className="section-label"><span className="label-dot" /><span>{children}</span><span className="section-number">{number}</span></div>;
}

export function Brand({ footer = false }: { footer?: boolean }) {
  return <a className={`brand ${footer ? "brand-footer" : ""}`} href="#top" aria-label="QJ Quartz Stone — home"><Image src="/images/qj-logo.png" alt="QJ Quartz Stone" width={333} height={70} className="brand-image" priority={!footer} /></a>;
}
