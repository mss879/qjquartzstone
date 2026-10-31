import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={diagonal ? "arrow diagonal" : "arrow"}><path d="M4 12h15M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.25" /></svg>;
}

export function Heart({ filled = false }: { filled?: boolean }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="icon" fill={filled ? "currentColor" : "none"}><path d="M12 20s-7.5-4.6-9-9.2C2 7.6 4.2 5 7 5c2 0 3.6 1 5 3 1.4-2 3-3 5-3 2.8 0 5 2.6 4 5.8C19.5 15.4 12 20 12 20Z" stroke="currentColor" strokeWidth="1.25" /></svg>;
}

export function CompareIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="icon" fill="none"><path d="M9 4H4v16h5M15 4h5v16h-5M12 2v20" stroke="currentColor" strokeWidth="1.25" /></svg>;
}

export function PillLink({ href, children, light = false, filled = false }: { href: string; children: ReactNode; light?: boolean; filled?: boolean }) {
  return <Link href={href} className={`pill-link ${light ? "light" : ""} ${filled ? "filled" : ""}`}><span>{children}</span><Arrow /></Link>;
}

export function SectionLabel({ number, children }: { number: string; children: ReactNode }) {
  return <div className="section-label"><span className="label-dot" /><span>{children}</span><span className="section-number">{number}</span></div>;
}

export function Brand({ footer = false, href, label }: { footer?: boolean; href: string; label: string }) {
  return <Link className={`brand ${footer ? "brand-footer" : ""}`} href={href} aria-label={label}><Image src="/images/qj-logo.png" alt="QJ Quartz Stone" width={333} height={70} className="brand-image" priority={!footer} /></Link>;
}

export function Lines({ lines }: { lines: readonly string[] }) {
  return lines.map((line, index) => <span key={index}>{index > 0 && <br />}{line}</span>);
}

export function PageHero({ number, label, title, copy, children }: { number: string; label: string; title: readonly string[]; copy?: string; children?: ReactNode }) {
  return <section className="page-hero section-shell"><div className="section-heading"><SectionLabel number={number}>{label}</SectionLabel><div><h1><Lines lines={title} /></h1>{copy && <p className="heading-copy">{copy}</p>}{children}</div></div></section>;
}

export function DraftNote({ children }: { children: ReactNode }) {
  return <span className="draft-note">{children}</span>;
}
