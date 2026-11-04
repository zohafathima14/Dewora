/**
 * Dewora — Shopping Cart Page Controller (Phase 6.1 Policy Corrected)
 * Specification: TRD.md Section 6.4, PRD.md Section 7.4 & DESIGN.md Section 10
 * Handles cart display, accessible quantity adjustments, item removal,
 * accurate ₹499 free-delivery progress threshold, and transparent order summary.
 */

window.Dewora = window.Dewora || {};
Dewora.pages = Dewora.pages || {};

Dewora.pages.cart = (function () {
  'use strict';

  var FREE_SHIPPING_THRESHOLD = 499;

  /**
   * Initialize Cart Page
   */
  function init() {
    var root = document.getElementById('cart-root');
    if (!root) {
      console.warn('Dewora: Cart root element (#cart-root) not found.');
      return;
    }

    render();

    // Re-render when cart changes in storage (keeps UI and badges in sync)
    if (Dewora.storage && typeof Dewora.storage.subscribe === 'function') {
      Dewora.storage.subscribe(function (event) {
        if (event === 'cart_updated') {
          render();
        }
      });
    }

    console.log('Dewora: Shopping Cart page controller active.');
  }

  /**
   * Main Render Dispatcher
   */
  function render() {
    var root = document.getElementById('cart-root');
    if (!root) return;

    var cartItems = (Dewora.storage ? Dewora.storage.getCart() : []) || [];
    var resolvedItems = [];

    // Map stored line items to product dataset
    if (Dewora.products && Array.isArray(Dewora.products)) {
      var prodMap = {};
      Dewora.products.forEach(function (p) {
        prodMap[p.id] = p;
      });

      cartItems.forEach(function (item) {
        var product = prodMap[item.productId];
        if (product) {
          resolvedItems.push({
            item: item,
            product: product
          });
        }
      });
    }

    if (resolvedItems.length === 0) {
      renderEmptyState(root);
    } else {
      renderCartView(root, resolvedItems);
    }
  }

  /**
   * Render Empty Cart State
   */
  function renderEmptyState(root) {
    var html = [
      '<nav class="cart-breadcrumb" aria-label="Breadcrumb">',
      '  <a href="index.html">Home</a>',
      '  <span class="cart-breadcrumb-separator" aria-hidden="true">/</span>',
      '  <span>Bag</span>',
      '</nav>',
      '<div class="cart-empty-container">',
      '  <div class="cart-empty-icon" aria-hidden="true">',
      '    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">',
      '      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>',
      '      <line x1="3" y1="6" x2="21" y2="6"></line>',
      '      <path d="M16 10a4 4 0 0 1-8 0"></path>',
      '    </svg>',
      '  </div>',
      '  <h1 class="cart-empty-title">Your Bag is Empty</h1>',
      '  <p class="cart-empty-desc">Your skincare bag is waiting for a little glow. Discover our everyday gentle essentials formulated for natural balance.</p>',
      '  <a href="shop.html" class="btn btn-primary" style="padding: 0.85rem 2rem;">Discover Skincare</a>',
      '  <div class="cart-empty-categories">',
      '    <p class="cart-empty-cat-title">Explore by category</p>',
      '    <div class="cart-empty-chips">',
      '      <a href="shop.html?category=Sunscreen" class="cart-empty-chip">Sunscreen</a>',
      '      <a href="shop.html?category=Moisturizers" class="cart-empty-chip">Moisturizers</a>',
      '      <a href="shop.html?category=Serums" class="cart-empty-chip">Serums</a>',
      '      <a href="shop.html?category=Cleansers" class="cart-empty-chip">Cleansers</a>',
      '      <a href="shop.html?category=Body%20Care" class="cart-empty-chip">Body Care</a>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('\n');

    root.innerHTML = html;
  }

  /**
   * Render Active Cart with Line Items and Summary
   */
  function renderCartView(root, resolvedItems) {
    var subtotal = 0;
    var totalQuantity = 0;

    resolvedItems.forEach(function (entry) {
      subtotal += entry.product.price * entry.item.quantity;
      totalQuantity += entry.item.quantity;
    });

    // Accurate free-delivery threshold evaluation (strictly based on subtotal >= 499)
    var isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
    var remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
    var shippingProgressPercent = isFreeShipping
      ? 100
      : Math.min(99, Math.floor((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

    // Simple transparent total (no invented delivery fees or unapproved coupons)
    var total = subtotal;

    var formatINR = Dewora.currency ? Dewora.currency.formatINR : function (n) { return '₹' + n; };
    var escape = Dewora.dom ? Dewora.dom.escapeHTML : function (s) { return s; };

    // 1. Breadcrumb & Header
    var breadcrumbHtml = [
      '<nav class="cart-breadcrumb" aria-label="Breadcrumb">',
      '  <a href="index.html">Home</a>',
      '  <span class="cart-breadcrumb-separator" aria-hidden="true">/</span>',
      '  <span>Bag</span>',
      '</nav>',
      '<div class="cart-header-row">',
      '  <div>',
      '    <h1 class="cart-title">Your Skincare Bag</h1>',
      '    <p class="cart-subtitle">' + totalQuantity + ' ' + (totalQuantity === 1 ? 'item' : 'items') + ' in your routine</p>',
      '  </div>',
      '  <a href="shop.html" class="cart-continue-link" style="font-weight: 500;">+ Add more products</a>',
      '</div>'
    ].join('\n');

    // 2. Free Delivery Banner
    var shippingBannerHtml = [
      '<div class="cart-shipping-banner ' + (isFreeShipping ? 'unlocked' : '') + '">',
      '  <div class="cart-shipping-msg">',
      '    <span class="cart-shipping-icon" aria-hidden="true">',
      isFreeShipping
        ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>'
        : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>',
      '    </span>',
      '    <span>',
      isFreeShipping
        ? '<strong>You have unlocked Free Standard Delivery!</strong>'
        : 'Add <strong>' + formatINR(remainingForFreeShipping) + '</strong> more to qualify for <strong>Free Delivery</strong>',
      '    </span>',
      '  </div>',
      '  <div class="cart-shipping-track" role="progressbar" aria-valuenow="' + shippingProgressPercent + '" aria-valuemin="0" aria-valuemax="100" aria-label="Free delivery progress">',
      '    <div class="cart-shipping-bar" style="width: ' + shippingProgressPercent + '%;"></div>',
      '  </div>',
      '</div>'
    ].join('\n');

    // 3. Cart Items Table
    var itemsRowsHtml = resolvedItems.map(function (entry) {
      var p = entry.product;
      var qty = entry.item.quantity;
      var lineTotal = p.price * qty;

      return [
        '<div class="cart-item-row" data-product-id="' + escape(p.id) + '">',
        '  <div class="cart-item-info">',
        '    <a href="product.html?id=' + encodeURIComponent(p.id) + '" class="cart-item-media" aria-label="' + escape(p.name) + '">',
        '      <img src="' + escape(p.image) + '" alt="' + escape(p.name) + '" width="76" height="96" loading="lazy" onerror="this.onerror=null;this.src=\'assets/images/products/placeholder-skincare.svg\';">',
        '    </a>',
        '    <div class="cart-item-text">',
        '      <span class="cart-item-category">' + escape(p.category) + '</span>',
        '      <h2 class="cart-item-title"><a href="product.html?id=' + encodeURIComponent(p.id) + '">' + escape(p.name) + '</a></h2>',
        '      <span class="cart-item-size">' + escape(p.size || '') + '</span>',
        '    </div>',
        '  </div>',
        '  <div class="cart-item-price">' + formatINR(p.price) + '</div>',
        '  <div class="cart-item-qty">',
        '    <div class="cart-stepper">',
        '      <button type="button" class="cart-stepper-btn btn-qty-minus" data-action="decrement" data-product-id="' + escape(p.id) + '" aria-label="Decrease quantity of ' + escape(p.name) + '" ' + (qty <= 1 ? 'disabled' : '') + '>−</button>',
        '      <input type="number" id="qty-desktop-' + escape(p.id) + '" name="quantity" class="cart-stepper-input cart-qty-input" data-product-id="' + escape(p.id) + '" value="' + qty + '" min="1" aria-label="Quantity for ' + escape(p.name) + '">',
        '      <button type="button" class="cart-stepper-btn btn-qty-plus" data-action="increment" data-product-id="' + escape(p.id) + '" aria-label="Increase quantity of ' + escape(p.name) + '">+</button>',
        '    </div>',
        '  </div>',
        '  <div class="cart-item-total">' + formatINR(lineTotal) + '</div>',
        '  <div class="cart-item-remove-col">',
        '    <button type="button" class="cart-item-remove-btn btn-remove-item" data-product-id="' + escape(p.id) + '" data-product-name="' + escape(p.name) + '" aria-label="Remove ' + escape(p.name) + ' from bag" title="Remove item">',
        '      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>',
        '    </button>',
        '  </div>',
        '  <!-- Mobile View Actions Row -->',
        '  <div class="cart-mobile-actions">',
        '    <div class="cart-stepper">',
        '      <button type="button" class="cart-stepper-btn btn-qty-minus" data-action="decrement" data-product-id="' + escape(p.id) + '" aria-label="Decrease quantity" ' + (qty <= 1 ? 'disabled' : '') + '>−</button>',
        '      <input type="number" id="qty-mobile-' + escape(p.id) + '" name="quantity" class="cart-stepper-input cart-qty-input" data-product-id="' + escape(p.id) + '" value="' + qty + '" min="1" aria-label="Quantity">',
        '      <button type="button" class="cart-stepper-btn btn-qty-plus" data-action="increment" data-product-id="' + escape(p.id) + '" aria-label="Increase quantity">+</button>',
        '    </div>',
        '    <div class="cart-mobile-price-group">',
        '      <span class="cart-mobile-price">' + formatINR(lineTotal) + '</span>',
        '      <span class="cart-mobile-unit">(' + formatINR(p.price) + ' each)</span>',
        '    </div>',
        '    <button type="button" class="cart-item-remove-btn btn-remove-item" data-product-id="' + escape(p.id) + '" data-product-name="' + escape(p.name) + '" aria-label="Remove ' + escape(p.name) + ' from bag" title="Remove item">',
        '      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>',
        '    </button>',
        '  </div>',
        '</div>'
      ].join('\n');
    }).join('\n');

    var cartItemsHtml = [
      '<div class="cart-items-card">',
      '  <div class="cart-table-head">',
      '    <span>Product</span>',
      '    <span>Unit Price</span>',
      '    <span>Quantity</span>',
      '    <span>Total</span>',
      '    <span aria-hidden="true"></span>',
      '  </div>',
      itemsRowsHtml,
      '</div>'
    ].join('\n');

    // 4. Order Summary Card (Transparent calculation: Subtotal equals total without unapproved fee/coupons)
    var deliveryRowHtml = isFreeShipping
      ? [
          '<div class="cart-summary-row">',
          '  <span>Delivery</span>',
          '  <span class="cart-summary-val free">FREE</span>',
          '</div>',
          '<div style="font-size: 0.775rem; color: var(--color-sage-deep); margin-top: -0.35rem; margin-bottom: 0.75rem;">✓ Order qualifies for complimentary delivery (₹' + FREE_SHIPPING_THRESHOLD + '+ threshold).</div>'
        ].join('\n')
      : [
          '<div class="cart-summary-row">',
          '  <span>Delivery</span>',
          '  <span class="cart-summary-val" style="font-size: 0.85rem; color: var(--color-muted);">Not configured</span>',
          '</div>',
          '<div style="font-size: 0.775rem; color: var(--color-muted); margin-top: -0.35rem; margin-bottom: 0.75rem;">Free on cart subtotals of ₹' + FREE_SHIPPING_THRESHOLD + ' or more. Delivery charges below ₹' + FREE_SHIPPING_THRESHOLD + ' have not been configured in this demo.</div>'
        ].join('\n');

    var summaryHtml = [
      '<aside class="cart-summary-sidebar">',
      '  <div class="cart-summary-card">',
      '    <h2 class="cart-summary-title">Order Summary</h2>',
      '    <div class="cart-summary-row">',
      '      <span>Bag Subtotal</span>',
      '      <span class="cart-summary-val">' + formatINR(subtotal) + '</span>',
      '    </div>',
      deliveryRowHtml,
      '    <div class="cart-summary-divider"></div>',
      '    <div class="cart-summary-total">',
      '      <span>Estimated Total</span>',
      '      <span class="cart-summary-total-val">' + formatINR(total) + '</span>',
      '    </div>',
      '    <p class="cart-summary-tax-note">Inclusive of all applicable taxes. Delivery charges, if any, are not configured in this demo.</p>',
      '    <!-- Actions -->',
      '    <a href="checkout.html" class="btn btn-primary cart-checkout-btn">Proceed to Demo Checkout</a>',
      '    <a href="shop.html" class="cart-continue-link">← Continue Shopping</a>',
      '    <!-- Neutral Interface Reassurance Highlights -->',
      '    <div class="cart-reassurance">',
      '      <div class="cart-reassurance-item">',
      '        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
      '        <span>Frontend demo storefront — simulated checkout flow.</span>',
      '      </div>',
      '      <div class="cart-reassurance-item">',
      '        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>',
      '        <span>Demo bag items saved in local browser storage.</span>',
      '      </div>',
      '      <div class="cart-reassurance-item">',
      '        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>',
      '        <span>Free delivery threshold applies on cart subtotals of ₹' + FREE_SHIPPING_THRESHOLD + '+.</span>',
      '      </div>',
      '    </div>',
      '  </div>',
      '</aside>'
    ].join('\n');

    // Assemble Root HTML
    root.innerHTML = [
      breadcrumbHtml,
      '<div class="cart-layout">',
      '  <div class="cart-main">',
      shippingBannerHtml,
      cartItemsHtml,
      '  </div>',
      summaryHtml,
      '</div>'
    ].join('\n');

    // Attach Event Listeners
    attachCartEvents(root);
  }

  /**
   * Attach Interactive Handlers to Cart Elements
   */
  function attachCartEvents(root) {
    // 1. Quantity Adjustments (Plus / Minus)
    var stepperBtns = root.querySelectorAll('.cart-stepper-btn');
    stepperBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var productId = btn.getAttribute('data-product-id');
        var action = btn.getAttribute('data-action');
        var input = btn.parentElement.querySelector('.cart-qty-input');
        if (!productId || !input) return;

        var currentQty = parseInt(input.value, 10) || 1;
        var newQty = currentQty;

        if (action === 'increment') {
          // Positive integer increment without arbitrary cap
          newQty = currentQty + 1;
        } else if (action === 'decrement') {
          // Bound to minimum 1
          newQty = Math.max(1, currentQty - 1);
        }

        if (newQty !== currentQty && Dewora.storage) {
          Dewora.storage.updateCartQuantity(productId, newQty);
          if (Dewora.showToast) {
            Dewora.showToast('Updated item quantity to ' + newQty, 'info');
          }
        }
      });
    });

    // 2. Direct Quantity Input Edit
    var qtyInputs = root.querySelectorAll('.cart-qty-input');
    qtyInputs.forEach(function (input) {
      input.addEventListener('change', function () {
        var productId = input.getAttribute('data-product-id');
        var val = parseInt(input.value, 10);
        // Validate strictly positive integer (no arbitrary upper cap)
        if (isNaN(val) || val < 1) val = 1;

        if (productId && Dewora.storage) {
          Dewora.storage.updateCartQuantity(productId, val);
          if (Dewora.showToast) {
            Dewora.showToast('Updated quantity to ' + val, 'info');
          }
        }
      });

      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          input.blur();
        }
      });
    });

    // 3. Remove Item Buttons
    var removeBtns = root.querySelectorAll('.btn-remove-item');
    removeBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var productId = btn.getAttribute('data-product-id');
        var productName = btn.getAttribute('data-product-name') || 'Item';

        if (productId && Dewora.storage) {
          Dewora.storage.removeFromCart(productId);
          if (Dewora.showToast) {
            Dewora.showToast(productName + ' removed from your bag.', 'info');
          }
        }
      });
    });
  }

  return {
    init: init,
    render: render
  };
})();
