"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { getScrollProgress, getStoryFrame } from "@/lib/scroll-story";
import { Arrow } from "./ui";

const chapters = [
  { eyebrow: "01 / THE INSPIRATION", title: "A little closer\nto nature.", body: "Natural character. New possibilities. The beginning of every QJ surface." },
  { eyebrow: "02 / THE SURFACE", title: "Beauty, in\nevery dimension.", body: "Quartz, carefully composed into a surface made for the way you live." },
  { eyebrow: "03 / THE DETAIL", title: "Go beyond\nthe surface.", body: "An uninterrupted design. A considered edge. Discover the material from a new angle." },
  { eyebrow: "04 / THE SPACE", title: "From a surface.\nTo a feeling.", body: "The same fine-veined character, imagined in the heart of a home." },
];

export default function MaterialStory() {
  const section = useRef<HTMLElement>(null);
  const sculpture = useRef<HTMLDivElement>(null);
  const slab = useRef<HTMLDivElement>(null);
  const interior = useRef<HTMLDivElement>(null);
  const captions = useRef<(HTMLDivElement | null)[]>([]);
  const progressBar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 900px)");
    let animation = 0;
    const update = () => {
      animation = 0;
      if (!section.current || reducedMotion.matches || mobile.matches) return;
      const rect = section.current.getBoundingClientRect();
      const frame = getStoryFrame(getScrollProgress(rect.top, rect.height, window.innerHeight));
      if (sculpture.current) {
        sculpture.current.style.opacity = String(frame.sculptureOpacity);
        sculpture.current.style.transform = `translateY(${-frame.progress * 80}px) rotate(${frame.sculptureRotation}deg) scale(${frame.sculptureScale})`;
      }
      if (slab.current) {
        slab.current.style.opacity = String(frame.slabOpacity);
        slab.current.style.transform = `perspective(1500px) rotateY(${frame.slabRotation}deg) scale(${frame.slabScale})`;
      }
      if (interior.current) {
        interior.current.style.opacity = String(frame.interiorOpacity);
        interior.current.style.transform = `scale(${frame.interiorScale})`;
      }
      captions.current.forEach((caption, index) => {
        if (caption) { caption.style.opacity = frame.chapter === index ? "1" : "0"; caption.setAttribute("aria-hidden", String(frame.chapter !== index)); }
      });
      section.current.dataset.chapter = String(frame.chapter);
      if (progressBar.current) progressBar.current.style.transform = `scaleX(${frame.progress})`;
    };
    const schedule = () => { if (!animation) animation = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reducedMotion.addEventListener("change", schedule);
    mobile.addEventListener("change", schedule);
    return () => {
      window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule);
      reducedMotion.removeEventListener("change", schedule); mobile.removeEventListener("change", schedule);
      cancelAnimationFrame(animation);
    };
  }, []);

  return <section ref={section} className="material-story" aria-label="From natural inspiration to quartz surface to living space">
    <div className="story-stage">
      <div ref={interior} className="story-interior"><Image src="/images/kitchen-concept.webp" alt="Bianco Calacatta visualized as a waterfall kitchen island in a sunlit tropical home" fill sizes="100vw" /></div>
      <div className="story-topline"><span>A MATERIAL. A WORLD OF POSSIBILITIES.</span><span>QJ / MATERIAL STUDY</span></div>
      <div className="story-art">
        <div ref={sculpture} className="story-sculpture"><Image src="/images/story-mineral.webp" alt="Raw milky quartz crystal, the inspiration for an engineered surface" fill sizes="(max-width: 900px) 90vw, 75vw" /></div>
        <div ref={slab} className="story-slab"><Image src="/images/story-surface.webp" alt="QJ711 Bianco Calacatta slab visualization with a visible edge" fill sizes="(max-width: 900px) 90vw, 75vw" /></div>
        <div className="story-dimension"><span>3200 mm</span><span>1600 mm</span></div>
      </div>
      <div className="story-captions">{chapters.map((chapter, i) => <div key={chapter.eyebrow} ref={node => { captions.current[i] = node; }} className={`story-caption chapter-${i}`} aria-hidden={i !== 0}><span className="eyebrow">{chapter.eyebrow}</span><h2>{chapter.title.split("\n").map((line, j) => <span key={j}>{line}</span>)}</h2><p>{chapter.body}</p></div>)}</div>
      <div className="story-bottomline"><span>KEEP SCROLLING TO EXPLORE <Arrow /></span><span>DESIGN VISUALIZATION / QJ711</span></div>
      <div className="story-progress"><span ref={progressBar} /></div>
    </div>
    <div className="story-static-caption"><span className="eyebrow">FROM SURFACE TO SPACE</span><h2>A material.<br />A world of possibilities.</h2><p>Bianco Calacatta, imagined as the heart of a home.</p></div>
  </section>;
}
