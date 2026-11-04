/**
 * Dewora — Mobile Menu Component
 * Phase 2: Design System & Shared UI Upgrade
 * Specification: TRD.md Section 6.7 & DESIGN.md Section 5
 * Accessible slide-out navigation drawer with focus management and ESC support.
 */

window.Dewora = window.Dewora || {};
Dewora.components = Dewora.components || {};

Dewora.components.mobileMenu = (function () {
  'use strict';

  var drawerEl = null;
  var backdropEl = null;
  var toggleBtn = null;
  var isOpen = false;

  function init() {
    toggleBtn = document.getElementById('menu-toggle-btn');
    if (!toggleBtn) return;

    // Check if drawer markup exists or inject it
    drawerEl = document.getElementById('mobile-nav-drawer');
    backdropEl = document.getElementById('mobile-nav-backdrop');

    if (!drawerEl) {
      createDrawerMarkup();
    }

    bindEvents();
  }

  function createDrawerMarkup() {
    backdropEl = document.createElement('div');
    backdropEl.id = 'mobile-nav-backdrop';
    backdropEl.className = 'mobile-nav-backdrop';
    backdropEl.setAttribute('aria-hidden', 'true');
    document.body.appendChild(backdropEl);

    drawerEl = document.createElement('aside');
    drawerEl.id = 'mobile-nav-drawer';
    drawerEl.className = 'mobile-nav-drawer';
    drawerEl.setAttribute('aria-label', 'Mobile Navigation Drawer');
    drawerEl.setAttribute('aria-hidden', 'true');

    var currentPath = window.location.pathname.split('/').pop() || 'index.html';
    var searchParams = new URLSearchParams(window.location.search);
    var currentCategory = searchParams.get('category');

    function isMobileActive(page, category) {
      if (category) {
        return (currentPath === 'shop.html' && currentCategory === category) ? 'active' : '';
      }
      if (page === 'shop.html' && currentPath === 'shop.html' && !currentCategory) {
        return 'active';
      }
      return currentPath === page ? 'active' : '';
    }

    drawerEl.innerHTML = [
      '<div class="mobile-nav-header">',
      '  <a href="index.html" class="site-logo">Dewora<span class="logo-dot">.</span></a>',
      '  <button class="icon-btn" id="mobile-menu-close" aria-label="Close menu">',
      '    ' + Dewora.dom.getIcon('close'),
      '  </button>',
      '</div>',
      '<ul class="mobile-nav-list">',
      '  <li><a href="index.html" class="mobile-nav-link ' + isMobileActive('index.html') + '">Home</a></li>',
      '  <li><a href="shop.html" class="mobile-nav-link ' + isMobileActive('shop.html') + '">Shop All Products</a></li>',
      '  <li><a href="shop.html?category=Skincare" class="mobile-nav-link ' + isMobileActive('shop.html', 'Skincare') + '">Skincare Essentials</a></li>',
      '  <li><a href="shop.html?category=Sunscreen" class="mobile-nav-link ' + isMobileActive('shop.html', 'Sunscreen') + '">Sunscreen</a></li>',
      '  <li><a href="shop.html?category=Moisturizers" class="mobile-nav-link ' + isMobileActive('shop.html', 'Moisturizers') + '">Moisturizers</a></li>',
      '  <li><a href="shop.html?category=Cleansers" class="mobile-nav-link ' + isMobileActive('shop.html', 'Cleansers') + '">Cleansers</a></li>',
      '  <li><a href="shop.html?category=Serums" class="mobile-nav-link ' + isMobileActive('shop.html', 'Serums') + '">Serums</a></li>',
      '  <li><a href="shop.html?category=Body+Care" class="mobile-nav-link ' + isMobileActive('shop.html', 'Body Care') + '">Body Care</a></li>',
      '  <li><a href="about.html" class="mobile-nav-link ' + isMobileActive('about.html') + '">About Us</a></li>',
      '  <li><a href="faq.html" class="mobile-nav-link ' + isMobileActive('faq.html') + '">FAQs & Help</a></li>',
      '  <li><a href="wishlist.html" class="mobile-nav-link ' + isMobileActive('wishlist.html') + '">Wishlist</a></li>',
      '  <li><a href="cart.html" class="mobile-nav-link ' + isMobileActive('cart.html') + '">Shopping Bag</a></li>',
      '</ul>',
      '<div class="mobile-nav-footer">',
      '  <p class="text-caption">Everyday care. Naturally you.<br>Free delivery on orders of ₹499 or more.</p>',
      '</div>'
    ].join('\n');

    document.body.appendChild(drawerEl);
  }

  function bindEvents() {
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function () {
        toggleMenu();
      });
    }

    if (backdropEl) {
      backdropEl.addEventListener('click', function () {
        closeMenu();
      });
    }

    var closeBtn = document.getElementById('mobile-menu-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        closeMenu();
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) {
        closeMenu();
      }
    });

    if (drawerEl) {
      var links = drawerEl.querySelectorAll('a');
      links.forEach(function (link) {
        link.addEventListener('click', function () {
          closeMenu();
        });
      });
    }
  }

  function toggleMenu() {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function openMenu() {
    isOpen = true;
    if (drawerEl) {
      drawerEl.classList.add('active');
      drawerEl.setAttribute('aria-hidden', 'false');
    }
    if (backdropEl) {
      backdropEl.classList.add('active');
      backdropEl.setAttribute('aria-hidden', 'false');
    }
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-expanded', 'true');
    }
    document.body.style.overflow = 'hidden';

    var closeBtn = document.getElementById('mobile-menu-close');
    if (closeBtn) {
      closeBtn.focus();
    }
  }

  function closeMenu() {
    isOpen = false;
    if (drawerEl) {
      drawerEl.classList.remove('active');
      drawerEl.setAttribute('aria-hidden', 'true');
    }
    if (backdropEl) {
      backdropEl.classList.remove('active');
      backdropEl.setAttribute('aria-hidden', 'true');
    }
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.focus();
    }
    document.body.style.overflow = '';
  }

  return {
    init: init,
    open: openMenu,
    close: closeMenu
  };
})();
