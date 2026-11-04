/**
 * Dewora — Product Card Component Foundation
 * Specification: TRD.md Section 6.1 & DESIGN.md Section 7
 * Standardized, accessible product card renderer.
 */

window.Dewora = window.Dewora || {};
Dewora.components = Dewora.components || {};

Dewora.components.productCard = (function () {
  'use strict';

  /**
   * Render a product card HTML string
   * @param {Object} product - Product data object
   * @returns {string} Product card HTML string
   */
  function render(product) {
    if (!product || !product.id) return '';

    var isWishlisted = Dewora.storage && Dewora.storage.isInWishlist(product.id);
    var formattedPrice = Dewora.currency ? Dewora.currency.formatINR(product.price) : '₹' + product.price;
    var formattedCompare = product.compareAtPrice && Dewora.currency ? Dewora.currency.formatINR(product.compareAtPrice) : '';

    var badgeHtml = product.badge
      ? '<span class="product-badge ' + (product.badge.toLowerCase() === 'sale' ? 'sale' : '') + '">' + Dewora.dom.escapeHTML(product.badge) + '</span>'
      : '';

    var compareHtml = formattedCompare
      ? '<span class="product-compare-price">' + formattedCompare + '</span>'
      : '';

    return [
      '<article class="product-card" data-product-id="' + Dewora.dom.escapeHTML(product.id) + '">',
      '  <div class="product-card-media">',
      '    ' + badgeHtml,
      '    <button class="product-wishlist-btn ' + (isWishlisted ? 'active' : '') + '" ',
      '            data-product-id="' + Dewora.dom.escapeHTML(product.id) + '" ',
      '            aria-label="' + (isWishlisted ? 'Remove from wishlist' : 'Add to wishlist') + '" ',
      '            title="Wishlist">',
      '      ' + Dewora.dom.getIcon('heart'),
      '    </button>',
      '    <a href="product.html?id=' + encodeURIComponent(product.id) + '" aria-label="' + Dewora.dom.escapeHTML(product.name) + '">',
      '      <img class="product-card-image" ',
      '           src="' + Dewora.dom.escapeHTML(product.image) + '" ',
      '           alt="' + Dewora.dom.escapeHTML(product.name) + '" ',
      '           width="400" ',
      '           height="500" ',
      '           loading="lazy" ',
      '           onerror="this.onerror=null;this.src=\'assets/images/products/placeholder-skincare.svg\';">',
      '    </a>',
      '  </div>',
      '  <div class="product-card-content">',
      '    <span class="product-card-category">' + Dewora.dom.escapeHTML(product.category) + '</span>',
      '    <h3 class="product-card-title">',
      '      <a href="product.html?id=' + encodeURIComponent(product.id) + '">' + Dewora.dom.escapeHTML(product.name) + '</a>',
      '    </h3>',
      '    <span class="product-card-size">' + Dewora.dom.escapeHTML(product.size || '') + '</span>',
      '    <div class="product-card-rating" aria-label="Demo rating: ' + product.rating + ' out of 5 stars">',
      '      <span class="star-icon">★</span>',
      '      <span>' + product.rating.toFixed(1) + '</span>',
      '      <span class="text-caption">(' + product.reviewCount + ')</span>',
      '    </div>',
      '    <div class="product-card-price-row">',
      '      <span class="product-price">' + formattedPrice + '</span>',
      '      ' + compareHtml,
      '    </div>',
      '    <button class="btn btn-primary add-to-cart-btn" data-product-id="' + Dewora.dom.escapeHTML(product.id) + '">',
      '      Add to Cart',
      '    </button>',
      '  </div>',
      '</article>'
    ].join('\n');
  }

  return {
    render: render
  };
})();
