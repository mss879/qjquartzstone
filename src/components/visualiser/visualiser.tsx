"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useSite, updateSaved } from "@/components/site/site-provider";
import { Arrow, PillLink } from "@/components/ui";
import { copyText } from "@/lib/clipboard";
import type { Dictionary } from "@/lib/dictionaries";
import { addFavourites } from "@/lib/shortlist";
import PhotoVisualiser from "./photo-visualiser";
import RoomCanvas from "./room-canvas";
import type { RoomId, Zone } from "./room-scene";

const zoneOrder: Zone[] = ["counter", "floor", "wall"];
const roomOrder: RoomId[] = ["kitchen", "bathroom", "living"];
type Applied = Record<Zone, string | null>;

export default function Visualiser({ initial, t }: { initial: { room: RoomId; surfaces: Applied }; t: Dictionary["visualiser"] }) {
  const { lang, catalogue } = useSite();
  const [mode, setMode] = useState<"presets" | "photo">("presets");
  const [room, setRoom] = useState(initial.room);
  const [applied, setApplied] = useState(initial.surfaces);
  const [zone, setZone] = useState<Zone>("counter");
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const product = (code: string | null) => catalogue.find(item => item.code === code);
  const surfaces = useMemo(() => Object.fromEntries(zoneOrder.map(name => [name, product(applied[name])?.swatch ?? null])), [applied]); // eslint-disable-line react-hooks/exhaustive-deps
  const matches = catalogue.filter(item => `${item.code} ${item.name}`.toLowerCase().includes(search.toLowerCase()));
  const chosen = [...new Set(Object.values(applied).filter((code): code is string => Boolean(code)))];

  const link = (next: { room?: RoomId; applied?: Applied }) => {
    const query = new URLSearchParams({ room: next.room ?? room });
    Object.entries(next.applied ?? applied).forEach(([name, code]) => { if (code) query.set(name, code); });
    return `?${query}`;
  };
  const pickRoom = (id: RoomId) => { setRoom(id); window.history.replaceState(null, "", link({ room: id })); };
  const pickSurface = (code: string | null) => {
    const next = { ...applied, [zone]: code };
    setApplied(next);
    setSaved(false);
    window.history.replaceState(null, "", link({ applied: next }));
  };
  const copy = async () => {
    await copyText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return <section className="visualiser section-shell">
    <div className="visualiser-modes" role="group" aria-label={t.label}><button type="button" aria-pressed={mode === "presets"} onClick={() => setMode("presets")}>{t.presets}</button><button type="button" aria-pressed={mode === "photo"} onClick={() => setMode("photo")}>{t.yourPhoto}</button></div>
    {mode === "photo" ? <PhotoVisualiser t={t} /> : <div className="visualiser-layout">
      <div className="visualiser-stage">
        <div className="room-tabs" role="group" aria-label={t.presets}>{roomOrder.map(id => <button key={id} type="button" aria-pressed={room === id} onClick={() => pickRoom(id)}>{t.rooms[id]}</button>)}</div>
        <div className="visualiser-canvas"><RoomCanvas room={room} surfaces={surfaces} loading={t.loading} unsupported={t.noWebgl} /><span className="visualiser-hint">{t.drag}</span></div>
        <p className="fine-print">{t.disclaimer}</p>
      </div>
      <div className="visualiser-panel">
        <div className="zone-list" role="group" aria-label={t.applied}>{zoneOrder.map(name => { const item = product(applied[name]); return <button key={name} type="button" aria-pressed={zone === name} onClick={() => setZone(name)}><span className="zone-swatch">{item && <Image src={item.swatch} alt="" fill sizes="44px" />}</span><span><strong>{t.zones[name]}</strong><span>{item ? `${item.code} ${item.name}` : t.original}</span></span></button>; })}</div>
        <div className="surface-picker"><label className="field"><span>{t.surfaces}: {t.zones[zone]}</span><input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder={t.search} /></label>
          <div className="surface-picker-grid"><button type="button" className={`picker-original ${applied[zone] ? "" : "is-on"}`} aria-pressed={!applied[zone]} onClick={() => pickSurface(null)}>{t.original}</button>{matches.map(item => <button key={item.code} type="button" className={applied[zone] === item.code ? "is-on" : ""} aria-pressed={applied[zone] === item.code} aria-label={`${item.code} ${item.name}`} title={`${item.code} ${item.name}`} onClick={() => pickSurface(item.code)}><Image src={item.swatch} alt="" fill sizes="72px" /></button>)}</div>
        </div>
        <div className="visualiser-actions"><PillLink filled href={`/${lang}/samples?surface=${chosen.join(",")}`}>{t.request}</PillLink><button type="button" className="text-link" disabled={!chosen.length} onClick={() => { updateSaved(current => addFavourites(current, chosen.map(code => ({ code, note: "" })))); setSaved(true); }}>{saved ? t.savedAll : t.saveAll} <Arrow diagonal /></button><button type="button" className="text-link" onClick={copy}>{copied ? t.copied : t.shareLink} <Arrow diagonal /></button></div>
      </div>
    </div>}
  </section>;
}
