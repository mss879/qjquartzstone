# QJ Quartz Stone

Front-end demo of the new QJ website (Project 1 in the proposal), built with Next.js 16, React 19, Tailwind CSS 4 and three.js. There is no backend: content is static, and forms validate and confirm without sending anything.

## Develop

Run `npm install`, then `npm run dev`. Open http://localhost:3000.

## Verify

- `npm run lint`
- `npm test`
- `npm run build`

The build uses Webpack and Tailwind's PostCSS integration. Fonts use the system sans-serif stack, so builds do not fetch external fonts.

## What the demo covers

| Proposal feature | Where | Demo behaviour |
| --- | --- | --- |
| Searchable collections and filters | `/collections` | All 50 surfaces; filtered views are shareable URLs |
| Product pages | `/collections/[slug]` | Full slab, close-ups, live room render, specifications, downloads |
| Favourites, compare, shortlists | `/shortlist`, `/compare` | Saved in the browser; share links carry the list itself |
| Sample and consultation requests | `/samples`, `/consultation`, `/contact` | Validate, carry the shortlist, show a labelled demo confirmation |
| Room visualiser | `/visualiser` | Real-time 3D rooms, and an on-device photo tool using four marked corners |
| Resources by audience | `/resources` | Real PDFs and a texture library, plus QJ's published test data |
| Care, warranty, FAQ, after-sales | `/support/[topic]` | Published facts, with unapproved wording labelled as draft |
| Manufacturing and export | `/manufacturing` | QJ's published process, with a distributor form |
| Language by visitor location | `src/proxy.ts`, `src/dictionaries` | English, Sinhala, Tamil, Traditional Chinese; choice remembered |
| Blog and completed projects | `/journal`, `/projects` | Filterable; every project is labelled as a sample entry |

Not built, by decision: CMS, inquiries inbox, database, email notifications, AI rendering on uploaded photos, sitemap, analytics and redirects. These follow once the project is commissioned.

Preview a country locally with `/?country=TW` (a remembered language choice takes priority; clear the `qj_lang` cookie to retest).

## Design and assets

The site follows an editorial white/charcoal/clay palette and a continuous raw-quartz → slab → interior scroll sequence on the homepage. Inner pages live in `src/app/site.css` and reuse the same tokens. Phones and portrait tablets through 900px use a shorter, reversible pinned sequence; reduced-motion layouts provide a static composition. Main mobile paragraphs are 16px and key controls have at least 44px touch targets.

The homepage keeps its generated images, each with one placement (see `AGENTS.md`). Inner pages use no generated images: surfaces are QJ's official swatches with the caption strip cropped off (`public/images/surfaces`, `public/textures`), and photographs come from the archived old site (`public/images/archive`). Product names and codes are exactly as printed on those swatches, including their spellings.

Company content, specifications and test data are from qjquartzstone.com (read from the Wayback Machine, as the live site returned HTTP 500 in October 2026). Colour, pattern and application tags are demo values for QJ to confirm. Translations are machine drafts for QJ to approve. Generated interiors and 3D rooms are illustrative, not installed client projects, and do not replace a physical sample.

After changing the catalogue, regenerate the PDFs and texture library with `node scripts/generate-downloads.mjs`.
