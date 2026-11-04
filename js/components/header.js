/**
 * Dewora — Shared Header Component
 * Phase 2: Design System & Shared UI Upgrade
 * Specification: DESIGN.md Section 5 & PRD.md Section 6
 * Renders announcement strip, refined navigation, search modal, dynamic badges, and scroll effects.
 */

window.Dewora = window.Dewora || {};
Dewora.components = Dewora.components || {};

Dewora.components.header = (function () {
  'use strict';

  var isSearchOpen = false;

  function render(containerId) {
    var target = document.getElementById(containerId || 'site-header');
    if (!target) return;

    var currentPath = window.location.pathname.split('/').pop() || 'index.html';
    var searchParams = new URLSearchParams(window.location.search);
    var currentCategory = searchParams.get('category');

    function isActive(page, category) {
      if (category) {
        return (currentPath === 'shop.html' && currentCategory === category) ? 'active' : '';
      }
      if (page === 'shop.html' && currentPath === 'shop.html' && !currentCategory) {
        return 'active';
      }
      return currentPath === page ? 'active' : '';
    }

    var html = [
      '<!-- Announcement Bar -->',
      '<div class="announcement-bar" role="region" aria-label="Announcement">',
      '  <span>A little glow goes a long way. Complimentary delivery across India on orders of ₹499 or more.</span>',
      '</div>',
      '',
      '<!-- Sticky Main Header -->',
      '<header class="site-header" id="main-header-bar">',
      '  <div class="container header-container">',
      '    <button class="menu-toggle-btn" id="menu-toggle-btn" aria-label="Open mobile navigation menu" aria-expanded="false" aria-controls="mobile-nav-drawer">',
      '      ' + Dewora.dom.getIcon('menu'),
      '    </button>',
      '',
      '    <a href="index.html" class="site-logo" aria-label="Dewora - Everyday Care Home">',
      '      Dewora<span class="logo-dot">.</span>',
      '    </a>',
      '',
      '    <nav class="main-nav" aria-label="Primary Navigation">',
      '      <ul class="nav-list">',
      '        <li><a href="index.html" class="nav-link ' + isActive('index.html') + '">Home</a></li>',
      '        <li><a href="shop.html" class="nav-link ' + isActive('shop.html') + '">Shop All</a></li>',
      '        <li><a href="shop.html?category=Skincare" class="nav-link ' + isActive('shop.html', 'Skincare') + '">Skincare</a></li>',
      '        <li><a href="shop.html?category=Sunscreen" class="nav-link ' + isActive('shop.html', 'Sunscreen') + '">Sunscreen</a></li>',
      '        <li><a href="shop.html?category=Moisturizers" class="nav-link ' + isActive('shop.html', 'Moisturizers') + '">Moisturizers</a></li>',
      '        <li><a href="shop.html?category=Cleansers" class="nav-link ' + isActive('shop.html', 'Cleansers') + '">Cleansers</a></li>',
      '        <li><a href="shop.html?category=Serums" class="nav-link ' + isActive('shop.html', 'Serums') + '">Serums</a></li>',
      '        <li><a href="about.html" class="nav-link ' + isActive('about.html') + '">About</a></li>',
      '      </ul>',
      '    </nav>',
      '',
      '    <div class="header-actions">',
      '      <button class="icon-btn" id="header-search-trigger" aria-label="Open search" aria-expanded="false" aria-controls="search-modal">',
      '        ' + Dewora.dom.getIcon('search'),
      '      </button>',
      '      <a href="wishlist.html" class="icon-btn" id="header-wishlist-btn" aria-label="View your saved wishlist">',
      '        ' + Dewora.dom.getIcon('heart'),
      '        <span class="badge-count" id="header-wishlist-count" data-count="0" aria-label="Items in wishlist">0</span>',
      '      </a>',
      '      <a href="cart.html" class="icon-btn" id="header-cart-btn" aria-label="View shopping bag">',
      '        ' + Dewora.dom.getIcon('bag'),
      '        <span class="badge-count" id="header-cart-count" data-count="0" aria-label="Items in cart">0</span>',
      '      </a>',
      '    </div>',
      '  </div>',
      '</header>',
      '',
      '<!-- Interactive Search Overlay Modal -->',
      '<div class="search-modal-backdrop" id="search-modal-backdrop" aria-hidden="true"></div>',
      '<div class="search-modal" id="search-modal" role="dialog" aria-modal="true" aria-label="Search Dewora Products" aria-hidden="true">',
      '  <div class="search-modal-inner">',
      '    <form class="search-form-row" id="header-search-form" action="shop.html" method="GET">',
      '      <span class="search-icon-inside">' + Dewora.dom.getIcon('search') + '</span>',
      '      <input type="search" name="q" id="header-search-input" class="search-input" placeholder="Search by name, ingredient (e.g. Niacinamide), or concern..." autocomplete="off">',
      '      <button type="button" class="search-close-btn" id="header-search-close" aria-label="Close search">',
      '        ' + Dewora.dom.getIcon('close'),
      '      </button>',
      '    </form>',
      '    <div class="search-suggestions">',
      '      <span class="search-suggestions-title">Quick Search:</span>',
      '      <a href="shop.html?q=Sunscreen" class="search-tag">Sunscreen</a>',
      '      <a href="shop.html?q=Niacinamide" class="search-tag">Niacinamide</a>',
      '      <a href="shop.html?q=Ceramide" class="search-tag">Ceramide</a>',
      '      <a href="shop.html?q=Hydration" class="search-tag">Hydration</a>',
      '      <a href="shop.html?q=Cleanser" class="search-tag">Cleanser</a>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('\n');

    target.innerHTML = html;

    // Attach search events & scroll effects
    initSearchModal();
    initScrollHeader();

    // Initial badge update
    updateBadges();

    // Subscribe to storage mutations
    if (Dewora.storage && Dewora.storage.subscribe) {
      Dewora.storage.subscribe(function () {
        updateBadges();
      });
    }
  }

  function initSearchModal() {
    var triggerBtn = document.getElementById('header-search-trigger');
    var modal = document.getElementById('search-modal');
    var backdrop = document.getElementById('search-modal-backdrop');
    var closeBtn = document.getElementById('header-search-close');
    var searchInput = document.getElementById('header-search-input');
    var form = document.getElementById('header-search-form');

    if (!triggerBtn || !modal || !backdrop) return;

    function openSearch() {
      isSearchOpen = true;
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      backdrop.classList.add('active');
      backdrop.setAttribute('aria-hidden', 'false');
      triggerBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      if (searchInput) {
        setTimeout(function () {
          searchInput.focus();
        }, 120);
      }
    }

    function closeSearch() {
      isSearchOpen = false;
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      backdrop.classList.remove('active');
      backdrop.setAttribute('aria-hidden', 'true');
      triggerBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      triggerBtn.focus();
    }

    triggerBtn.addEventListener('click', function (e) {
      e.preventDefault();
      openSearch();
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        closeSearch();
      });
    }

    backdrop.addEventListener('click', function () {
      closeSearch();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isSearchOpen) {
        closeSearch();
      }
    });

    if (form) {
      form.addEventListener('submit', function (e) {
        var val = (searchInput.value || '').trim();
        if (!val) {
          e.preventDefault();
          searchInput.focus();
        }
      });
    }
  }

  function initScrollHeader() {
    var headerEl = document.getElementById('main-header-bar');
    if (!headerEl) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 20) {
        headerEl.classList.add('scrolled');
      } else {
        headerEl.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  function updateBadges() {
    var cartBadge = document.getElementById('header-cart-count');
    var wishlistBadge = document.getElementById('header-wishlist-count');

    if (cartBadge && Dewora.storage) {
      var cartCount = Dewora.storage.getCartCount();
      cartBadge.textContent = cartCount;
      cartBadge.setAttribute('data-count', cartCount);
      cartBadge.style.display = cartCount > 0 ? 'inline-flex' : 'none';
    }

    if (wishlistBadge && Dewora.storage) {
      var wishCount = Dewora.storage.getWishlistCount();
      wishlistBadge.textContent = wishCount;
      wishlistBadge.setAttribute('data-count', wishCount);
      wishlistBadge.style.display = wishCount > 0 ? 'inline-flex' : 'none';
    }
  }

  return {
    render: render,
    updateBadges: updateBadges
  };
})();
