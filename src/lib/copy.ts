type Tree = Record<string, unknown>;
const isTree = (value: unknown): value is Tree => typeof value === "object" && value !== null && !Array.isArray(value);

/** Keeps the English shape and lets a translation replace any value it provides, so a missing key falls back to English. */
export function mergeCopy<T>(base: T, translation: unknown): T {
  if (!isTree(base) || !isTree(translation)) return (translation ?? base) as T;
  return Object.fromEntries(Object.entries(base).map(([key, value]) => [key, key in translation ? mergeCopy(value, translation[key]) : value])) as T;
}

export const fill = (template: string, values: Record<string, string | number>) => template.replace(/\{(\w+)\}/g, (match, key) => String(values[key] ?? match));
