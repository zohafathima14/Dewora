/**
 * Dewora — Application Bootstrap & Orchestrator
 * Specification: TRD.md Section 2
 * Mounts shared header, footer, mobile drawer, accordions, and dispatches to page controllers.
 */

window.Dewora = window.Dewora || {};

Dewora.app = (function () {
  'use strict';

  function init() {
    // 1. Mount shared Header & Footer
    if (Dewora.components && Dewora.components.header) {
      Dewora.components.header.render('site-header');
    }

    if (Dewora.components && Dewora.components.footer) {
      Dewora.components.footer.render('site-footer');
    }

    // 2. Initialize Mobile Navigation Drawer
    if (Dewora.components && Dewora.components.mobileMenu) {
      Dewora.components.mobileMenu.init();
    }

    // 3. Initialize Shared Accordions
    if (Dewora.components && Dewora.components.accordion) {
      Dewora.components.accordion.init();
    }

    // 4. Dispatch to specific page controller based on body data-page attribute
    var pageId = document.body.getAttribute('data-page');
    if (pageId && Dewora.pages && Dewora.pages[pageId] && typeof Dewora.pages[pageId].init === 'function') {
      Dewora.pages[pageId].init();
    }

    // 5. Global delegation for common quick-actions (e.g. wishlist & add-to-cart on cards)
    initGlobalDelegation();

    console.log('Dewora: Application initialized successfully. Page:', pageId || 'general');
  }

  function initGlobalDelegation() {
    document.addEventListener('click', function (e) {
      // Global Wishlist Button Delegation
      var wishlistBtn = e.target.closest('.product-wishlist-btn');
      if (wishlistBtn) {
        e.preventDefault();
        var wishId = wishlistBtn.getAttribute('data-product-id');
        if (wishId && Dewora.storage) {
          var added = Dewora.storage.toggleWishlist(wishId);
          wishlistBtn.classList.toggle('active', added);
          wishlistBtn.setAttribute('aria-label', added ? 'Remove from wishlist' : 'Add to wishlist');
          if (Dewora.showToast) {
            Dewora.showToast(added ? 'Saved to your wishlist' : 'Removed from wishlist', 'info');
          }
        }
        return;
      }

      // Global Add to Cart Button Delegation
      var cartBtn = e.target.closest('.add-to-cart-btn');
      if (cartBtn) {
        e.preventDefault();
        var cartId = cartBtn.getAttribute('data-product-id');
        if (cartId && Dewora.storage) {
          Dewora.storage.addToCart(cartId, 1);

          // Find product name for friendly feedback
          var productName = 'Item';
          if (Dewora.products) {
            var found = Dewora.products.find(function (p) { return p.id === cartId; });
            if (found && found.name) productName = found.name;
          }

          // Button feedback state
          var originalText = cartBtn.textContent;
          cartBtn.textContent = 'Added ✓';
          cartBtn.disabled = true;

          setTimeout(function () {
            cartBtn.textContent = originalText;
            cartBtn.disabled = false;
          }, 1200);

          if (Dewora.showToast) {
            Dewora.showToast(productName + ' added to your bag!', 'success');
          }
        }
        return;
      }
    });
  }

  return {
    init: init
  };
})();

// Automatic DOM Ready execution
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', Dewora.app.init);
} else {
  Dewora.app.init();
}
