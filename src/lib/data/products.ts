import type { CollectionId, Product } from "../types";

// Codes and names are exactly as printed on QJ's published swatches, including their spellings.
type Row = [code: string, name: string, tone: string, colours: string[], pattern: string, description?: string];

const nature: Row[] = [
  ["QJ711", "Bianco Calacatta", "White / fine grey veining", ["white"], "veined", "A soft white canvas traced with delicate grey veins. A considered foundation for light-filled interiors."],
  ["QJ707N", "Statuario", "White / expressive grey veining", ["white"], "veined", "Expressive grey veins move across a bright white surface. A distinctive centrepiece with the character of natural stone."],
  ["QJ712", "Pietra Grey", "Charcoal / subtle mineral veining", ["black", "grey"], "veined", "A refined charcoal surface with fine mineral lines. Bring depth, balance and a quiet confidence to your space."],
  ["QJ905", "Marble Grey", "Silver grey / layered mineral pattern", ["grey"], "marbled", "Layers of silver-grey mineral character create a richly textured surface. A different expression of stone, with depth in every detail."],
  ["QJ227", "Breeze", "Cream ivory / subtle mineral markings", ["cream"], "marbled", "Soft cream tones and subtle mineral markings. A quiet, warm surface that lets the architecture—and everyday life—take centre stage."],
  ["QJ701N", "Calcita White", "White / bold grey veining", ["white"], "veined"],
  ["QJ702N", "Calcita Vine", "White / long flowing grey veins", ["white"], "veined"],
  ["QJ708N", "Calacatta", "White / broad grey veining", ["white"], "veined"],
  ["QJ902", "Crystal Ariston", "White / soft grey veining", ["white"], "veined"],
  ["QJ201", "Carrara", "White / faint grey veining", ["white"], "veined"],
  ["QJ210", "Snowy White", "White / whisper-thin veining", ["white"], "veined"],
  ["QJ203WP", "Jade Silk", "White / fine silk-like veins", ["white"], "veined"],
  ["QJ203", "Black Silk", "Black / fine white veining", ["black"], "veined"],
  ["QJ318", "Super White", "Pale grey / crackled mineral lines", ["white", "grey"], "marbled"],
  ["QJ319", "Sibberian Storm", "Pale grey / clouded mineral pattern", ["grey", "white"], "marbled"],
  ["QJ220", "Shangarilla", "Charcoal / clouded grey pattern", ["black", "grey"], "marbled"],
  ["QJ201GN", "Lyskamm", "Cool white / fine grain", ["white"], "speckled"],
  ["QJ207N", "Silver White", "Silver white / fine grain", ["white", "grey"], "speckled"],
  ["QJ210N", "Polar White", "White / fine mineral grain", ["white"], "speckled"],
  ["QJ204N", "Carrara Grey", "Soft blue grey / fine grain", ["grey"], "speckled"],
  ["QJ205N", "Carbon Grey", "Dark grey / fine grain", ["grey", "black"], "speckled"],
  ["QJ203N", "Turkish Black", "Black / fine grain", ["black"], "speckled"],
  ["QJ210NA", "Urban Grey", "Warm light grey / near solid", ["grey"], "solid"],
  ["QJ211S", "Moon Stone", "Pale grey white / near solid", ["white", "grey"], "solid"],
];

const premium: Row[] = [
  ["QJ100", "Ultra White", "Pure white / solid", ["white"], "solid"],
  ["QJ101", "Aqua", "White / pale aqua crystals", ["white", "green"], "crystal"],
  ["QJ101B", "Baritina", "Soft ivory / translucent crystals", ["white", "cream"], "crystal"],
  ["QJ101M", "Sparkle", "White / grey-green crystals", ["white"], "crystal"],
  ["QJ101R", "Cherry", "White / cherry red crystals", ["white", "red"], "crystal"],
  ["QJ103", "Iron Grey", "Mid grey / fine grain", ["grey"], "speckled"],
  ["QJ109", "Vanilla", "Warm white / fine crystals", ["white", "cream"], "crystal"],
  ["QJ109S", "Iceland", "Bright white / fine crystals", ["white"], "crystal"],
  ["QJ113", "Onix Black", "Black / dark crystals", ["black"], "crystal"],
  ["QJ113L", "Core Black", "Black / dark crystals and flecks", ["black"], "crystal"],
  ["QJ114", "New York", "Black / starlike flecks", ["black"], "speckled"],
  ["QJ131", "Rome", "Warm cream / amber flecks", ["cream"], "crystal"],
  ["QJ214", "Earth", "Deep brown / mixed mineral crystals", ["brown"], "crystal"],
  ["QJ215", "Sakura", "White, oxblood and pink / bold crystals", ["red", "brown"], "crystal"],
  ["QJ216", "Garnet", "Brown / gold mineral crystals", ["brown"], "crystal"],
  ["QJ501", "Arizona", "Sand / fine stone crystals", ["cream"], "crystal"],
  ["QJ502", "Casentino", "Warm beige / stone crystals", ["cream"], "crystal"],
  ["QJ503", "Crisocola", "Pale sea green / translucent crystals", ["white", "green"], "crystal"],
  ["QJ504", "Jupiter", "Beige / caramel crystals", ["cream", "brown"], "crystal"],
  ["QJ505", "Siderita", "Sand / dark blue-black crystals", ["cream", "brown"], "crystal"],
];

const designers: Row[] = [
  ["QJ801", "Bermuda", "Sea green / flowing marble", ["green"], "marbled"],
  ["QJ801C", "Sapphire", "Turquoise / luminous crystals", ["blue", "green"], "crystal"],
  ["QJ802", "Sunrise", "Vivid orange / flowing marble", ["yellow", "red"], "marbled"],
  ["QJ802C", "Lava", "Amber orange / luminous crystals", ["yellow", "red"], "crystal"],
  ["QJ803", "Safari", "Yellow green / flowing marble", ["yellow", "green"], "marbled"],
  ["QJ803C", "Tourmaline", "Golden yellow / luminous crystals", ["yellow"], "crystal"],
];

const baseApplications = ["kitchen", "bathroom", "tables"];
const extraApplications: Record<CollectionId, string[]> = { nature: ["walls"], premium: ["floors"], designers: ["walls", "pools"] };

const toProduct = (collection: CollectionId) => ([code, name, tone, colours, pattern, description]: Row): Product => ({
  code, name, collection, tone, colours, pattern,
  slug: `${code}-${name}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  description: description ?? `${tone.replace(" / ", ", ")}. Part of the QJ ${collection[0].toUpperCase()}${collection.slice(1)} Collection.`,
  finishes: ["polished"], thicknesses: [12, 20, 30], slabSizes: ["standard", "custom"],
  applications: [...baseApplications, ...extraApplications[collection]],
  swatch: `/images/surfaces/${code.toLowerCase()}.webp`,
});

export const allProducts: Product[] = [...nature.map(toProduct("nature")), ...premium.map(toProduct("premium")), ...designers.map(toProduct("designers"))];
