import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";

const ink = rgb(.149, .153, .133), muted = rgb(.4, .4, .37), clay = rgb(.604, .388, .298), line = rgb(.87, .87, .835);
const width = 595, height = 842, margin = 50;

// Standard PDF fonts cover Latin text only, so characters outside that set are spelled out.
const clean = (text: string) => text.replace(/⁻⁵/g, "-5").replace(/[^\x20-\x7E\xA0-\xFF–—‘’“”]/g, "");

/** A branded A4 sheet that flows text across pages. */
export async function createSheet(eyebrow: string, title: string) {
  const doc = await PDFDocument.create();
  doc.setTitle(`${title} | QJ Quartz Stone`);
  doc.setAuthor("QJ Quartz Stone");
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  let page: PDFPage;
  let y = 0;

  const addPage = () => {
    page = doc.addPage([width, height]);
    page.drawText("QJ QUARTZ STONE", { x: margin, y: height - 44, size: 9, font: bold, color: ink });
    page.drawText("info@qjquartzstone.com  |  +94 11 2 722 112", { x: margin, y: 30, size: 7.5, font: regular, color: muted });
    page.drawLine({ start: { x: margin, y: height - 54 }, end: { x: width - margin, y: height - 54 }, thickness: .5, color: line });
    y = height - 84;
  };
  const room = (needed: number) => { if (y - needed < 56) addPage(); };
  const wrap = (text: string, font: PDFFont, size: number, maxWidth: number) => {
    const lines: string[] = [];
    let current = "";
    for (const word of clean(text).split(/\s+/)) {
      const next = current ? `${current} ${word}` : word;
      if (font.widthOfTextAtSize(next, size) > maxWidth && current) { lines.push(current); current = word; } else current = next;
    }
    if (current) lines.push(current);
    return lines;
  };

  addPage();
  page!.drawText(clean(eyebrow).toUpperCase(), { x: margin, y, size: 8, font: regular, color: clay });
  y -= 34;
  for (const titleLine of wrap(title, regular, 27, width - margin * 2)) { page!.drawText(titleLine, { x: margin, y, size: 27, font: regular, color: ink }); y -= 31; }
  y -= 8;

  const sheet = {
    doc,
    heading(text: string) {
      room(44);
      y -= 12;
      page.drawText(clean(text), { x: margin, y, size: 12, font: bold, color: ink });
      y -= 20;
    },
    text(text: string, { size = 10, color = ink }: { size?: number; color?: typeof ink } = {}) {
      for (const textLine of wrap(text, regular, size, width - margin * 2)) {
        room(size + 6);
        page.drawText(textLine, { x: margin, y, size, font: regular, color });
        y -= size + 5;
      }
      y -= 6;
    },
    bullets(items: string[]) {
      for (const item of items) {
        const lines = wrap(item, regular, 10, width - margin * 2 - 14);
        lines.forEach((textLine, index) => {
          room(16);
          if (index === 0) page.drawText("-", { x: margin, y, size: 10, font: regular, color: clay });
          page.drawText(textLine, { x: margin + 14, y, size: 10, font: regular, color: ink });
          y -= 15;
        });
      }
      y -= 6;
    },
    rows(rows: readonly (readonly string[])[], columns: number[]) {
      for (const row of rows) {
        room(20);
        let x = margin;
        row.forEach((cell, index) => { page.drawText(clean(cell), { x, y, size: 9, font: regular, color: index === 0 ? ink : muted }); x += columns[index]; });
        y -= 8;
        page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: .4, color: line });
        y -= 12;
      }
      y -= 6;
    },
    async image(bytes: Uint8Array, targetHeight: number) {
      const image = await doc.embedJpg(bytes);
      const scaled = image.scale(Math.min((width - margin * 2) / image.width, targetHeight / image.height));
      room(scaled.height + 14);
      y -= scaled.height;
      page.drawImage(image, { x: margin, y, width: scaled.width, height: scaled.height });
      y -= 18;
    },
    /** A grid of small captioned images, used for the collection overview. */
    async tiles(items: { bytes: Uint8Array; caption: string }[], columns = 5) {
      const gap = 10, tile = (width - margin * 2 - gap * (columns - 1)) / columns;
      for (let i = 0; i < items.length; i += columns) {
        room(tile + 26);
        y -= tile;
        for (const [index, item] of items.slice(i, i + columns).entries()) {
          const image = await doc.embedJpg(item.bytes);
          const x = margin + index * (tile + gap);
          page.drawImage(image, { x, y, width: tile, height: tile });
          page.drawText(clean(item.caption).slice(0, 24), { x, y: y - 11, size: 6.5, font: regular, color: muted });
        }
        y -= 26;
      }
    },
    save: () => doc.save(),
  };
  return sheet;
}
