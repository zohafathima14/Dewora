# Product Requirements Document (PRD)
## Dewora — Beauty & Skincare E-commerce Website

**Version:** 1.0  
**Status:** Build specification  
**Product type:** Frontend-only e-commerce demonstration  
**Technology constraint:** HTML, CSS, vanilla JavaScript only

---

## 1. Product overview

Dewora is a responsive beauty and skincare storefront where visitors can discover products, explore skincare categories, view product details, add items to a cart or wishlist, and complete a simulated checkout flow.

The experience should feel polished, youthful, trustworthy, image-led, and easy to navigate. It takes broad inspiration from modern Indian D2C skincare storefronts such as Aqualogica, while using original brand identity, copy, layouts, and demo product data.

### Brand identity
- **Name:** Dewora
- **Tagline:** Everyday care. Naturally you.
- **Personality:** Fresh, optimistic, inclusive, uncomplicated, modern.
- **Audience:** Skincare beginners and beauty shoppers, primarily ages 18–35.
- **Market context:** India; display prices in INR (₹).

## 2. Problem statement

Beauty shoppers need a clear and visually engaging way to discover products by category, skin concern, and routine. Dewora demonstrates this journey without requiring a backend or database.

## 3. Goals

1. Deliver a complete multi-page-feeling storefront using static frontend files.
2. Make product discovery intuitive through categories, search, sorting, and filters.
3. Demonstrate core shopping interactions: product detail, cart, wishlist, and checkout.
4. Maintain a consistent visual system across desktop, tablet, and mobile.
5. Ensure all visible controls have meaningful behavior.
6. Keep the project easy to run, inspect, and modify in Antigravity.

## 4. Non-goals and scope boundaries

The following are explicitly out of scope:
- Backend development or DBMS integration.
- Real user accounts, registration, or authentication.
- Real payment gateway or payment collection.
- Actual order placement, fulfilment, shipping, or tracking.
- Real inventory synchronization.
- Admin dashboard or product management portal.
- Real customer review submission.
- External CRM, analytics, or marketing integrations.
- Medical diagnosis, personalized medical advice, or guaranteed skincare outcomes.

Checkout is a **demo flow only**. Clearly label the final confirmation as a simulated order. Never ask for card numbers, UPI PINs, passwords, or other sensitive payment credentials.

## 5. Target users and user stories

### Persona A — First-time skincare shopper
Wants to browse by concern and understand what a product is for.
- As a visitor, I want to browse skincare categories.
- As a visitor, I want concise product descriptions and ingredient highlights.
- As a visitor, I want to filter products by skin type and concern.

### Persona B — Returning shopper
Wants to quickly find and revisit products.
- As a shopper, I want to search by product name or category.
- As a shopper, I want to save products to a wishlist.
- As a shopper, I want my demo cart to remain after refreshing the page.

### Persona C — Mobile shopper
Wants a usable experience on a phone.
- As a mobile visitor, I want navigation and filters that work on small screens.
- As a mobile visitor, I want clear product imagery, readable text, and large tap targets.

## 6. Information architecture

### Primary navigation
- Home
- Shop All
- Skincare
- Sunscreen
- Moisturizers
- Cleansers
- Serums
- Body Care
- About Dewora
- Search
- Wishlist
- Cart

### Footer navigation
- About Us
- Contact
- FAQs
- Shipping & Returns (informational demo page)
- Privacy Policy (demo notice)
- Terms & Conditions (demo notice)
- Social links (non-functional placeholders or safe external brand links only if configured)

## 7. Required pages and sections

### 7.1 Home page (`index.html`)
1. Announcement strip: promotional message, e.g. “A little glow goes a long way.”
2. Header: logo, navigation, search, wishlist, cart count.
3. Hero section: strong campaign image, headline, supporting copy, primary CTA.
4. Shop by category: category image tiles.
5. Bestsellers: product cards with price, rating (demo), badge, and Add to Cart.
6. Shop by concern: hydration, dullness, sun care, barrier care, body care.
7. Brand value proposition: simple, transparent, everyday skincare.
8. Routine/featured collection banner.
9. Testimonials: clearly identified as sample/demo testimonials.
10. Newsletter visual form: frontend-only validation and success message; do not transmit or store email.
11. Footer with navigation and demo legal notices.

### 7.2 Shop page (`shop.html`)
- Page title and product count.
- Category filter.
- Skin type filter.
- Concern filter.
- Price range filter.
- Sort: featured, price low-to-high, price high-to-low, rating.
- Product grid.
- Clear all filters.
- Empty state when no products match.
- Search query support through URL query parameters.

### 7.3 Product detail page (`product.html`)
- Product image gallery (at least primary image and optional thumbnails).
- Product name, category, demo rating, price, optional compare-at price.
- Short description.
- Size/variant selector where relevant.
- Quantity selector.
- Add to Cart.
- Add/remove Wishlist.
- Key benefits.
- Ingredient highlights.
- How to use.
- Suitable skin types and concerns.
- Safety note: patch test; discontinue if irritation occurs.
- Related products.
- Breadcrumb navigation.

Product detail must load the correct product based on a safe product ID query parameter. If the ID is missing or invalid, show a helpful not-found state and a link to Shop All.

### 7.4 Cart page (`cart.html`)
- Cart line items with image, name, variant, unit price, quantity controls, remove action.
- Subtotal.
- Demo shipping line (free above a clearly stated threshold; otherwise a fixed demo charge).
- Demo discount field with one or two predefined sample codes, or omit discount if it adds complexity.
- Total.
- Continue shopping.
- Proceed to demo checkout.
- Empty cart state.

### 7.5 Checkout page (`checkout.html`)
- Order summary.
- Frontend-only form for name, email, phone, and delivery address.
- Client-side required-field and format validation.
- No payment fields and no real submission.
- Submit button labelled “Place demo order”.
- Confirmation state with generated local demo order reference.
- Explicit note: “This is a frontend demonstration. No payment was taken and no order was sent.”

### 7.6 Wishlist page (`wishlist.html`)
- Saved product cards.
- Remove from wishlist.
- Add to cart.
- Empty state with Shop CTA.

### 7.7 About page (`about.html`)
- Brand story.
- Values: simple routines, clear information, inclusive beauty.
- Editorial imagery.
- No unsupported claims about clinical testing, certifications, or sustainability.

### 7.8 FAQ page (`faq.html`)
- Expand/collapse questions using accessible buttons.
- Questions about browsing, cart persistence, demo checkout, product use, and project limitations.
- Make clear that Dewora is a demo storefront.

## 8. Core functional requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-01 | Render responsive home page | Must |
| FR-02 | Display products from a JavaScript data array | Must |
| FR-03 | Navigate between all required pages | Must |
| FR-04 | Search products by name, category, and keywords | Must |
| FR-05 | Filter by category, skin type, concern, and price | Must |
| FR-06 | Sort product listings | Must |
| FR-07 | Open correct product detail from product card | Must |
| FR-08 | Add, update quantity, and remove cart items | Must |
| FR-09 | Persist cart in localStorage | Must |
| FR-10 | Add/remove wishlist items and persist them | Must |
| FR-11 | Validate demo checkout form | Must |
| FR-12 | Show simulated order confirmation | Must |
| FR-13 | Show toast feedback for key actions | Should |
| FR-14 | Mobile navigation menu | Must |
| FR-15 | Accessible FAQ accordion | Should |
| FR-16 | Newsletter demo validation with no data transmission | Could |

## 9. Product content requirements

Seed the storefront with at least 12 fictional products across:
- Sunscreen
- Cleanser
- Moisturizer
- Serum
- Toner
- Lip care
- Body care

Each product object should include:
- `id`
- `name`
- `category`
- `price`
- `compareAtPrice` (optional)
- `size`
- `shortDescription`
- `description`
- `image`
- `gallery` (optional array)
- `skinTypes` (array)
- `concerns` (array)
- `ingredients` (array)
- `benefits` (array)
- `howToUse`
- `rating` (demo value)
- `reviewCount` (demo value)
- `badge` (optional)
- `featured` (boolean)

All product names, reviews, ratings, prices, and claims are fictional demo content. Avoid copying Aqualogica product names or claims. Do not imply that demo product ratings are verified.

## 10. UX requirements

- A visitor should understand what Dewora sells within five seconds.
- Main shopping CTA should be visible above the fold.
- Product cards should show image, name, price, and an obvious action.
- Cart count should update immediately.
- Empty states should explain what happened and provide a next step.
- Forms should show inline errors and success feedback.
- Navigation should be consistent across pages.
- Provide visible keyboard focus.
- Do not use alert boxes for routine interactions; use inline messages or toast notifications.
- Avoid dead buttons and placeholder links that appear functional.

## 11. Non-functional requirements

### Performance
- Keep JavaScript modular and lightweight.
- Optimize images and use responsive image sizing where possible.
- Avoid unnecessary animation and layout shifts.
- Lazy-load below-the-fold product images.

### Accessibility
- Semantic HTML landmarks.
- Labels for all form fields.
- Descriptive alt text.
- Keyboard-accessible menus, dialogs, and accordions.
- Sufficient text contrast.
- Respect `prefers-reduced-motion`.

### Compatibility
- Current versions of Chrome, Edge, Firefox, and Safari.
- Desktop, tablet, and mobile widths.
- No dependency on a backend or build step.

### Privacy
- Do not transmit data to external services.
- Do not collect payment credentials.
- `localStorage` may store demo cart and wishlist only.
- Newsletter form must not send or retain submitted email.

## 12. Acceptance criteria

The project is accepted when:
1. Every required page loads without console errors.
2. Navigation links lead to valid pages.
3. All product cards are populated from the shared product data.
4. Search, filter, sort, and clear-filter behavior work together.
5. Product detail page loads the selected product by ID.
6. Cart supports add, remove, increment, decrement, and persistence after refresh.
7. Wishlist supports add, remove, and persistence after refresh.
8. Cart subtotal and total recalculate correctly.
9. Checkout validates fields and shows a demo confirmation only.
10. No real payment, backend request, database, or external form submission exists.
11. Layout is usable at 375px, 768px, 1024px, and 1440px widths.
12. Keyboard focus is visible and primary interactions are keyboard operable.
13. No visible control is knowingly inert.
14. README explains how to run the site and its demo-only limitations.

## 13. Suggested delivery phases

1. Foundation: project structure, tokens, shared header/footer.
2. Content: product dataset and image assets.
3. Discovery: home, shop, search, filters, sorting.
4. Shopping: product details, cart, wishlist.
5. Checkout: validation and simulated confirmation.
6. Polish: responsive layout, accessibility, empty/error states.
7. QA: test every acceptance criterion and fix defects.
