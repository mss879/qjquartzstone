export type SavedSurface = { code: string; note: string };
export type Saved = { favourites: SavedSurface[]; name: string; compare: string[] };
export type Shared = { name: string; items: SavedSurface[] };

export const emptySaved: Saved = { favourites: [], name: "", compare: [] };
export const compareLimit = 4;

export const toggleFavourite = (saved: Saved, code: string): Saved => ({
  ...saved,
  favourites: saved.favourites.some(item => item.code === code) ? saved.favourites.filter(item => item.code !== code) : [...saved.favourites, { code, note: "" }],
});

export const toggleCompare = (saved: Saved, code: string): Saved => {
  if (saved.compare.includes(code)) return { ...saved, compare: saved.compare.filter(item => item !== code) };
  return saved.compare.length >= compareLimit ? saved : { ...saved, compare: [...saved.compare, code] };
};

export const addFavourites = (saved: Saved, items: SavedSurface[]): Saved => ({
  ...saved,
  favourites: [...saved.favourites, ...items.filter(item => !saved.favourites.some(existing => existing.code === item.code))],
});

export const setNote = (saved: Saved, code: string, note: string): Saved => ({
  ...saved,
  favourites: saved.favourites.map(item => item.code === code ? { ...item, note } : item),
});

// Share links carry the list itself, so opening one needs no account or stored record.
export function encodeShortlist({ name, items }: Shared) {
  const bytes = new TextEncoder().encode(JSON.stringify({ n: name, i: items.map(item => [item.code, item.note]) }));
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeShortlist(value: string): Shared | null {
  try {
    const binary = atob(value.replace(/-/g, "+").replace(/_/g, "/"));
    const data = JSON.parse(new TextDecoder().decode(Uint8Array.from(binary, char => char.charCodeAt(0))));
    if (!Array.isArray(data.i)) return null;
    return { name: String(data.n ?? ""), items: data.i.map(([code, note]: [string, string]) => ({ code: String(code), note: String(note ?? "") })) };
  } catch {
    return null;
  }
}
