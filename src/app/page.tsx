import Image from "next/image";
import Navigation from "@/components/navigation";
import MaterialStory from "@/components/material-story";
import Collection from "@/components/collection";
import Applications from "@/components/applications";
import { Arrow, Brand, PillLink, SectionLabel } from "@/components/ui";

export default function Home() {
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <div id="top" />
    <Navigation />
    <main id="main">
      <section className="hero section-shell" aria-labelledby="hero-title">
        <div className="hero-kicker"><span>ENGINEERED BY QJ. INSPIRED BY EARTH.</span><span>SRI LANKA ↗ TAIWAN</span></div>
        <h1 id="hero-title" className="hero-title"><span>NATURE.</span><span>REFINED.</span><span>IN QUARTZ.</span></h1>
        <div className="hero-sculpture hero-sculpture-right"><Image src="/images/quartz-sculpture.webp" alt="An expressive ribbon sculpture in finely veined white quartz" fill priority sizes="(max-width: 900px) 65vw, 42vw" /></div>
        <div className="hero-sculpture hero-sculpture-left" aria-hidden="true"><Image src="/images/hero-dark.webp" alt="" fill priority sizes="(max-width: 900px) 46vw, 30vw" /></div>
        <p className="hero-support-copy">Exceptional quartz surfaces.<br />For spaces that feel like you.</p><div className="hero-bottom"><a href="#about" className="scroll-cue"><span className="scroll-arrow">↓</span><span>A NEW PERSPECTIVE<br />ON THE EVERYDAY.</span></a><div className="hero-intro"><PillLink href="#collections">Find your surface</PillLink></div><div className="hero-index"><span>01 — 04</span><span className="hero-index-line" /><span>THE QJ EDIT</span></div></div>
      </section>
      <section id="about" className="about section-shell">
        <div className="section-heading"><SectionLabel number="01">The QJ story</SectionLabel><div><h2 className="about-statement">NATURAL CHARACTER.<br />EXTRAORDINARY<br /><span className="clay">POSSIBILITIES.</span></h2><div className="about-copy"><span className="eyebrow">ARTISTRY MEETS TECHNOLOGY.</span><div><p>Born from a partnership between Queens Ceramic Inc. in Taiwan and Jaysons Holdings (Pvt) Ltd in Sri Lanka, QJ brings material expertise and design ambition together.</p><p>From sourcing quartz to producing, polishing and installing surfaces, we follow the material’s journey. So your vision can take shape.</p><PillLink href="https://qjquartzstone.com/about-us-quartz-stones">Get to know QJ</PillLink></div></div></div></div>
        <div className="about-images"><figure className="about-detail"><div className="origin-stamp"><span className="origin-label">THE QJ PARTNERSHIP</span><div className="origin-partner"><strong>Taiwan</strong><span>Queens Ceramic Inc.</span></div><span className="origin-connector" aria-hidden="true">+</span><div className="origin-partner"><strong>Sri Lanka</strong><span>Jaysons Holdings (Pvt) Ltd</span></div></div><figcaption>THE COMPANIES BEHIND QJ QUARTZ STONE.</figcaption></figure><figure className="about-space"><div className="about-space-image"><Image src="/images/dining-concept.webp" alt="Breeze quartz visualized as a warm cream dining table" fill sizes="(max-width: 900px) 80vw, 60vw" /></div><figcaption><span>QJ227 / BREEZE</span><span>INTERIOR CONCEPT</span></figcaption></figure></div>
        <div className="about-marquee" aria-hidden="true">EARTH TO EVERYDAY.</div>
      </section>
      <MaterialStory />
      <Collection />
      <Applications />
      <section id="craft" className="craft section-shell"><div className="section-heading"><SectionLabel number="04">Behind the surface</SectionLabel><div><h2>FROM EARTH.<br />WITH INTENTION.</h2><p className="heading-copy">Good material is only the beginning.<br />What we do with it makes the difference.</p></div></div>
        <div className="craft-layout"><div className="craft-visual"><Image src="/images/craft-detail.webp" alt="Close-up visualization of the polished edge of Marble Grey quartz" fill sizes="(max-width: 900px) 90vw, 45vw" /><span className="craft-visual-label">THE DETAIL MAKES THE DIFFERENCE.</span><span className="craft-visual-index">QJ<br />905</span></div><div className="craft-steps">
          <details open><summary><span>01</span><h3>Carefully sourced.</h3><span className="details-plus">+</span></summary><p>Quartz is selected for its quality, whiteness and brightness. QJ’s sourcing expertise follows the material from its origins.</p></details>
          <details><summary><span>02</span><h3>Thoughtfully engineered.</h3><span className="details-plus">+</span></summary><p>Quartz, resin and pigments are blended, formed, vacuumed and compressed into slabs. The composition brings consistency to the surface.</p></details>
          <details><summary><span>03</span><h3>Finished with care.</h3><span className="details-plus">+</span></summary><p>Slabs are cured, diamond-polished and inspected before reaching your project. QJ’s process also recycles water used in polishing and cleaning.</p></details>
          <PillLink href="https://qjquartzstone.com/quartz-stone-production-sri-lanka">Inside the process</PillLink>
        </div></div>
        <div className="spec-strip"><div><span>STANDARD SLAB</span><strong>3200 × 1600<span>mm</span></strong></div><div><span>THICKNESS OPTIONS</span><strong>12 / 20 / 30<span>mm</span></strong></div><a href="https://qjquartzstone.com/quartz-stone-specifications" target="_blank" rel="noreferrer"><span>DESIGNED TO BE SPECIFIED.</span><span>Explore technical specifications <Arrow diagonal /></span></a></div>
      </section>
      <section id="contact" className="contact section-shell"><div className="contact-top"><SectionLabel number="05">Your next chapter</SectionLabel><span className="eyebrow">FOR HOMEOWNERS, ARCHITECTS & DESIGNERS.</span></div><a href="mailto:info@qjquartzstone.com" className="contact-title"><span>LET’S MAKE<br /><span className="contact-indent">SOMETHING</span><br />EXTRAORDINARY.</span><span className="contact-arrow"><Arrow diagonal /></span></a><div className="contact-bottom"><p>Have a space in mind?<br />Let’s find the surface that belongs there.</p><a href="mailto:info@qjquartzstone.com" className="contact-email">info@qjquartzstone.com <Arrow diagonal /></a></div></section>
    </main>
    <footer className="site-footer section-shell"><div className="footer-main"><div><Brand footer /><p>Natural character.<br />Engineered for living.</p></div><div className="footer-contact"><span className="eyebrow">SRI LANKA</span><p>357, Galle Road<br />Mount Lavinia, Sri Lanka</p><a href="tel:+94112722112">+94 11 2 722 112</a><a href="tel:+94777977787">+94 777 977 787</a></div><div className="footer-contact"><span className="eyebrow">TAIWAN</span><p>Queens Ceramic Inc.<br />Taiwan</p><a href="tel:+886225361613">+886 2 2536 1613</a><a href="mailto:info@qjquartzstone.com">Contact the team <Arrow diagonal /></a></div><nav className="footer-nav" aria-label="Footer navigation"><a href="#collections">Collections</a><a href="#about">Our story</a><a href="#spaces">Spaces</a><a href="#craft">The craft</a></nav></div><div className="footer-bottom"><span>© 2026 QJ Quartz Stone.</span><span className="footer-credit">Built and designed by <strong>ARC AI</strong></span><a href="#top">BACK TO TOP ↑</a></div><p className="footer-disclaimer">Stone visualizations &amp; interior concepts</p></footer>
  </>;
}
