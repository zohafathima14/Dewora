/**
 * Dewora — Storage Utility Foundation
 * Specification: TRD.md Section 4
 * Manages localStorage persistence for cart and wishlist with robust error handling.
 */

window.Dewora = window.Dewora || {};

Dewora.storage = (function () {
  'use strict';

  var CART_KEY = 'dewora_cart_v1';
  var WISHLIST_KEY = 'dewora_wishlist_v1';

  var listeners = [];

  /**
   * Safe check for localStorage availability
   */
  function isStorageAvailable() {
    try {
      var testKey = '__dewora_test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }

  var available = isStorageAvailable();

  /**
   * Subscribe to cart/wishlist mutations
   */
  function subscribe(fn) {
    if (typeof fn === 'function') {
      listeners.push(fn);
    }
  }

  function notify(event, data) {
    listeners.forEach(function (fn) {
      try {
        fn(event, data);
      } catch (err) {
        console.error('Dewora storage listener error:', err);
      }
    });
  }

  /**
   * Retrieve cart items
   * Schema: [{ productId: string, quantity: number }]
   */
  function getCart() {
    if (!available) return [];
    try {
      var raw = window.localStorage.getItem(CART_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        var clean = [];
        var indexMap = {};
        parsed.forEach(function (item) {
          if (item && typeof item.productId === 'string' && typeof item.quantity === 'number' && item.quantity > 0) {
            if (indexMap.hasOwnProperty(item.productId)) {
              clean[indexMap[item.productId]].quantity += item.quantity;
            } else {
              indexMap[item.productId] = clean.length;
              clean.push({ productId: item.productId, quantity: item.quantity });
            }
          }
        });
        return clean;
      }
    } catch (e) {
      console.warn('Dewora: Failed to parse stored cart. Initializing fresh array.');
    }
    return [];
  }

  /**
   * Save cart items
   */
  function saveCart(cart) {
    if (!available) return;
    try {
      if (!Array.isArray(cart)) cart = [];
      window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
      notify('cart_updated', cart);
    } catch (e) {
      console.warn('Dewora: Could not save cart to localStorage.', e);
    }
  }

  /**
   * Add a product to the cart
   * @param {string} productId
   * @param {number} quantity
   */
  function addToCart(productId, quantity) {
    if (!productId) return;
    quantity = typeof quantity === 'number' && quantity > 0 ? quantity : 1;

    var cart = getCart();
    var existingIndex = -1;

    for (var i = 0; i < cart.length; i++) {
      if (cart[i].productId === productId) {
        existingIndex = i;
        break;
      }
    }

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({ productId: productId, quantity: quantity });
    }

    saveCart(cart);
    return cart;
  }

  /**
   * Update quantity of an item in the cart
   */
  function updateCartQuantity(productId, quantity) {
    if (!productId) return;
    var cart = getCart();

    if (quantity <= 0) {
      return removeFromCart(productId);
    }

    for (var i = 0; i < cart.length; i++) {
      if (cart[i].productId === productId) {
        cart[i].quantity = quantity;
        break;
      }
    }

    saveCart(cart);
    return cart;
  }

  /**
   * Remove an item from the cart
   */
  function removeFromCart(productId) {
    if (!productId) return;
    var cart = getCart().filter(function (item) {
      return item.productId !== productId;
    });
    saveCart(cart);
    return cart;
  }

  /**
   * Get total quantity of items in cart
   */
  function getCartCount() {
    var cart = getCart();
    return cart.reduce(function (sum, item) {
      return sum + (item.quantity || 0);
    }, 0);
  }

  /**
   * Get total subtotal in INR
   */
  function getCartSubtotal() {
    var cart = getCart();
    if (!Dewora.products || !Array.isArray(Dewora.products)) return 0;

    var productMap = {};
    Dewora.products.forEach(function (p) {
      productMap[p.id] = p;
    });

    return cart.reduce(function (total, item) {
      var prod = productMap[item.productId];
      if (prod && typeof prod.price === 'number') {
        return total + prod.price * item.quantity;
      }
      return total;
    }, 0);
  }

  /**
   * Retrieve wishlist product IDs
   * Schema: [ "productId1", "productId2" ]
   */
  function getWishlist() {
    if (!available) return [];
    try {
      var raw = window.localStorage.getItem(WISHLIST_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter(function (id) {
          return typeof id === 'string' && id.length > 0;
        });
      }
    } catch (e) {
      console.warn('Dewora: Failed to parse stored wishlist.');
    }
    return [];
  }

  /**
   * Save wishlist IDs
   */
  function saveWishlist(wishlist) {
    if (!available) return;
    try {
      if (!Array.isArray(wishlist)) wishlist = [];
      window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
      notify('wishlist_updated', wishlist);
    } catch (e) {
      console.warn('Dewora: Could not save wishlist to localStorage.', e);
    }
  }

  /**
   * Get total wishlist count
   */
  function getWishlistCount() {
    return getWishlist().length;
  }

  /**
   * Toggle wishlist status for a product ID
   */
  function toggleWishlist(productId) {
    if (!productId) return false;
    var list = getWishlist();
    var idx = list.indexOf(productId);
    var added = false;
    if (idx > -1) {
      list.splice(idx, 1);
    } else {
      list.push(productId);
      added = true;
    }
    saveWishlist(list);
    return added;
  }

  /**
   * Check if an item is in wishlist
   */
  function isInWishlist(productId) {
    return getWishlist().indexOf(productId) > -1;
  }

  return {
    isAvailable: available,
    getCart: getCart,
    saveCart: saveCart,
    addToCart: addToCart,
    updateCartQuantity: updateCartQuantity,
    removeFromCart: removeFromCart,
    getCartCount: getCartCount,
    getCartSubtotal: getCartSubtotal,
    getWishlist: getWishlist,
    saveWishlist: saveWishlist,
    getWishlistCount: getWishlistCount,
    toggleWishlist: toggleWishlist,
    isInWishlist: isInWishlist,
    subscribe: subscribe
  };
})();
