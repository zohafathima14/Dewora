# Antigravity Master Build Prompt — Dewora

You are a senior frontend engineer, UI/UX designer, and QA engineer. Build the complete Dewora beauty and skincare e-commerce website in the currently open project folder.

## 1. Read the specifications first

Before writing code, read these files completely:
- `PRD.md`
- `TRD.md`
- `DESIGN.md`

Treat them as the source of truth. If a requirement conflicts with the project constraint below, the project constraint wins.

## 2. Non-negotiable project constraint

Use only:
- HTML
- CSS
- Vanilla JavaScript

Do not use:
- React, Vue, Angular, Svelte, Next.js, or any frontend framework.
- TypeScript, JSX, or a compilation pipeline.
- Backend, server-side code, API routes, or external APIs.
- DBMS, database, Firebase, Supabase, or authentication services.
- Real payment gateways or payment collection.

This is a static frontend-only project. It must run without a backend or database. Browser `localStorage` is permitted only for demo cart and wishlist persistence.

## 3. Product and brand direction

Brand: **Dewora**  
Tagline: **Everyday care. Naturally you.**

Create an original, premium-accessible skincare storefront. Use a warm cream, sage, peach, and blush palette with editorial typography and high-quality skincare imagery. It may take broad inspiration from modern D2C skincare shopping experiences, but do not copy Aqualogica's logo, exact layout, text, imagery, product names, or branding.

All product data, prices, ratings, reviews, promotions, and testimonials must be fictional demo content. Do not make medical or clinical claims.

## 4. Required pages

Build all pages:
1. `index.html` — homepage.
2. `shop.html` — product listing with search, filters, sorting.
3. `product.html` — product details loaded from query string ID.
4. `cart.html` — editable cart and price summary.
5. `checkout.html` — validated demo checkout and simulated confirmation.
6. `wishlist.html` — saved products.
7. `about.html` — brand story.
8. `faq.html` — accessible accordion.

Create shared header and footer components through reusable vanilla JavaScript functions or consistent markup. Keep the project structure from `TRD.md`.

## 5. Required product dataset

Create at least 12 fictional products across sunscreen, cleanser, moisturizer, serum, toner, lip care, and body care.

Use a single shared product dataset. Each product must have a stable unique ID and all fields described in `TRD.md`. Use INR numeric prices. Do not duplicate product data in individual pages.

Use attractive, licensed/appropriately permitted product images. Prefer local image assets in `assets/images/`. Do not download or hotlink Aqualogica images. If an image cannot be sourced, create a polished CSS placeholder with an appropriate color and product label rather than leaving a broken image.

## 6. Functional behavior — no dead controls

Implement and test all of the following:
- Responsive desktop and mobile navigation.
- Product category navigation.
- Search by product name, category, description, concerns, and ingredients.
- Combined category, skin type, concern, and price filters.
- Sorting by featured, price low-to-high, price high-to-low, and rating.
- Clear all filters.
- Product detail page by `?id=...`.
- Add to cart from home, shop, and product page.
- Cart quantity increase/decrease and remove.
- Correct subtotal, demo shipping, discount (if implemented), and total calculations.
- Wishlist add/remove and persistence.
- Header cart and wishlist counts update immediately.
- Checkout form client-side validation.
- Simulated order confirmation only.
- Toast feedback and useful empty/error states.
- FAQ accordion.
- Newsletter demo interaction with no network submission and no email persistence.

Use `localStorage` for cart and wishlist only. Validate parsed storage data and handle storage failures gracefully.

## 7. Checkout safety and honesty

This is not a real store. The checkout must:
- Clearly say “Demo checkout”.
- Never request card details, UPI PIN, passwords, or payment credentials.
- Never send form data to a server.
- Never save name, phone, email, or address in localStorage.
- On valid submission, show a simulated order reference and the statement:
  “This is a frontend demonstration. No payment was taken and no order was sent.”

## 8. Visual quality bar

Do not produce a bare template. The result should look like a polished D2C skincare brand:
- Strong hero section with campaign photography.
- Announcement strip and refined header.
- Clear category tiles.
- Bestselling product cards.
- Concern-based discovery section.
- Brand-value section.
- Editorial image/text feature.
- Sample testimonials clearly labelled as demo.
- Well-designed footer.
- Consistent spacing, typography, colors, image ratios, hover/focus states.
- Thoughtful empty states and responsive layouts.

Use CSS variables. Use semantic HTML. Use accessible labels, alt text, keyboard focus styles, and reduced-motion support. Use real buttons for actions and anchors for navigation.

## 9. Implementation sequence

Work in phases. Do not stop after producing a plan.

### Phase 1 — Foundation
- Inspect current project folder.
- Create the full folder structure.
- Add CSS design tokens and base styles.
- Implement shared header, footer, navigation, and toast.
- Create the product dataset.

### Phase 2 — Discovery experience
- Build home page.
- Build shop page.
- Implement product cards, search, filters, sorting, and query parameters.

### Phase 3 — Shopping experience
- Build product detail page.
- Build cart page.
- Build wishlist page.
- Implement localStorage utilities and all cart/wishlist behavior.

### Phase 4 — Demo checkout and content
- Build checkout validation and confirmation.
- Build About and FAQ pages.
- Add empty, error, and success states.

### Phase 5 — Responsive polish and QA
- Test at 375px, 768px, 1024px, and 1440px.
- Test every link and interactive control.
- Test cart/wishlist persistence after refresh.
- Test combined filters and sorting.
- Test invalid product ID.
- Test checkout invalid and valid submission.
- Check console for errors and network calls.
- Verify there is no backend, database, payment, or external form submission.
- Fix every defect found.

## 10. Code quality requirements

- Keep code readable and modular.
- Avoid one giant JavaScript file.
- Use descriptive function and variable names.
- Add comments only where logic is non-obvious.
- Do not use unsafe `innerHTML` with dynamic user input.
- Use `textContent` and DOM methods for dynamic content.
- Avoid inline event handlers in HTML.
- Avoid dead links and `href="#"` placeholders.
- Do not leave TODOs for required features.
- Do not claim a feature is complete unless it works.

## 11. Completion report

When finished, provide:
1. Implemented page list.
2. Main features completed.
3. How to run the project locally.
4. Any assets that still need replacement or licensing verification.
5. Test results for the acceptance criteria.
6. Explicit confirmation that the site is frontend-only and has no backend/database/payment integration.

Start by inspecting the project directory and reading all three specification documents. Then implement the actual website, not just a mockup or a plan.
