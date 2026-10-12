"use client";

import { useEffect, useRef, useState } from "react";
import { Arrow, Brand } from "./ui";

const links = [["Collections", "#collections"], ["Our story", "#about"], ["Spaces", "#spaces"], ["The craft", "#craft"]];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); toggle.current?.focus(); }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);

  return <header className="site-header">
    <Brand />
    <nav className="desktop-nav" aria-label="Main navigation">{links.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</nav>
    <a className="header-contact" href="#contact">Let’s talk stone <Arrow diagonal /></a>
    <button ref={toggle} type="button" className={`menu-toggle ${open ? "is-open" : ""}`} aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? "Close navigation" : "Open navigation"} onClick={() => setOpen(!open)}><span /><span /></button>
    <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile navigation" hidden={!open}>{[...links, ["Contact", "#contact"]].map(([label, href], i) => <a key={href} href={href} onClick={() => setOpen(false)}><span>0{i + 1}</span>{label}<Arrow /></a>)}</nav>
  </header>;
}
