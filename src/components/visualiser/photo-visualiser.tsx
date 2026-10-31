"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { useSite } from "@/components/site/site-provider";
import { Arrow } from "@/components/ui";
import { fill } from "@/lib/copy";
import type { Dictionary } from "@/lib/dictionaries";
import { blendSurface, orderCorners, type Point, type Quad } from "@/lib/homography";

type Layer = { corners: Quad; code: string };
const maxWidth = 1500;

const loadImage = (src: string) => new Promise<HTMLImageElement>((resolve, reject) => {
  const image = new window.Image();
  image.onload = () => resolve(image);
  image.onerror = reject;
  image.src = src;
});

function pixelsOf(image: HTMLImageElement, width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true })!;
  context.drawImage(image, 0, 0, width, height);
  return { context, pixels: context.getImageData(0, 0, width, height) };
}

export default function PhotoVisualiser({ t }: { t: Dictionary["visualiser"] }) {
  const { catalogue } = useSite();
  const canvas = useRef<HTMLCanvasElement>(null);
  const [photo, setPhoto] = useState<HTMLImageElement | null>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [layers, setLayers] = useState<Layer[]>([]);
  const [surface, setSurface] = useState(catalogue[0]?.code ?? "");
  const [search, setSearch] = useState("");
  const matches = catalogue.filter(item => `${item.code} ${item.name}`.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    if (!photo || !canvas.current) return;
    let cancelled = false;
    const target = canvas.current;
    (async () => {
      const scale = Math.min(1, maxWidth / photo.naturalWidth);
      const width = Math.round(photo.naturalWidth * scale), height = Math.round(photo.naturalHeight * scale);
      const { pixels } = pixelsOf(photo, width, height);
      const frame = { data: pixels.data, width, height };
      for (const layer of layers) {
        const source = catalogue.find(item => item.code === layer.code);
        if (!source) continue;
        const texture = await loadImage(source.swatch);
        const { pixels: surfacePixels } = pixelsOf(texture, texture.naturalWidth, texture.naturalHeight);
        blendSurface(frame, layer.corners.map(point => ({ x: point.x * width, y: point.y * height })) as Quad, { data: surfacePixels.data, width: texture.naturalWidth, height: texture.naturalHeight });
      }
      if (cancelled) return;
      target.width = width;
      target.height = height;
      target.getContext("2d")?.putImageData(pixels, 0, 0);
    })();
    return () => { cancelled = true; };
  }, [photo, layers, catalogue]);

  const upload = async (next: File | undefined) => {
    if (!next) return;
    setPhoto(await loadImage(URL.createObjectURL(next)));
    setPoints([]);
    setLayers([]);
  };

  const mark = (event: MouseEvent<HTMLCanvasElement>) => {
    if (points.length >= 4) return;
    const box = event.currentTarget.getBoundingClientRect();
    const next = [...points, { x: (event.clientX - box.left) / box.width, y: (event.clientY - box.top) / box.height }];
    if (next.length === 4) {
      setLayers([...layers, { corners: orderCorners(next), code: surface }]);
      setPoints([]);
    } else setPoints(next);
  };

  const pick = (code: string) => {
    setSurface(code);
    if (layers.length) setLayers(layers.map((layer, index) => index === layers.length - 1 ? { ...layer, code } : layer));
  };

  const download = () => {
    canvas.current?.toBlob(blob => {
      if (!blob) return;
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "qj-visualisation.jpg";
      link.click();
    }, "image/jpeg", .92);
  };

  if (!photo) return <div className="photo-empty"><h2>{t.uploadTitle}</h2><ol>{t.steps.map(step => <li key={step}>{step}</li>)}</ol><label className="pill-link filled"><span>{t.upload}</span><Arrow /><input type="file" accept="image/jpeg,image/png,image/webp" className="visually-hidden" onChange={e => upload(e.target.files?.[0])} /></label><p className="fine-print">{t.uploadHint}</p></div>;

  return <div className="visualiser-layout">
    <div className="visualiser-stage"><div className="photo-stage"><canvas ref={canvas} onClick={mark} aria-label={t.photoAlt} role="img" />{points.map((point, index) => <span key={index} className="photo-corner" style={{ left: `${point.x * 100}%`, top: `${point.y * 100}%` }}>{index + 1}</span>)}<span className="visualiser-hint">{fill(t.corners, { count: points.length + 1 })}</span></div><p className="fine-print">{t.disclaimer}</p></div>
    <div className="visualiser-panel">
      <div className="surface-picker"><label className="field"><span>{t.surfaces}</span><input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder={t.search} /></label>
        <div className="surface-picker-grid">{matches.map(item => <button key={item.code} type="button" className={surface === item.code ? "is-on" : ""} aria-pressed={surface === item.code} aria-label={`${item.code} ${item.name}`} title={`${item.code} ${item.name}`} onClick={() => pick(item.code)}><Image src={item.swatch} alt="" fill sizes="72px" /></button>)}</div>
      </div>
      <div className="visualiser-actions">
        <button type="button" className="pill-link filled" onClick={download} disabled={!layers.length}><span>{t.download}</span><Arrow /></button>
        <button type="button" className="text-link" onClick={() => { setLayers([]); setPoints([]); }}>{t.reset} <Arrow diagonal /></button>
        <label className="text-link">{t.changePhoto} <Arrow diagonal /><input type="file" accept="image/jpeg,image/png,image/webp" className="visually-hidden" onChange={e => upload(e.target.files?.[0])} /></label>
      </div>
    </div>
  </div>;
}
