// Builds the public PDFs and texture library. Run after catalogue or copy changes: node scripts/generate-downloads.mjs
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { createSheet } from "../src/lib/pdf.ts";
import { allProducts } from "../src/lib/data/products.ts";
import { qualityHighlights, technicalData } from "../src/lib/specs.ts";

const root = path.resolve(import.meta.dirname, "..");
const output = path.join(root, "public/downloads");
mkdirSync(path.join(output, "spec-sheets"), { recursive: true });
const write = async (name, sheet) => writeFileSync(path.join(output, name), await sheet.save());

for (const product of allProducts) {
  const sheet = await createSheet(`${product.code} / ${product.collection} collection`, product.name);
  await sheet.image(new Uint8Array(readFileSync(path.join(root, "public/textures", `${product.code.toLowerCase()}.jpg`))), 260);
  sheet.text(product.description);
  sheet.heading("Specification");
  sheet.rows([
    ["Code", product.code], ["Tone", product.tone], ["Material", "Engineered quartz"], ["Finish", product.finishes.join(", ")],
    ["Standard slab", "3200 x 1600 mm"], ["Thickness", `${product.thicknesses.join(" / ")} mm`], ["Cut to size", "20 and 30 mm"], ["Manufacturer's guarantee", "10 years"],
  ], [190, 305]);
  sheet.heading("Key technical data");
  sheet.rows(qualityHighlights.map(([value, label, standard]) => [label, standard, value]), [240, 150, 105]);
  sheet.text("Natural variation, lighting and screen settings affect appearance; request a physical sample before specifying.", { size: 8 });
  await write(`spec-sheets/${product.code.toLowerCase()}.pdf`, sheet);
}

const overview = await createSheet("Collection overview", "Fifty surfaces. Three collections.");
overview.text("QJ Quartz Stone is a collaboration between Queens Ceramic Inc, Taiwan and Jaysons Holdings (Pvt) Ltd, Sri Lanka. Standard slabs measure 3200 x 1600 mm in 12, 20 and 30 mm thicknesses.");
for (const [id, title] of [["nature", "Nature Collection"], ["premium", "Premium Collection"], ["designers", "Designers Collection"]]) {
  overview.heading(title);
  const tiles = await Promise.all(allProducts.filter(product => product.collection === id).map(async product => ({
    caption: `${product.code} ${product.name}`,
    bytes: new Uint8Array(await sharp(path.join(root, "public/textures", `${product.code.toLowerCase()}.jpg`)).resize(220, 220).jpeg({ quality: 80 }).toBuffer()),
  })));
  await overview.tiles(tiles);
}
await write("qj-collection-overview.pdf", overview);

const technical = await createSheet("Technical data", "QJ quartz surface specifications");
technical.heading("Slab sizes");
technical.rows([["Standard", "12 / 20 / 30 mm", "3200 x 1600 mm"], ["Customised", "20 / 30 mm", "Cut to designated size"]], [160, 170, 165]);
technical.heading("Test results");
technical.rows(technicalData, [255, 140, 100]);
await write("qj-technical-data.pdf", technical);

const care = await createSheet("Care guidance", "Caring for your QJ surface");
care.heading("From QJ");
care.bullets(["Everyday cleaning: wipe with mild soap and warm water.", "QJ quartz requires no sealing when cut, and no conditioning or polishing.", "QJ surfaces are heat and stain resistant.", "QJ stones contain anti-bacterial enhancements."]);
care.heading("Good habits (draft for QJ approval)");
care.bullets(["Wipe up spills promptly rather than letting them dry.", "Use trivets and hot pads under pans straight from the stove or oven.", "Use a chopping board rather than cutting directly on the surface.", "Avoid harsh chemicals such as paint removers, oven cleaners and bleach."]);
care.heading("Guarantee");
care.text("QJ products come with a 10 year manufacturer's guarantee.");
await write("qj-care-guide.pdf", care);

const installation = await createSheet("Draft for QJ approval", "Fabrication and installation notes");
installation.text("This is a placeholder structure. QJ's approved fabrication and installation guidance replaces it before launch.", { color: undefined });
installation.heading("Material");
installation.bullets(["Standard slabs: 3200 x 1600 mm.", "Standard thickness: 12, 20 and 30 mm.", "20 and 30 mm can be cut to a designated size."]);
installation.heading("Sections for QJ to complete");
installation.bullets(["Slab storage and handling", "Cutting and edge profiles", "Cut-outs, joints and support", "Site preparation and installation sequence"]);
await write("qj-installation-notes.pdf", installation);

const archive = path.join(output, "qj-surface-textures.zip");
rmSync(archive, { force: true });
execFileSync("zip", ["-q", "-j", archive, ...allProducts.map(product => path.join(root, "public/textures", `${product.code.toLowerCase()}.jpg`))]);
console.log("Wrote", allProducts.length, "spec sheets, 4 PDFs and a", readFileSync(archive).length, "byte texture library to public/downloads");
