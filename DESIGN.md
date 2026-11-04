# Design System & UI Specification
## Dewora — Everyday care. Naturally you.

**Design direction:** Fresh, premium-accessible, editorial skincare storefront  
**Reference inspiration:** Modern D2C beauty commerce; do not reproduce another brand's exact layout, copy, logo, or imagery.

---

## 1. Visual concept

Dewora should feel like a bright skincare studio: soft warm neutrals, gentle botanical colors, confident typography, clean product photography, and generous spacing.

Avoid:
- Generic dashboard UI.
- Excessive gradients and glassmorphism.
- Overly rounded cards everywhere.
- Dense text and cramped product grids.
- Copying Aqualogica's logo, exact color palette, text, campaign artwork, or page composition.

## 2. Color palette

Use CSS custom properties.

```css
:root {
  --color-cream: #FFF9F3;
  --color-paper: #FFFFFF;
  --color-ink: #252923;
  --color-muted: #74776F;
  --color-sage: #DCE8D8;
  --color-sage-deep: #526B54;
  --color-peach: #F4C7B5;
  --color-blush: #F6E4DE;
  --color-lemon: #F2E9B9;
  --color-line: #E9E3DC;
  --color-sale: #A84C3E;
  --color-success: #426B50;
}
```

Guidelines:
- Cream is the primary page background.
- White is used for product surfaces and content panels.
- Deep ink is used for primary text.
- Sage is the primary accent.
- Peach and blush are secondary campaign accents.
- Use sale red sparingly for discount labels only.
- Maintain accessible contrast for text and buttons.

## 3. Typography

Recommended pairing:
- Headings: `DM Serif Display` or `Playfair Display`.
- Body/UI: `DM Sans` or `Inter`.
- Fallback: Georgia for editorial headings; Arial/system sans-serif for UI.

Type scale:
- Hero heading: clamp(2.5rem, 6vw, 5.5rem)
- Page heading: clamp(2rem, 4vw, 3.5rem)
- Section heading: clamp(1.6rem, 3vw, 2.4rem)
- Card title: 1rem–1.125rem
- Body: 0.95rem–1.05rem
- Caption: 0.78rem–0.875rem

Use comfortable line-height and avoid long all-caps text.

## 4. Layout and spacing

- Maximum content width: 1280px.
- Standard page gutters: 24px desktop, 18px tablet, 16px mobile.
- Section vertical spacing: 72–104px desktop, 48–64px mobile.
- Product grid gap: 20–28px desktop, 12–16px mobile.
- Use consistent alignment and a clear content hierarchy.
- Use subtle borders instead of heavy shadows.
- Buttons may have modest rounded corners (8–12px).
- Product image frames should use a consistent aspect ratio (prefer 4:5).

## 5. Header and navigation

### Announcement bar
- Slim horizontal strip at top.
- Muted sage or deep green background.
- Short promotional message centered.
- Do not make unsupported urgency claims.

### Main header
- Dewora wordmark at left.
- Center navigation on desktop.
- Search, wishlist, and cart icons/actions at right.
- Cart count badge updates dynamically.
- Sticky header is optional; if used, keep it compact.

### Mobile header
- Menu button, logo, search/cart actions.
- Slide-down or side-drawer navigation.
- Clear close button and keyboard support.

## 6. Home page composition

### Hero
- Large editorial campaign area with text and product/lifestyle image.
- Example headline: “Your everyday glow, made simple.”
- Supporting line: “Thoughtful skincare essentials for the rituals that feel like you.”
- Primary CTA: “Shop the collection”.
- Secondary CTA: “Find your routine”.
- Use one strong image, not a cluttered collage.
- Text must remain readable on all breakpoints.

### Category tiles
- 4–6 tiles with distinct imagery.
- Suggested labels: Cleanse, Hydrate, Protect, Treat, Body Care.
- Each tile links to a filtered shop page.
- Use a subtle image zoom on hover; disable/reduce motion when requested.

### Bestsellers
- 4 products desktop, 2 mobile.
- Product image, optional badge, wishlist toggle, product name, rating (demo), price, compare-at price, Add to Cart.
- Keep card heights visually consistent.

### Concern section
- Soft background panel with concern cards:
  - Dryness & dehydration
  - Dull-looking skin
  - Everyday sun care
  - Skin barrier care
- Use neutral, supportive language; do not promise treatment or cure.

### Brand values
- Three short value pillars:
  - Simple routines
  - Thoughtful ingredients
  - Everyday confidence
- Avoid unsupported certifications or clinical claims.

### Editorial feature
- Asymmetric image/text split.
- Example copy: “A little ritual. A lot more you.”
- CTA to About or featured collection.

### Testimonials
- Use clearly marked sample testimonials for demo purposes.
- Do not fabricate real customer identities or imply verified reviews.

### Newsletter
- Visually simple.
- Email input and “Join the list” button.
- Show local success state only; never submit or retain email.

## 7. Product cards

Each card contains:
1. Product image with consistent 4:5 crop.
2. Optional badge.
3. Wishlist toggle button.
4. Product title.
5. Short descriptor or size.
6. Demo star rating.
7. Current price and optional compare-at price.
8. Add to Cart button.

Hover state:
- Slight image scale or border change.
- Reveal secondary action only if it remains discoverable on touch devices.
- Avoid large motion.

## 8. Shop page

- Breadcrumb and page heading.
- Short intro.
- Filter sidebar on desktop.
- Filter drawer/collapsible section on mobile.
- Sort control aligned with product count.
- Responsive grid.
- Active filter chips and clear-all action.
- Friendly no-results state with reset action.

## 9. Product detail page

Desktop:
- Two-column layout: image gallery on left, product information on right.
- Sticky product information is optional; avoid excessive scrolling constraints.

Mobile:
- Image first, product details below.
- Add-to-cart action should remain easy to reach.

Content hierarchy:
- Breadcrumb
- Product title
- Rating marked as demo
- Price
- Description
- Variant/size
- Quantity
- Add to Cart
- Wishlist
- Benefits
- Ingredients
- How to use
- Safety note
- Related products

## 10. Cart and checkout

### Cart
- Clear line-item rows.
- Quantity stepper with accessible labels.
- Summary panel with subtotal, demo shipping, discount, total.
- Primary checkout CTA.
- Empty cart illustration or image with Shop CTA.

### Checkout
- Calm, distraction-free layout.
- Form fields in a single readable column.
- Order summary beside form on desktop and below form on mobile.
- Clear “Demo checkout” notice near the submit action.
- Confirmation should not resemble a real payment receipt.

## 11. Buttons and interaction states

Primary button:
- Deep sage background, white text.
- Hover: slightly darker.
- Focus: visible outline.
- Disabled: muted background and clear disabled state.

Secondary button:
- Transparent or cream background with sage border.
- Hover: pale sage fill.

Text link:
- Underline on hover or clear visual affordance.

Inputs:
- White background.
- Neutral border.
- Sage focus ring.
- Inline error text below field.

Toast:
- Compact bottom-right desktop; bottom-center mobile.
- High contrast.
- Auto-dismiss only after a reasonable delay.
- Use `aria-live`.

## 12. Iconography

Use one consistent simple line-icon style. Inline SVG icons are acceptable if authored locally. Keep icons decorative when adjacent text already conveys the action; otherwise provide accessible labels.

Required icons:
- Search
- Menu
- Close
- Heart
- Shopping bag/cart
- User (do not imply real account login)
- Chevron
- Plus/minus
- Trash/remove

Do not use emoji as the primary interface icon set.

## 13. Imagery and asset direction

- Product pack shots: clean bottles, tubes, jars on warm neutral backgrounds.
- Lifestyle: natural daylight, towels, water, botanical details, skincare rituals.
- Category imagery: distinct visual cues per category.
- Use original, licensed, or appropriately permitted images.
- Do not hotlink images from Aqualogica or copy its campaign photography.
- If temporary remote images are used during development, replace them with local assets before final delivery.
- Add descriptive alt text.
- Use `object-fit: cover` for editorial images and `contain` for isolated product pack shots.

## 14. Responsive behavior

### Mobile (≤599px)
- Two-column product grid.
- Compact header and collapsible navigation.
- Hero stacks image and copy.
- Filters use drawer/collapse.
- Cart rows become compact cards.
- Checkout order summary moves below form.

### Tablet (600–899px)
- Two or three product columns depending on width.
- Simplified desktop navigation or menu.
- Balanced hero split.

### Desktop (≥900px)
- Full navigation.
- Three/four product columns.
- Shop filters visible in sidebar.
- Product detail two-column layout.

## 15. Motion

- Use short transitions (150–250ms).
- Subtle hover and menu transitions only.
- Avoid scroll-jacking, autoplay video, and excessive parallax.
- Respect `prefers-reduced-motion: reduce`.

## 16. Design QA checklist

- [ ] Consistent spacing and typography.
- [ ] Product image ratios are consistent.
- [ ] Text contrast is readable.
- [ ] Buttons have hover, focus, active, and disabled states.
- [ ] Mobile navigation is usable.
- [ ] No horizontal overflow.
- [ ] Empty states are designed.
- [ ] Forms show validation clearly.
- [ ] All page headers and footers are consistent.
- [ ] Demo ratings and testimonials are labelled honestly.
- [ ] No copied Aqualogica branding or assets.
