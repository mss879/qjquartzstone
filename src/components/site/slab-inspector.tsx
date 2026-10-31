"use client";

import Image from "next/image";
import { useState } from "react";

export default function SlabInspector({ src, alt, hint }: { src: string; alt: string; hint: string }) {
  const [lens, setLens] = useState<{ x: number; y: number } | null>(null);
  return <figure className="slab-inspector" onPointerMove={e => { if (e.pointerType !== "mouse") return; const box = e.currentTarget.getBoundingClientRect(); setLens({ x: ((e.clientX - box.left) / box.width) * 100, y: ((e.clientY - box.top) / box.height) * 100 }); }} onPointerLeave={() => setLens(null)}>
    <Image src={src} alt={alt} fill priority sizes="(max-width: 900px) 90vw, 60vw" />
    {lens && <span className="slab-lens" aria-hidden="true" style={{ left: `${lens.x}%`, top: `${lens.y}%`, backgroundImage: `url(${src})`, backgroundPosition: `${lens.x}% ${lens.y}%` }} />}
    <figcaption>{hint}</figcaption>
  </figure>;
}
