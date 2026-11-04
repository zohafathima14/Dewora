# Technical Requirements Document (TRD)
## Dewora — Frontend-only implementation

**Version:** 1.0  
**Architecture:** Static multi-page website  
**Allowed technologies:** HTML5, CSS3, vanilla JavaScript (ES6+)  
**Backend/database:** None

---

## 1. Technical architecture

Dewora is a static website. Each page is an HTML document, styled with shared CSS, and enhanced with browser-native JavaScript.

### Allowed
- HTML5
- CSS3 (Grid, Flexbox, custom properties, media queries)
- Vanilla JavaScript (ES6+)
- Browser APIs: `localStorage`, `URLSearchParams`, DOM APIs, `Intl.NumberFormat`
- Local image assets and/or carefully selected remote image URLs
- Google Fonts via CSS import if network availability is acceptable; provide fallback fonts

### Not allowed
- React, Vue, Angular, Svelte, Next.js, Nuxt, or other frameworks
- TypeScript or JSX
- Node.js application runtime or package-dependent build pipeline
- PHP, Python, Java, .NET, or any server-side code
- Firebase, Supabase, MongoDB, MySQL, PostgreSQL, or any DBMS
- Backend APIs, serverless functions, or authentication services
- Payment gateway integrations

## 2. Recommended project structure

```text
dewora/
├── index.html
├── shop.html
├── product.html
├── cart.html
├── checkout.html
├── wishlist.html
├── about.html
├── faq.html
├── README.md
├── assets/
│   ├── images/
│   │   ├── hero/
│   │   ├── products/
│   │   ├── categories/
│   │   └── editorial/
│   └── icons/
├── css/
│   ├── style.css
│   ├── components.css
│   └── responsive.css
└── js/
    ├── data/
    │   └── products.js
    ├── utils/
    │   ├── storage.js
    │   ├── currency.js
    │   └── dom.js
    ├── components/
    │   ├── header.js
    │   ├── footer.js
    │   ├── product-card.js
    │   ├── toast.js
    │   └── mobile-menu.js
    ├── pages/
    │   ├── home.js
    │   ├── shop.js
    │   ├── product.js
    │   ├── cart.js
    │   ├── checkout.js
    │   └── wishlist.js
    └── app.js
```

Use classic scripts with `defer` and a predictable load order, or native JavaScript modules. If using modules, ensure the site is run from a local static server rather than relying on `file://` behavior. Do not introduce a build step.

## 3. Shared data model

### Product schema

```js
{
  id: "dew-sun-001",
  name: "Daily Dew SPF 50 Sunscreen",
  category: "Sunscreen",
  price: 549,
  compareAtPrice: 649,
  size: "50 ml",
  shortDescription: "Lightweight daily sun-care demo product.",
  description: "A fictional product description for the Dewora demo store.",
  image: "assets/images/products/daily-dew-sunscreen.webp",
  gallery: [],
  skinTypes: ["All skin types"],
  concerns: ["Sun care"],
  ingredients: ["Niacinamide", "Aloe vera"],
  benefits: ["Lightweight feel", "Everyday routine"],
  howToUse: "Apply as directed in the fictional product demo copy.",
  rating: 4.7,
  reviewCount: 128,
  badge: "Bestseller",
  featured: true
}
```

Important:
- Store all prices as numbers in INR, not formatted strings.
- Use stable unique IDs.
- Treat rating and review count as demo-only values.
- Never render untrusted strings with `innerHTML`; use `textContent` or safe DOM construction.
- Validate product IDs before using them to access the data array.

### Cart schema

```js
[
  {
    productId: "dew-sun-001",
    quantity: 2
  }
]
```

### Wishlist schema

```js
["dew-sun-001", "dew-clean-002"]
```

## 4. Browser persistence

Use `localStorage` for demo cart and wishlist persistence only.

Suggested keys:
- `dewora_cart_v1`
- `dewora_wishlist_v1`

Requirements:
- Parse JSON inside `try/catch`.
- Validate stored data shape before using it.
- Fall back to empty arrays if storage is malformed or unavailable.
- Save after every cart/wishlist mutation.
- Update header counts after every mutation.
- Do not store checkout address, phone, email, or payment information.
- Provide a graceful fallback if browser storage is disabled.

Example utility contract:
- `getCart()`
- `saveCart(cart)`
- `addToCart(productId, quantity = 1)`
- `updateCartQuantity(productId, quantity)`
- `removeFromCart(productId)`
- `getWishlist()`
- `toggleWishlist(productId)`
- `getCartCount()`
- `getCartSubtotal()`

## 5. Routing and navigation

Use separate HTML files for the main pages. Use query parameters for product selection and search.

Examples:
- `shop.html?category=Sunscreen`
- `shop.html?q=hydration`
- `product.html?id=dew-sun-001`

Use `URLSearchParams` to read parameters. Encode values when generating links with `encodeURIComponent`.

Unknown product IDs must show a not-found UI rather than breaking the page.

## 6. Functional implementation details

### 6.1 Product rendering
- Read from `products.js`.
- Create product cards through a reusable rendering function.
- Add semantic links to product detail.
- Add buttons for cart and wishlist actions.
- Use `loading="lazy"` for below-the-fold images.
- Use a fixed aspect ratio to prevent layout shift.

### 6.2 Search
- Search product name, category, short description, concerns, and ingredients.
- Normalize input using lowercase and trim whitespace.
- Show an empty state when no products match.
- Search form should work with Enter and button activation.
- Preserve query in URL.

### 6.3 Filters and sorting
- Category, skin type, concern, and price filters.
- Filters must combine with AND logic across filter groups.
- Multiple selections within the same group may use OR logic.
- Sorting should be applied after filtering.
- Clear all resets UI controls and URL query parameters.

### 6.4 Cart calculations
- Subtotal = sum of `product.price * quantity`.
- Quantity minimum = 1.
- Removing a line item recalculates totals.
- Shipping is a demo rule documented in UI copy.
- Total = subtotal + shipping - demo discount.
- Do not use floating-point currency arithmetic for complex decimals; demo prices are whole INR amounts.
- Format with `Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })`.

### 6.5 Checkout
- Validate required fields in the browser.
- Validate email with a basic format check and phone with a reasonable Indian phone format check; avoid claiming full verification.
- Do not submit to a server.
- On valid submit, show a confirmation view and a generated demo reference such as `DWR-DEMO-12345`.
- Do not persist form values or personal information.
- Explicitly state that no payment was collected and no order was sent.

### 6.6 Toasts and feedback
- Create a reusable toast component.
- Announce status messages with `role="status"` or `aria-live="polite"`.
- Toasts should not be the only way to communicate validation errors.
- Avoid browser `alert()` for ordinary success messages.

### 6.7 Mobile menu
- Toggle with a real button.
- Update `aria-expanded`.
- Close on Escape and after selecting a navigation link.
- Ensure focus remains predictable.

## 7. HTML standards and accessibility

- Use `header`, `nav`, `main`, `section`, `article`, and `footer` appropriately.
- One clear `h1` per page.
- Use buttons for actions and anchors for navigation.
- Every form input must have a visible label.
- All images require useful alt text; decorative images use empty alt text.
- Maintain visible `:focus-visible` styles.
- Use `aria-label` only where visible text is insufficient.
- Accordions must use buttons with `aria-expanded` and `aria-controls`.
- Ensure color is not the only indicator of state.
- Respect reduced motion preferences.

## 8. Responsive breakpoints

Suggested breakpoints:
- Mobile: up to 599px
- Tablet: 600px–899px
- Desktop: 900px and above
- Wide desktop: 1200px and above

Requirements:
- No horizontal page overflow at 375px.
- Product grid: 2 columns on mobile where cards remain readable; 3 on tablet; 4 on desktop.
- Navigation collapses to mobile menu.
- Filters become a drawer or collapsible panel on mobile.
- Buttons have comfortable touch targets (approximately 44px).
- Product detail stacks image and details on mobile.

## 9. Error and empty states

Implement:
- Empty cart.
- Empty wishlist.
- No search results.
- No filter results.
- Invalid product ID.
- Invalid checkout fields.
- Storage unavailable or malformed.
- Broken product image fallback.

Never leave a blank page for an expected empty/error state.

## 10. Security and privacy

- No secrets, API keys, credentials, or tokens in source.
- No payment data collection.
- No external form submission.
- Avoid unsafe HTML injection.
- Do not load unknown third-party scripts.
- If using external images, use trusted sources and verify licensing/usage rights; prefer local assets for final submission.
- Do not claim compliance certification or medical efficacy.

## 11. Testing plan

### Functional test cases

| Test | Steps | Expected result |
|---|---|---|
| Navigation | Click every header/footer link | Correct page opens |
| Product detail | Click a product card | Correct product details load |
| Invalid product | Open unknown product ID | Friendly not-found view |
| Search | Search a known product keyword | Matching products appear |
| Filters | Apply category and skin type | Matching products only |
| Sorting | Sort low-to-high | Prices ascend |
| Add cart | Add a product | Cart count updates |
| Cart persistence | Refresh page | Cart remains |
| Quantity | Increase/decrease quantity | Totals recalculate |
| Remove cart | Remove line item | Item disappears |
| Wishlist | Toggle wishlist | Item appears/disappears |
| Wishlist persistence | Refresh page | Wishlist remains |
| Checkout validation | Submit empty form | Inline errors appear |
| Demo checkout | Submit valid form | Simulated confirmation appears |
| Privacy | Inspect checkout behavior | No network submission or saved personal data |
| Responsive | Test 375/768/1024/1440 widths | No broken layout or overflow |
| Accessibility | Keyboard through page | Focus visible and actions operable |

### QA checklist
- Check browser console for errors.
- Check broken image paths.
- Check all internal links.
- Check product IDs are unique.
- Check storage data is validated.
- Check no backend/API/database dependency exists.
- Check no real checkout or payment flow exists.
- Check mobile menu and filter controls with keyboard.
- Check contrast and reduced-motion behavior.

## 12. Definition of done

The website is done when all PRD acceptance criteria and test cases pass, all required pages are implemented, all visible controls work, responsive behavior is verified, and the project can run as a static site without a backend or database.
