/**
 * Dewora — Shared Footer Component
 * Phase 2: Design System & Shared UI Upgrade
 * Specification: DESIGN.md Section 6 & PRD.md Section 7
 * Renders brand description, categorized navigation, demo newsletter form, and honest demo disclaimers.
 */

window.Dewora = window.Dewora || {};
Dewora.components = Dewora.components || {};

Dewora.components.footer = (function () {
  'use strict';

  function render(containerId) {
    var target = document.getElementById(containerId || 'site-footer');
    if (!target) return;

    var currentYear = new Date().getFullYear();

    var html = [
      '<footer class="site-footer" role="contentinfo">',
      '  <div class="container footer-top">',
      '    <div class="footer-grid">',
      '      <div class="footer-brand">',
      '        <a href="index.html" class="brand-logo">Dewora<span class="logo-dot">.</span></a>',
      '        <p class="footer-tagline">Everyday care. Naturally you. Mindful, barrier-loving skincare rituals formulated for healthy, radiant skin every single day.</p>',
      '        <div class="demo-disclaimer" role="note">',
      '          <strong>Demo Notice:</strong> Dewora is a frontend e-commerce demonstration. All products, prices, and reviews are fictional. No real payments, orders, or personal data collection occur.',
      '        </div>',
      '      </div>',
      '',
      '      <div class="footer-col">',
      '        <h2 class="footer-heading">Shop By Category</h2>',
      '        <ul class="footer-links">',
      '          <li><a href="shop.html">Shop All Products</a></li>',
      '          <li><a href="shop.html?category=Skincare">Skincare Essentials</a></li>',
      '          <li><a href="shop.html?category=Sunscreen">Sun Protection</a></li>',
      '          <li><a href="shop.html?category=Moisturizers">Moisturizers</a></li>',
      '          <li><a href="shop.html?category=Cleansers">Cleansers</a></li>',
      '          <li><a href="shop.html?category=Serums">Targeted Serums</a></li>',
      '          <li><a href="shop.html?category=Body+Care">Body Care</a></li>',
      '        </ul>',
      '      </div>',
      '',
      '      <div class="footer-col">',
      '        <h2 class="footer-heading">Help & Information</h2>',
      '        <ul class="footer-links">',
      '          <li><a href="about.html">Our Brand Story</a></li>',
      '          <li><a href="faq.html">Frequently Asked Questions</a></li>',
      '          <li><a href="faq.html#routine">Routine Finder Guide</a></li>',
      '          <li><a href="faq.html#shipping">Shipping & Delivery (Demo)</a></li>',
      '          <li><a href="faq.html#privacy">Privacy & Terms (Demo)</a></li>',
      '          <li><a href="wishlist.html">Your Saved Wishlist</a></li>',
      '        </ul>',
      '      </div>',
      '',
      '      <div class="footer-col footer-newsletter">',
      '        <h2 class="footer-heading">Join the Dewora Circle</h2>',
      '        <p>Subscribe for gentle ritual tips, seasonal skincare updates, and demo offer previews.</p>',
      '        <form class="newsletter-form" id="footer-newsletter-form" novalidate>',
      '          <input type="email" id="newsletter-email" class="newsletter-input" placeholder="Enter your email address" aria-label="Email address for newsletter" required>',
      '          <button type="submit" class="btn btn-primary newsletter-btn">Subscribe</button>',
      '        </form>',
      '        <div id="newsletter-feedback" class="newsletter-feedback" aria-live="polite"></div>',
      '      </div>',
      '    </div>',
      '  </div>',
      '',
      '  <div class="footer-bottom">',
      '    <div class="container footer-bottom-inner">',
      '      <p>&copy; ' + currentYear + ' Dewora Skincare. All rights reserved. Built with pure HTML, CSS & Vanilla JS.</p>',
      '      <p class="text-caption">Prices shown in Indian Rupees (₹). Simulated transaction experience.</p>',
      '    </div>',
      '  </div>',
      '</footer>'
    ].join('\n');

    target.innerHTML = html;

    initNewsletter();
  }

  function initNewsletter() {
    var form = document.getElementById('footer-newsletter-form');
    var input = document.getElementById('newsletter-email');
    var feedback = document.getElementById('newsletter-feedback');

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

      // Successful demo submission (Strictly client-side only: no data saved or sent)
      input.value = '';
      feedback.innerHTML = '<span style="color: var(--color-success); font-weight: 500;">Thank you! You are on our demo newsletter list.</span>';
      
      if (Dewora.showToast) {
        Dewora.showToast('Thank you for subscribing to Dewora updates!', 'success');
      }
    });
  }

  return {
    render: render
  };
})();
