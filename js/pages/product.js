/**
 * Dewora — Product Detail Controller
 * Phase 5: Complete Product Detail Page Implementation
 * Specification: PRD.md Section 7.3, TRD.md Section 6.4, DESIGN.md Section 9
 */

window.Dewora = window.Dewora || {};
Dewora.pages = Dewora.pages || {};

Dewora.pages.product = (function () {
  'use strict';

  var currentProduct = null;
  var currentQuantity = 1;
  var MIN_QTY = 1;
  var MAX_QTY = 10;
  var FREE_SHIPPING_THRESHOLD = 499;

  function init() {
    var params = new URLSearchParams(window.location.search);
    var productId = params.get('id');

    var container = document.getElementById('pdp-mount-point');
    if (!container) return;

    if (!productId) {
      renderNotFound(container, 'No product specified.');
      return;
    }

    if (!Dewora.products || !Array.isArray(Dewora.products)) {
      renderNotFound(container, 'Product catalogue is loading or unavailable.');
      return;
    }

    currentProduct = Dewora.products.find(function (p) {
      return p.id === productId;
    });

    if (!currentProduct) {
      renderNotFound(container, 'The requested skincare essential was not found.');
      return;
    }

    // Update document title and metadata
    document.title = currentProduct.name + ' — Dewora';
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && currentProduct.shortDescription) {
      metaDesc.setAttribute('content', currentProduct.shortDescription);
    }

    // Render Product Detail Page
    currentQuantity = 1;
    renderProductPage(container, currentProduct);
    bindEvents(container, currentProduct);

    // Initialize accordions
    if (Dewora.components && Dewora.components.accordion) {
      Dewora.components.accordion.init('#pdp-accordion');
    }

    console.log('Dewora: Loaded product detail for', currentProduct.id, currentProduct.name);
  }

  /**
   * Render Not Found State
   */
  function renderNotFound(container, message) {
    document.title = 'Product Not Found — Dewora';

    var searchIcon = Dewora.dom && Dewora.dom.getIcon
      ? Dewora.dom.getIcon('search')
      : '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>';

    container.innerHTML = [
      '<div class="pdp-not-found">',
      '  <div class="pdp-not-found-icon">' + searchIcon + '</div>',
      '  <h1 class="pdp-not-found-title">Skincare Essential Not Found</h1>',
      '  <p class="pdp-not-found-text">' + Dewora.dom.escapeHTML(message) + ' The product link may be incorrect, or the formulation may have moved in our catalogue.</p>',
      '  <div>',
      '    <a href="shop.html" class="btn btn-primary">Browse All Skincare</a>',
      '  </div>',
      '</div>'
    ].join('\n');
  }

  /**
   * Render Complete Product Detail Page
   */
  function renderProductPage(container, product) {
    var formattedPrice = Dewora.currency ? Dewora.currency.formatINR(product.price) : '₹' + product.price;
    var hasCompare = product.compareAtPrice && product.compareAtPrice > product.price;
    var formattedCompare = hasCompare && Dewora.currency ? Dewora.currency.formatINR(product.compareAtPrice) : '';
    var discountPercent = hasCompare ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100) : 0;
    var isWishlisted = Dewora.storage ? Dewora.storage.isInWishlist(product.id) : false;

    var gallery = product.gallery && Array.isArray(product.gallery) && product.gallery.length > 1 ? product.gallery : [];

    var heartIcon = Dewora.dom && Dewora.dom.getIcon ? Dewora.dom.getIcon('heart') : '♥';
    var checkIcon = Dewora.dom && Dewora.dom.getIcon ? Dewora.dom.getIcon('check') : '✓';
    var bagIcon = Dewora.dom && Dewora.dom.getIcon ? Dewora.dom.getIcon('bag') : '🛒';
    var truckIcon = Dewora.dom && Dewora.dom.getIcon ? Dewora.dom.getIcon('truck') : '🚚';

    var html = [];

    // 1. Dynamic Breadcrumbs
    html.push('<nav class="pdp-breadcrumb" aria-label="Breadcrumb">');
    html.push('  <a href="index.html">Home</a>');
    html.push('  <span class="pdp-breadcrumb-separator" aria-hidden="true">/</span>');
    html.push('  <a href="shop.html">Shop</a>');
    html.push('  <span class="pdp-breadcrumb-separator" aria-hidden="true">/</span>');
    html.push('  <a href="shop.html?category=' + encodeURIComponent(product.category) + '">' + Dewora.dom.escapeHTML(product.category) + '</a>');
    html.push('  <span class="pdp-breadcrumb-separator" aria-hidden="true">/</span>');
    html.push('  <span class="pdp-breadcrumb-current" aria-current="page">' + Dewora.dom.escapeHTML(product.name) + '</span>');
    html.push('</nav>');

    // 2. Main Two-Column Layout
    html.push('<div class="pdp-layout">');

    // --- LEFT COLUMN: Image Gallery ---
    html.push('  <div class="pdp-gallery-column">');
    html.push('    <div class="pdp-gallery-main">');

    if (product.badge) {
      var badgeClass = product.badge.toLowerCase() === 'sale' ? 'product-badge sale' : 'product-badge';
      html.push('      <span class="' + badgeClass + ' pdp-gallery-badge">' + Dewora.dom.escapeHTML(product.badge) + '</span>');
    }

    html.push('      <img id="pdp-main-image" class="pdp-main-image" src="' + Dewora.dom.escapeHTML(product.image) + '" alt="' + Dewora.dom.escapeHTML(product.name) + '" width="600" height="750">');
    html.push('    </div>');

    // Render thumbnails if multiple gallery images exist
    if (gallery.length > 1) {
      html.push('    <div class="pdp-gallery-thumbs" role="tablist" aria-label="Product images">');
      gallery.forEach(function (imgSrc, idx) {
        var isFirst = idx === 0;
        html.push('      <button type="button" class="pdp-thumb-btn ' + (isFirst ? 'active' : '') + '" data-src="' + Dewora.dom.escapeHTML(imgSrc) + '" data-index="' + idx + '" role="tab" aria-selected="' + (isFirst ? 'true' : 'false') + '" aria-label="View product image ' + (idx + 1) + ' of ' + gallery.length + '">');
        html.push('        <img src="' + Dewora.dom.escapeHTML(imgSrc) + '" alt="' + Dewora.dom.escapeHTML(product.name) + ' view ' + (idx + 1) + '" width="76" height="95" loading="lazy">');
        html.push('      </button>');
      });
      html.push('    </div>');
    }

    html.push('  </div>');

    // --- RIGHT COLUMN: Product Details & Purchase Actions ---
    html.push('  <div class="pdp-info-column">');

    // Category Tag
    html.push('    <a href="shop.html?category=' + encodeURIComponent(product.category) + '" class="pdp-category-link">' + Dewora.dom.escapeHTML(product.category) + '</a>');

    // Title
    html.push('    <h1 class="pdp-title">' + Dewora.dom.escapeHTML(product.name) + '</h1>');

    // Rating Row
    html.push('    <div class="pdp-rating-row" aria-label="Rated ' + product.rating + ' out of 5 stars based on ' + product.reviewCount + ' reviews">');
    html.push('      <span class="pdp-rating-stars" aria-hidden="true">★★★★★</span>');
    html.push('      <span class="pdp-rating-score">' + product.rating + '</span>');
    html.push('      <span>(' + product.reviewCount + ' reviews)</span>');
    html.push('      <span class="pdp-rating-demo-tag">Demo feedback</span>');
    html.push('    </div>');

    // Price Block
    html.push('    <div class="pdp-price-block">');
    html.push('      <span class="pdp-price-current">' + formattedPrice + '</span>');
    if (hasCompare) {
      html.push('      <span class="pdp-price-compare">' + formattedCompare + '</span>');
      html.push('      <span class="pdp-discount-pill">Save ' + discountPercent + '%</span>');
    }
    html.push('    </div>');
    html.push('    <p class="pdp-tax-note">Inclusive of all taxes. Free delivery on cart subtotals of ₹' + FREE_SHIPPING_THRESHOLD + ' or more.</p>');

    // Meta Pills: Size / Volume
    html.push('    <div class="pdp-meta-pills">');
    html.push('      <span class="pdp-meta-pill"><strong>Size:</strong> ' + Dewora.dom.escapeHTML(product.size || 'Standard') + '</span>');
    if (product.featured) {
      html.push('      <span class="pdp-meta-pill">★ Ritual Bestseller</span>');
    }
    html.push('    </div>');

    // Short Description
    html.push('    <p class="pdp-short-desc">' + Dewora.dom.escapeHTML(product.shortDescription || product.description) + '</p>');

    // Suitability Callout
    html.push('    <div class="pdp-suitability-box">');
    html.push('      <div class="pdp-suitability-item">');
    html.push('        <span class="pdp-suitability-label">Skin Type:</span>');
    html.push('        <span>' + Dewora.dom.escapeHTML((product.skinTypes || ['All skin types']).join(', ')) + '</span>');
    html.push('      </div>');
    html.push('      <div class="pdp-suitability-item">');
    html.push('        <span class="pdp-suitability-label">Target Concern:</span>');
    html.push('        <span>' + Dewora.dom.escapeHTML((product.concerns || []).join(', ')) + '</span>');
    html.push('      </div>');
    html.push('    </div>');

    // Shipping Information Card (Based strictly on cart subtotal, not individual product price)
    html.push('    <div class="pdp-shipping-card">');
    html.push('      <span class="pdp-shipping-icon" aria-hidden="true">' + truckIcon + '</span>');
    html.push('      <div class="pdp-shipping-text">');
    html.push('        <strong>Free delivery on cart subtotals of ₹' + FREE_SHIPPING_THRESHOLD + ' or more.</strong>');
    html.push('        <div class="pdp-shipping-subtext">Add products to your bag to reach the ₹' + FREE_SHIPPING_THRESHOLD + ' free-delivery threshold. Calculated on your overall order at checkout.</div>');
    html.push('      </div>');
    html.push('    </div>');

    // Purchase Actions Row: Quantity + Add to Cart + Wishlist
    html.push('    <div class="pdp-purchase-actions">');

    // Quantity Stepper
    html.push('      <div class="pdp-quantity-stepper" role="group" aria-label="Product quantity">');
    html.push('        <button type="button" class="pdp-quantity-btn" id="pdp-qty-minus" aria-label="Decrease quantity" disabled>&minus;</button>');
    html.push('        <input type="number" class="pdp-quantity-input" id="pdp-qty-input" value="1" min="1" max="10" aria-label="Quantity" readonly>');
    html.push('        <button type="button" class="pdp-quantity-btn" id="pdp-qty-plus" aria-label="Increase quantity">&plus;</button>');
    html.push('      </div>');

    // Add to Cart CTA
    html.push('      <button type="button" class="btn btn-primary pdp-add-cart-btn" id="pdp-add-cart-btn">');
    html.push('        ' + bagIcon);
    html.push('        <span>Add to Bag &bull; <span id="pdp-btn-price">' + formattedPrice + '</span></span>');
    html.push('      </button>');

    // Wishlist Toggle Button
    html.push('      <button type="button" class="pdp-wishlist-toggle ' + (isWishlisted ? 'active' : '') + '" id="pdp-wishlist-btn" aria-label="' + (isWishlisted ? 'Remove from wishlist' : 'Add to wishlist') + '" title="Wishlist">');
    html.push('        ' + heartIcon);
    html.push('      </button>');

    html.push('    </div>');

    // Reassurance Strip (Neutral, verified messaging without unsupported claims)
    html.push('    <div class="pdp-trust-bar">');
    html.push('      <div class="pdp-trust-item">');
    html.push('        <span class="pdp-trust-icon" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg></span>');
    html.push('        <span class="pdp-trust-label">Thoughtfully Designed Formulas</span>');
    html.push('        <span class="pdp-trust-subtext">Mindfully balanced everyday care</span>');
    html.push('      </div>');
    html.push('      <div class="pdp-trust-item">');
    html.push('        <span class="pdp-trust-icon" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg></span>');
    html.push('        <span class="pdp-trust-label">Ingredient Information Available</span>');
    html.push('        <span class="pdp-trust-subtext">Transparent details for every item</span>');
    html.push('      </div>');
    html.push('      <div class="pdp-trust-item">');
    html.push('        <span class="pdp-trust-icon" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg></span>');
    html.push('        <span class="pdp-trust-label">Find Products for Your Routine</span>');
    html.push('        <span class="pdp-trust-subtext">Curated essentials by skin focus</span>');
    html.push('      </div>');
    html.push('    </div>');

    // Product Accordions
    html.push('    <div class="pdp-accordion-wrap">');
    html.push('      <div class="accordion pdp-accordion" id="pdp-accordion">');

    // Accordion 1: Description
    html.push('        <div class="accordion-item">');
    html.push('          <button type="button" class="accordion-header" aria-expanded="true" aria-controls="acc-desc">');
    html.push('            <span>Description &amp; Formula</span>');
    html.push('            <svg class="accordion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>');
    html.push('          </button>');
    html.push('          <div class="accordion-content active" id="acc-desc" aria-hidden="false">');
    html.push('            <p>' + Dewora.dom.escapeHTML(product.description) + '</p>');
    html.push('          </div>');
    html.push('        </div>');

    // Accordion 2: Key Benefits
    if (product.benefits && product.benefits.length > 0) {
      html.push('        <div class="accordion-item">');
      html.push('          <button type="button" class="accordion-header" aria-expanded="false" aria-controls="acc-benefits">');
      html.push('            <span>Key Benefits</span>');
      html.push('            <svg class="accordion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>');
      html.push('          </button>');
      html.push('          <div class="accordion-content" id="acc-benefits" aria-hidden="true">');
      html.push('            <ul class="pdp-checklist">');
      product.benefits.forEach(function (b) {
        html.push('              <li><span class="pdp-checklist-icon" aria-hidden="true">' + checkIcon + '</span> <span>' + Dewora.dom.escapeHTML(b) + '</span></li>');
      });
      html.push('            </ul>');
      html.push('          </div>');
      html.push('        </div>');
    }

    // Accordion 3: Ingredients
    if (product.ingredients && product.ingredients.length > 0) {
      html.push('        <div class="accordion-item">');
      html.push('          <button type="button" class="accordion-header" aria-expanded="false" aria-controls="acc-ingredients">');
      html.push('            <span>Full Ingredients</span>');
      html.push('            <svg class="accordion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>');
      html.push('          </button>');
      html.push('          <div class="accordion-content" id="acc-ingredients" aria-hidden="true">');
      html.push('            <div class="pdp-ingredients-tags">');
      product.ingredients.forEach(function (ing) {
        html.push('              <span class="pdp-ingredient-tag">' + Dewora.dom.escapeHTML(ing) + '</span>');
      });
      html.push('            </div>');
      html.push('            <p style="font-size: 0.85rem; margin-top: 0.5rem; color: var(--color-muted);">Full ingredient listings are provided to help you understand what goes into your everyday routine. Demo skincare storefront.</p>');
      html.push('          </div>');
      html.push('        </div>');
    }

    // Accordion 4: How to Use
    if (product.howToUse) {
      html.push('        <div class="accordion-item">');
      html.push('          <button type="button" class="accordion-header" aria-expanded="false" aria-controls="acc-usage">');
      html.push('            <span>How to Use &amp; Ritual</span>');
      html.push('            <svg class="accordion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>');
      html.push('          </button>');
      html.push('          <div class="accordion-content" id="acc-usage" aria-hidden="true">');
      html.push('            <p>' + Dewora.dom.escapeHTML(product.howToUse) + '</p>');
      html.push('          </div>');
      html.push('        </div>');
    }

    // Accordion 5: Skin Suitability & Safety Note
    html.push('        <div class="accordion-item">');
    html.push('          <button type="button" class="accordion-header" aria-expanded="false" aria-controls="acc-safety">');
    html.push('            <span>Suitability &amp; Safety Note</span>');
    html.push('            <svg class="accordion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>');
    html.push('          </button>');
    html.push('          <div class="accordion-content" id="acc-safety" aria-hidden="true">');
    html.push('            <p><strong>Suitable Skin Types:</strong> ' + Dewora.dom.escapeHTML((product.skinTypes || ['All skin types']).join(', ')) + '</p>');
    html.push('            <p style="margin-top: 0.35rem;"><strong>Focus Concerns:</strong> ' + Dewora.dom.escapeHTML((product.concerns || []).join(', ')) + '</p>');
    html.push('            <div class="pdp-safety-note">');
    html.push('              <strong>Patch Test Recommendation:</strong> Always perform an allergy patch test on the inner arm or behind the ear 24 hours prior to regular use. If stinging, redness, burning, or discomfort occurs, discontinue use immediately. For external cosmetic application only.');
    html.push('            </div>');
    html.push('          </div>');
    html.push('        </div>');

    html.push('      </div>'); // .pdp-accordion
    html.push('    </div>'); // .pdp-accordion-wrap

    html.push('  </div>'); // .pdp-info-column
    html.push('</div>'); // .pdp-layout

    // 3. Related Products ("You May Also Like") Section
    var relatedProducts = getRelatedProducts(product);
    if (relatedProducts.length > 0) {
      html.push('<section class="pdp-related-section" aria-labelledby="pdp-related-heading">');
      html.push('  <div class="pdp-related-header">');
      html.push('    <h2 class="pdp-related-title" id="pdp-related-heading">You May Also Like</h2>');
      html.push('    <p class="pdp-related-desc">Mindfully formulated companion essentials to complete your everyday ritual.</p>');
      html.push('  </div>');
      html.push('  <div class="product-grid pdp-related-grid">');
      relatedProducts.forEach(function (rel) {
        if (Dewora.components && Dewora.components.productCard) {
          html.push(Dewora.components.productCard.render(rel));
        }
      });
      html.push('  </div>');
      html.push('</section>');
    }

    container.innerHTML = html.join('\n');
  }

  /**
   * Find companion / related products based on category and shared concerns
   */
  function getRelatedProducts(current) {
    if (!Dewora.products || !Array.isArray(Dewora.products)) return [];

    var candidates = Dewora.products.filter(function (p) {
      return p.id !== current.id;
    });

    // Score candidates based on category match and concern match
    candidates.sort(function (a, b) {
      var scoreA = (a.category === current.category ? 3 : 0);
      var scoreB = (b.category === current.category ? 3 : 0);

      if (current.concerns && a.concerns) {
        a.concerns.forEach(function (c) {
          if (current.concerns.includes(c)) scoreA += 1;
        });
      }
      if (current.concerns && b.concerns) {
        b.concerns.forEach(function (c) {
          if (current.concerns.includes(c)) scoreB += 1;
        });
      }

      if (a.featured) scoreA += 0.5;
      if (b.featured) scoreB += 0.5;

      return scoreB - scoreA;
    });

    return candidates.slice(0, 4);
  }

  /**
   * Bind PDP Interactive Events
   */
  function bindEvents(container, product) {
    // 1. Gallery Thumbnail Switching
    var thumbs = container.querySelectorAll('.pdp-thumb-btn');
    var mainImage = container.querySelector('#pdp-main-image');

    thumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        var src = thumb.getAttribute('data-src');
        if (!src || !mainImage) return;

        thumbs.forEach(function (t) {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });

        thumb.classList.add('active');
        thumb.setAttribute('aria-selected', 'true');

        mainImage.style.opacity = '0.4';
        setTimeout(function () {
          mainImage.src = src;
          mainImage.style.opacity = '1';
        }, 120);
      });
    });

    // 2. Quantity Stepper
    var minusBtn = container.querySelector('#pdp-qty-minus');
    var plusBtn = container.querySelector('#pdp-qty-plus');
    var qtyInput = container.querySelector('#pdp-qty-input');
    var btnPrice = container.querySelector('#pdp-btn-price');

    function updateQuantity(newQty) {
      if (newQty < MIN_QTY) newQty = MIN_QTY;
      if (newQty > MAX_QTY) newQty = MAX_QTY;

      currentQuantity = newQty;
      if (qtyInput) qtyInput.value = currentQuantity;

      if (minusBtn) minusBtn.disabled = currentQuantity <= MIN_QTY;
      if (plusBtn) plusBtn.disabled = currentQuantity >= MAX_QTY;

      if (btnPrice && Dewora.currency) {
        btnPrice.textContent = Dewora.currency.formatINR(product.price * currentQuantity);
      }
    }

    if (minusBtn) {
      minusBtn.addEventListener('click', function () {
        updateQuantity(currentQuantity - 1);
      });
    }

    if (plusBtn) {
      plusBtn.addEventListener('click', function () {
        updateQuantity(currentQuantity + 1);
      });
    }

    // 3. Add to Cart Button
    var addCartBtn = container.querySelector('#pdp-add-cart-btn');
    if (addCartBtn) {
      addCartBtn.addEventListener('click', function () {
        if (!Dewora.storage) return;

        Dewora.storage.addToCart(product.id, currentQuantity);

        var message = 'Added ' + currentQuantity + ' × ' + product.name + ' to your bag.';
        if (Dewora.showToast) {
          Dewora.showToast(message, 'success');
        } else if (Dewora.components && Dewora.components.toast) {
          Dewora.components.toast.show(message, 'success');
        }
      });
    }

    // 4. Wishlist Button
    var wishlistBtn = container.querySelector('#pdp-wishlist-btn');
    if (wishlistBtn) {
      wishlistBtn.addEventListener('click', function () {
        if (!Dewora.storage) return;

        var added = Dewora.storage.toggleWishlist(product.id);
        wishlistBtn.classList.toggle('active', added);
        wishlistBtn.setAttribute('aria-label', added ? 'Remove from wishlist' : 'Add to wishlist');

        var message = added
          ? 'Saved ' + product.name + ' to your wishlist'
          : 'Removed ' + product.name + ' from your wishlist';

        if (Dewora.showToast) {
          Dewora.showToast(message, 'info');
        } else if (Dewora.components && Dewora.components.toast) {
          Dewora.components.toast.show(message, 'info');
        }
      });
    }
  }

  return {
    init: init,
    getCurrentProduct: function () { return currentProduct; },
    getCurrentQuantity: function () { return currentQuantity; }
  };
})();
