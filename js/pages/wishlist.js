/**
 * Dewora — Wishlist Page Controller
 * Specification: TRD.md Section 6.1, PRD.md Section 7.6 & DESIGN.md Section 7
 * Renders saved items, enables add-to-bag, remove, move-all-to-bag,
 * and displays responsive empty states.
 */

window.Dewora = window.Dewora || {};
Dewora.pages = Dewora.pages || {};

Dewora.pages.wishlist = (function () {
  'use strict';

  /**
   * Initialize Wishlist Page
   */
  function init() {
    var root = document.getElementById('wishlist-root');
    if (!root) {
      console.warn('Dewora: Wishlist root element (#wishlist-root) not found.');
      return;
    }

    render();

    // Re-render when wishlist changes in storage
    if (Dewora.storage && typeof Dewora.storage.subscribe === 'function') {
      Dewora.storage.subscribe(function (event) {
        if (event === 'wishlist_updated') {
          render();
        }
      });
    }

    console.log('Dewora: Wishlist page controller active.');
  }

  /**
   * Main Render Dispatcher
   */
  function render() {
    var root = document.getElementById('wishlist-root');
    if (!root) return;

    var wishlistIds = (Dewora.storage ? Dewora.storage.getWishlist() : []) || [];
    var resolvedProducts = [];

    // Map stored product IDs to product dataset
    if (Dewora.products && Array.isArray(Dewora.products)) {
      var prodMap = {};
      Dewora.products.forEach(function (p) {
        prodMap[p.id] = p;
      });

      wishlistIds.forEach(function (id) {
        var product = prodMap[id];
        if (product) {
          resolvedProducts.push(product);
        }
      });
    }

    if (resolvedProducts.length === 0) {
      renderEmptyState(root);
    } else {
      renderWishlistView(root, resolvedProducts);
    }
  }

  /**
   * Render Empty Wishlist State
   */
  function renderEmptyState(root) {
    var html = [
      '<nav class="wishlist-breadcrumb" aria-label="Breadcrumb">',
      '  <a href="index.html">Home</a>',
      '  <span class="wishlist-breadcrumb-separator" aria-hidden="true">/</span>',
      '  <span>Wishlist</span>',
      '</nav>',
      '<div class="wishlist-empty-container">',
      '  <div class="wishlist-empty-icon" aria-hidden="true">',
      '    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">',
      '      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>',
      '    </svg>',
      '  </div>',
      '  <h1 class="wishlist-empty-title">Your Wishlist is Empty</h1>',
      '  <p class="wishlist-empty-desc">Your curated routine is waiting to begin. Browse our mindful formulations and tap the heart icon to save products here.</p>',
      '  <a href="shop.html" class="btn btn-primary" style="padding: 0.85rem 2rem;">Explore Skincare</a>',
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
   * Render Populated Wishlist Grid
   */
  function renderWishlistView(root, products) {
    var count = products.length;

    // 1. Breadcrumbs & Header
    var breadcrumbHtml = [
      '<nav class="wishlist-breadcrumb" aria-label="Breadcrumb">',
      '  <a href="index.html">Home</a>',
      '  <span class="wishlist-breadcrumb-separator" aria-hidden="true">/</span>',
      '  <span>Wishlist</span>',
      '</nav>',
      '<div class="wishlist-header-row">',
      '  <div>',
      '    <h1 class="wishlist-title">Your Skincare Wishlist</h1>',
      '    <p class="wishlist-subtitle">Your curated skincare picks. Ready whenever your routine is.</p>',
      '  </div>',
      '  <div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">',
      '    <button type="button" id="btn-move-all-cart" class="btn btn-secondary" style="font-size: 0.85rem; padding: 0.6rem 1.1rem;">Move all to Bag</button>',
      '    <a href="shop.html" class="cart-continue-link" style="font-weight: 500;">+ Discover more</a>',
      '  </div>',
      '</div>'
    ].join('\n');

    // 2. Actions Bar
    var actionsBarHtml = [
      '<div class="wishlist-actions-bar">',
      '  <span class="wishlist-count-badge">Showing <strong>' + count + '</strong> ' + (count === 1 ? 'saved item' : 'saved items') + '</span>',
      '  <button type="button" id="btn-clear-wishlist" style="background: none; border: none; font-size: 0.825rem; color: var(--color-muted); cursor: pointer; text-decoration: underline;">Clear wishlist</button>',
      '</div>'
    ].join('\n');

    // 3. Product Cards Grid
    var cardsHtml = products.map(function (product) {
      if (Dewora.components && Dewora.components.productCard) {
        return Dewora.components.productCard.render(product);
      }
      return '';
    }).join('\n');

    var gridHtml = '<div class="product-grid">' + cardsHtml + '</div>';

    root.innerHTML = [
      breadcrumbHtml,
      actionsBarHtml,
      gridHtml
    ].join('\n');

    // Attach Wishlist Page Specific Events
    attachWishlistEvents(root, products);
  }

  /**
   * Attach Wishlist Page Handlers
   */
  function attachWishlistEvents(root, products) {
    // 1. Move All to Bag
    var moveAllBtn = root.querySelector('#btn-move-all-cart');
    if (moveAllBtn) {
      moveAllBtn.addEventListener('click', function () {
        if (!Dewora.storage || products.length === 0) return;

        var cart = Dewora.storage.getCart();
        var cartMap = {};
        for (var i = 0; i < cart.length; i++) {
          cartMap[cart[i].productId] = i;
        }

        products.forEach(function (p) {
          if (cartMap.hasOwnProperty(p.id)) {
            // Item already exists in cart: increment quantity, avoid duplicate line items
            cart[cartMap[p.id]].quantity += 1;
          } else {
            // New line item
            cartMap[p.id] = cart.length;
            cart.push({ productId: p.id, quantity: 1 });
          }
        });

        Dewora.storage.saveCart(cart);

        if (Dewora.showToast) {
          Dewora.showToast('All ' + products.length + ' items added to your bag!', 'success');
        }
      });
    }

    // 2. Clear Wishlist
    var clearBtn = root.querySelector('#btn-clear-wishlist');
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        if (Dewora.storage) {
          Dewora.storage.saveWishlist([]);
          if (Dewora.showToast) {
            Dewora.showToast('Wishlist cleared.', 'info');
          }
        }
      });
    }
  }

  return {
    init: init,
    render: render
  };
})();
