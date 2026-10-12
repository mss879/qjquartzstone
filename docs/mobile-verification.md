# Mobile verification

Verified on 12 October 2026 using the local homepage in the in-app browser.

## Responsive checks

Tested CSS viewport widths of 320, 375, 390, 430, 768, 900 and 1024 pixels. Results are recorded in `mobile-audit.json`.

- No horizontal page overflow or clipped heading text at the tested widths.
- Footer spans the viewport at every tested width; ARC AI credit remains visible.
- Phone and portrait-tablet layouts through 900px use 16px paragraph copy and a static slab/interior sequence.
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

Reduced-motion layouts were reviewed in source; a physical-device or OS-level reduced-motion test was not performed. These checks cover the tested browser/viewports, rather than claiming certification on every mobile device.

## Project checks

Run `npm run lint`, `npm test`, and `npm run build` before committing the final tree.
