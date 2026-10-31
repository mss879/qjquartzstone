"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/dictionaries";
import type { Resource } from "@/lib/types";
import { Arrow } from "../ui";

export default function ResourceLibrary({ resources, t, all }: { resources: Resource[]; t: Dictionary["resources"]; all: string }) {
  const [audience, setAudience] = useState("all");
  const [type, setType] = useState("all");
  const matches = resources.filter(item => (audience === "all" || item.audiences.includes(audience)) && (type === "all" || item.type === type));
  return <section className="resource-library section-shell">
    <div className="resource-filters"><div role="group" aria-label={t.audience}><span className="eyebrow">{t.audience}</span>{Object.entries(t.audiences).map(([value, label]) => <button key={value} type="button" aria-pressed={audience === value} onClick={() => setAudience(value)}>{label}</button>)}</div><div role="group" aria-label={t.type}><span className="eyebrow">{t.type}</span><button type="button" aria-pressed={type === "all"} onClick={() => setType("all")}>{all}</button>{Object.entries(t.types).map(([value, label]) => <button key={value} type="button" aria-pressed={type === value} onClick={() => setType(value)}>{label}</button>)}</div></div>
    {matches.length ? <ul className="resource-list">{matches.map(item => <li key={item.id}><span className="eyebrow">{t.types[item.type as keyof typeof t.types] ?? item.type}</span><div><h2>{item.title}</h2><p>{item.description}</p></div><a href={item.file} download className="text-link">{t.download} {item.format} <Arrow diagonal /></a></li>)}</ul> : <p className="empty-state">{t.empty}</p>}
  </section>;
}
