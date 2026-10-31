"use client";

import { useMemo, useState } from "react";
import { emptyFilters, filterKeys, filterProducts, filtersToQuery, type FilterKey, type Filters } from "@/lib/catalogue";
import { fill } from "@/lib/copy";
import type { Dictionary } from "@/lib/dictionaries";
import type { Product } from "@/lib/types";
import { ProductCard } from "./product-card";

export default function Catalogue({ products, t, common, initial }: { products: Product[]; t: Dictionary["catalogue"]; common: Dictionary["common"]; initial: Filters }) {
  const [filters, setFilters] = useState(initial);
  const [panelOpen, setPanelOpen] = useState(false);
  const results = useMemo(() => filterProducts(products, filters), [products, filters]);
  const groups: { key: FilterKey; label: string; options: [string, string][] }[] = [
    { key: "colour", label: common.colour, options: Object.entries(t.colours) },
    { key: "pattern", label: common.pattern, options: Object.entries(t.patterns) },
    { key: "finish", label: common.finish, options: Object.entries(t.finishes) },
    { key: "thickness", label: common.thickness, options: [["12", "12 mm"], ["20", "20 mm"], ["30", "30 mm"]] },
    { key: "size", label: common.slabSize, options: Object.entries(t.slabSizes) },
    { key: "application", label: common.application, options: Object.entries(t.applications) },
  ];
  const update = (next: Filters) => {
    setFilters(next);
    const query = filtersToQuery(next);
    window.history.replaceState(null, "", query ? `?${query}` : window.location.pathname); // Filtered views stay shareable without a server round trip.
  };
  const toggle = (key: FilterKey, value: string) => update({ ...filters, [key]: filters[key].includes(value) ? filters[key].filter(item => item !== value) : [...filters[key], value] });
  const activeCount = filterKeys.reduce((total, key) => total + filters[key].length, 0);
  const active = groups.flatMap(group => group.options.filter(([value]) => filters[group.key].includes(value)).map(([value, label]) => ({ key: group.key, value, label })));

  return <section className="catalogue section-shell" aria-label={t.label}>
    <div className="catalogue-tabs" role="group" aria-label={common.collection}>{Object.entries(t.collections).map(([value, label]) => <button key={value} type="button" aria-pressed={filters.collection === value} onClick={() => update({ ...filters, collection: value })}>{label}</button>)}</div>
    <div className="catalogue-search"><input type="search" value={filters.q} onChange={e => update({ ...filters, q: e.target.value })} placeholder={t.search} aria-label={t.search} /><button type="button" className="catalogue-filter-toggle" aria-expanded={panelOpen} aria-controls="catalogue-filters" onClick={() => setPanelOpen(!panelOpen)}>{panelOpen ? t.hideFilters : t.showFilters}{activeCount > 0 && ` (${activeCount})`}</button></div>
    <div className="catalogue-layout">
      <aside id="catalogue-filters" className={`catalogue-filters ${panelOpen ? "is-open" : ""}`} aria-label={t.filters}>{groups.map(group => <fieldset key={group.key}><legend>{group.label}</legend>{group.options.map(([value, label]) => <label key={value}><input type="checkbox" checked={filters[group.key].includes(value)} onChange={() => toggle(group.key, value)} /><span>{label}</span></label>)}</fieldset>)}<p className="catalogue-note">{t.tagNote}</p></aside>
      <div className="catalogue-results">
        <div className="catalogue-summary"><p aria-live="polite">{results.length === 1 ? t.result : fill(t.results, { count: results.length })}</p>{active.map(chip => <button key={`${chip.key}-${chip.value}`} type="button" className="filter-chip" onClick={() => toggle(chip.key, chip.value)}>{chip.label} ×</button>)}{(activeCount > 0 || filters.q) && <button type="button" className="text-button" onClick={() => update({ ...emptyFilters, collection: filters.collection })}>{t.clearAll}</button>}</div>
        {results.length ? <div className="surface-grid">{results.map(product => <ProductCard key={product.code} code={product.code} slug={product.slug} name={product.name} swatch={product.swatch} caption={t.collections[product.collection]} />)}</div> : <div className="empty-state"><p>{t.empty}</p><button type="button" className="text-link" onClick={() => update(emptyFilters)}>{t.emptyCta}</button></div>}
      </div>
    </div>
  </section>;
}
