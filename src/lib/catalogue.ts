import type { Product } from "./types";

export const filterKeys = ["colour", "pattern", "finish", "thickness", "size", "application"] as const;
export type FilterKey = (typeof filterKeys)[number];
export type Filters = { q: string; collection: string } & Record<FilterKey, string[]>;

export const emptyFilters: Filters = { q: "", collection: "all", colour: [], pattern: [], finish: [], thickness: [], size: [], application: [] };

const productValues = (product: Product): Record<FilterKey, string[]> => ({
  colour: product.colours, pattern: [product.pattern], finish: product.finishes, thickness: product.thicknesses.map(String), size: product.slabSizes, application: product.applications,
});

/** Options within one filter widen the results; separate filters narrow them. */
export function filterProducts(products: Product[], filters: Filters) {
  const words = filters.q.toLowerCase().split(/\s+/).filter(Boolean);
  return products.filter(product => {
    if (filters.collection !== "all" && product.collection !== filters.collection) return false;
    const haystack = `${product.code} ${product.name} ${product.tone} ${product.collection} ${product.colours.join(" ")} ${product.pattern}`.toLowerCase();
    if (!words.every(word => haystack.includes(word))) return false;
    const values = productValues(product);
    return filterKeys.every(key => !filters[key].length || filters[key].some(option => values[key].includes(option)));
  });
}

export function parseFilters(params: Record<string, string | string[] | undefined>): Filters {
  const single = (key: string) => { const value = params[key]; return Array.isArray(value) ? value[0] ?? "" : value ?? ""; };
  return { ...Object.fromEntries(filterKeys.map(key => [key, single(key).split(",").filter(Boolean)])), q: single("q"), collection: single("collection") || "all" } as Filters;
}

export function filtersToQuery(filters: Filters) {
  const query = new URLSearchParams();
  if (filters.q) query.set("q", filters.q);
  if (filters.collection !== "all") query.set("collection", filters.collection);
  filterKeys.forEach(key => { if (filters[key].length) query.set(key, filters[key].join(",")); });
  return query.toString();
}

export const relatedProducts = (products: Product[], product: Product, limit = 4) => products
  .filter(item => item.code !== product.code)
  .map(item => ({ item, score: (item.pattern === product.pattern ? 2 : 0) + item.colours.filter(colour => product.colours.includes(colour)).length * 2 + (item.collection === product.collection ? 1 : 0) }))
  .sort((a, b) => b.score - a.score).slice(0, limit).map(({ item }) => item);
