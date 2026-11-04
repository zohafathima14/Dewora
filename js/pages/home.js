/**
 * Dewora — Home Page Controller
 * Phase 3: Complete Homepage Development
 * Specification: PRD.md Section 7.1, DESIGN.md Section 6, TRD.md Section 6
 * Renders bestseller cards from shared products data and handles newsletter interactions.
 */

window.Dewora = window.Dewora || {};
Dewora.pages = Dewora.pages || {};

Dewora.pages.home = (function () {
  'use strict';

  function init() {
    renderBestsellers();
    initHomepageNewsletter();
    console.log('Dewora: Home page controller fully initialized.');
  }

  /**
   * Render Bestseller product cards from shared products dataset
   */
  function renderBestsellers() {
    var container = document.getElementById('bestsellers-grid');
    if (!container) return;

    if (!Dewora.products || !Array.isArray(Dewora.products)) {
      container.innerHTML = '<p class="text-muted">No products available at this time.</p>';
      return;
    }

    // Filter featured items or bestsellers, defaulting to first 4
    var bestsellers = Dewora.products.filter(function (p) {
      return p.featured === true || (p.badge && p.badge.toLowerCase() === 'bestseller');
    });

    if (bestsellers.length < 4) {
      bestsellers = Dewora.products.slice(0, 4);
    } else {
      bestsellers = bestsellers.slice(0, 4);
    }

    var cardsHtml = bestsellers.map(function (product) {
      if (Dewora.components && Dewora.components.productCard) {
        return Dewora.components.productCard.render(product);
      }
      return '';
    }).join('\n');

    container.innerHTML = cardsHtml;
  }

  /**
   * Standalone Homepage Newsletter Form Handling
   */
  function initHomepageNewsletter() {
    var form = document.getElementById('homepage-newsletter-form');
    var input = document.getElementById('homepage-newsletter-email');
    var feedback = document.getElementById('homepage-newsletter-feedback');

    if (!form || !input || !feedback) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = (input.value || '').trim();
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!email) {
        feedback.innerHTML = '<span class="form-error">Please enter your email address.</span>';
        input.focus();
        return;
      }

      if (!emailRegex.test(email)) {
        feedback.innerHTML = '<span class="form-error">Please enter a valid email format (e.g. name@example.com).</span>';
        input.focus();
        return;
      }

      // Valid demo submission: strictly client-side only (no transmission, no persistence)
      input.value = '';
      feedback.innerHTML = '<span style="color: var(--color-success); font-weight: 500;">✓ Thank you! You are subscribed to our demo ritual updates.</span>';

      if (Dewora.showToast) {
        Dewora.showToast('Thank you for subscribing to Dewora updates!', 'success');
      }
    });
  }

  return {
    init: init,
    renderBestsellers: renderBestsellers
  };
})();
