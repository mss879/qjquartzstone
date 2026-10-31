"use client";

import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import { emptySaved, type Saved } from "@/lib/shortlist";
import type { Product } from "@/lib/types";

export type CatalogueItem = Pick<Product, "code" | "slug" | "name" | "swatch" | "collection">;
type Labels = { save: string; saved: string; compare: string; comparing: string; tray: string; open: string; limit: string };
type Site = { lang: Locale; catalogue: CatalogueItem[]; labels: Labels };

const SiteContext = createContext<Site | null>(null);

export function SiteProvider({ lang, catalogue, labels, children }: Site & { children: ReactNode }) {
  const value = useMemo(() => ({ lang, catalogue, labels }), [lang, catalogue, labels]);
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const site = useContext(SiteContext);
  if (!site) throw new Error("useSite must be used inside SiteProvider");
  return site;
}

const KEY = "qj-saved-v1";
const listeners = new Set<() => void>();
let saved = emptySaved;
let loaded = false;

function snapshot() {
  if (!loaded) {
    loaded = true;
    try { saved = { ...emptySaved, ...JSON.parse(localStorage.getItem(KEY) ?? "{}") }; } catch { /* private mode: keep the list for this visit only */ }
  }
  return saved;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function updateSaved(change: (current: Saved) => Saved) {
  saved = change(snapshot());
  try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch { /* the in-memory list still works */ }
  listeners.forEach(listener => listener());
}

export const useSaved = () => useSyncExternalStore(subscribe, snapshot, () => emptySaved);
