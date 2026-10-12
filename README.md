# QJ Quartz Stone

A white editorial homepage built with Next.js 16, React 19 and Tailwind CSS 4.

## Develop

Run `npm install`, then `npm run dev`. Open http://localhost:3000.

## Verify

- `npm run lint`
- `npm test`
- `npm run build`

The build uses Webpack and Tailwind's PostCSS integration. Fonts use the system sans-serif stack, so builds do not fetch external fonts.

## Design and assets

The homepage follows an editorial white/charcoal/clay palette, five real QJ surfaces, and a continuous raw-quartz → slab → interior scroll sequence. Phones and portrait tablets through 900px use a shorter, reversible pinned sequence; short landscape screens place the visual and caption side by side. Reduced-motion layouts provide a static material/interior composition. Main mobile paragraphs are 16px and key controls have at least 44px touch targets. Responsive checks and interaction results are in `docs/mobile-verification.md`.

Every generated visual has a unique placement. Do not recycle generated images between sections or use slab renders for sample thumbnails. This project rule is recorded in `AGENTS.md`.

Company content, logo and original swatches are sourced from https://qjquartzstone.com. Products: QJ711 Bianco Calacatta, QJ707N Statuario, QJ712 Pietra Grey, QJ905 Marble Grey, QJ227 Breeze.

Generated assets are stored as optimized WebP files in `public/images`. Original manufacturer swatches are retained in `public/images/references` and displayed in the product-details dialog. Generated interior imagery is illustrative concept work, not a claim of completed QJ projects. The renders do not replace a physical product sample for specification.

Generation prompts and content sources are saved in `docs/image-generation.json` and `docs/unique-asset-prompts.json`. Design and implementation notes are in `docs/homepage-design.md` and `docs/homepage-plan.md`.

Sample requests open an email with the selected product code. Contact actions link to QJ's published phone numbers and email address. No messages are sent automatically.
