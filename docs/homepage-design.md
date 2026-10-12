# QJ Quartz Stone homepage

The homepage is a product-focused, white interpretation of the supplied editorial reference. Preserve oversized staggered typography, asymmetric composition, quiet side labels, generous whitespace and thin rules. Warm white, ink and restrained clay form the palette. The visitor should discover QJ's materials, understand how a surface becomes an interior, and inquire about a selected finish.

## Content and visual integrity

Use the official QJ logo and product codes. Company information comes from qjquartzstone.com: Queens Ceramic Inc (Taiwan) and Jaysons Holdings (Sri Lanka); vertically integrated sourcing, slab production, polishing and installation; 3200 × 1600 mm standard slabs in 12, 20 and 30 mm thicknesses. Do not invent clients, installed projects, certifications or current operational statistics. Five selected products: QJ711 Bianco Calacatta, QJ707N Statuario, QJ712 Pietra Grey, QJ905 Marble Grey, QJ227 Breeze. Each generated asset has exactly one visual placement. Generated slab and interior imagery is a visualization based on official samples, not a color-accurate substitute for a physical sample or a real project photograph. Keep official swatches in the product detail view.

## Sequence

1. Editorial hero: expressive quartz sculpture and staggered headline, with clear collection and inquiry links.
2. About: concise partnership and end-to-end material story, asymmetrical interior and surface imagery.
3. Scroll narrative: one pinned scene progresses continuously and reversibly from raw quartz crystal, to slab surface and thickness, to the same material in a kitchen. Four meaningful states: inspiration, surface, detail, space. Text and image transitions share scroll progress. No forced scrolling. Reduced motion renders a normal static material/interior layout, with no scroll trap.
4. Product collection: large selectable 3D slab visualization, five real finish selectors, adjustable viewing angle, dimensions and sample request; product detail dialog includes the original manufacturer swatch.
5. Applications: kitchen and bathroom concepts with useful application information, selectable application rows and real CTAs.
6. Craft: factual production steps and technical surface details, linked to original specifications.
7. Inquiry and footer: real Sri Lankan/Taiwan contact details, email and phone links.

## Implementation and accessibility

Next.js 16 / React 19 / Tailwind 4. Small client components for navigation, story, products, dialogs and application selection. Native browser scroll, requestAnimationFrame and transforms; no animation framework needed. Resize and motion preference changes refresh the story. Progress uses the measured sticky-stage height to keep mobile browser chrome from changing the timeline. Images use local optimized assets with reserved sizes. Keyboard-accessible links, focus-visible styles, native dialog focus management and range control, accessible menu and application state. Mobile uses a shorter 240svh story with a 100svh sticky stage; reduced motion uses a static composition. Short landscape screens use side-by-side art and captions. No fake form submissions.

## Validation

Unit-check narrative boundaries, backward scrubbing, finite outputs and small-viewport fallback. Run lint, TypeScript and production build. Inspect desktop/mobile rendering and test selectors, dialog, range, navigation, anchors and reduced motion in a browser when the environment permits.
