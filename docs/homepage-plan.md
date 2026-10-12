# Homepage implementation plan

**Goal:** A visual, product-focused QJ homepage based on the supplied white-theme direction.

**Architecture:** Static source-backed content with focused client components. The scroll narrative derives all visual states from one normalized progress value; the collection retains authentic product codes and swatches.

**Stack:** Next.js 16, React 19, Tailwind 4, native browser animation, built-in image generation.

**Design:** `docs/homepage-design.md`

## Work

- [x] Download official logo and five original material references; generate sculpture, five slab cutouts and five interior concepts and ten distinct replacement assets, optimize and save locally. Record source URLs and generation prompts.
- [x] Test and implement pure scroll-frame calculations in `src/lib/scroll-story.ts`; bind to a responsive, accessible pinned client scene in `src/components/material-story.tsx`.
- [x] Implement navigation, five-product collection with keyboard-selectable finishes, viewing-angle range control and original-swatch detail dialog; application selector with image/text transitions.
- [x] Compose the white editorial homepage in `src/app/page.tsx`, typography and responsive layouts in `src/app/globals.css`, metadata in `src/app/layout.tsx`. Configure standard Tailwind PostCSS and Webpack to avoid the environment's blocked Turbopack helper port.
- [x] Validate story tests, lint, TypeScript and production build; browser-check desktop, mobile, reduced motion and the interactive flows. Fix observed issues, retain an available local preview.

## Review focus

Backward/fast scroll must restore previous visual states. Mobile uses a shorter pinned scene with readable captions and landscape spacing. Reduced motion must keep text and material visible without pinning. Dialog close must restore focus. Product selection and sample request must preserve the selected code. Images must be clearly identified as visualizations without suggesting genuine installed projects.
