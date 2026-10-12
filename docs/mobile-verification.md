# Mobile verification

Verified on 12 October 2026 using the local homepage in the in-app browser.

## Responsive checks

Tested CSS viewport widths of 320, 375, 390, 430, 768, 900 and 1024 pixels, plus 844 × 390px landscape. Results are recorded in `mobile-audit.json`.

- No horizontal page overflow or clipped heading text at the tested widths.
- Footer spans the viewport at every tested width; ARC AI credit remains visible.
- Phone and portrait-tablet layouts through 900px use 16px main paragraph copy and a 240svh reversible scroll sequence. Reduced-motion layouts retain the static slab/interior composition.
- Hero supporting copy sits beside the dark sculpture and clears the heading at every tested width. The collection CTA is right-aligned with a separate space for the scroll cue.
- Supporting copy was lowered by 24px on phone layouts and rechecked at 320 × 568px and 375 × 844px; it remains clear of both actions.
- Mobile scroll cue uses a single-line “Our story” label and a 36px circular arrow, inside a 46px touch target. Verified at 320px and 375px without wrapping or collision with the collection CTA. Desktop retains the original two-line tagline.
- Short landscape screens place story art and captions side by side, with a darker overlay behind the final caption.
- Main mobile controls have 44px or larger touch targets; finish selectors are 48px tall.
- The slab slider remains 44px tall at desktop/tablet widths as well.
- Muted text contrast is 5.50:1 against the paper background and 4.76:1 against the contact background.
- Image sizes match the rendered mobile layout, including separate tile and slab images.

## Interaction checks

- Mobile menu opens and its collection link navigates and closes the menu.
- Finish selection updates the slab, product code and sample email link.
- Product details open with the selected finish and original manufacturer swatch.
- At a 320 × 568px viewport, the dialog remains inside the screen and scrolls internally.
- Escape closes the dialog and returns focus to its trigger.
- Keyboard adjustment changes the slab viewing angle.
- Sample-card selection scrolls to the start of the selected slab view and retains its product code in the enquiry link.
- At 375 × 844px, native scrolling advances all four material-story chapters: crystal, slab, edge detail, then interior. The stage remains pinned, the slab changes rotation and scale, and the interior reaches full opacity.
- Reverse scrolling from the interior restores the slab chapter and hides the interior again. Captions and progress follow the same scroll position.

Current screenshots: `previews/mobile-hero-refined.png`, `previews/mobile-story-detail.png`, and `previews/mobile-story-space.png`.

Reduced-motion layouts were reviewed in source; a physical-device or OS-level reduced-motion test was not performed. These checks cover the tested browser/viewports, rather than claiming certification on every mobile device.

## Project checks

Run `npm run lint`, `npm test`, and `npm run build` before committing the final tree.
