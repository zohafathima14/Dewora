/**
 * Dewora — Checkout Page Controller (Phase 7: Checkout & Simulated Order Flow)
 * Specification: PRD.md Section 7.5, TRD.md Section 6.5 & DESIGN.md
 * Handles customer & delivery address validation, INR whole-amount order summary,
 * ₹499 free delivery threshold, double-click protection, simulated order placement,
 * and zero customer data persistence.
 */

window.Dewora = window.Dewora || {};
Dewora.pages = Dewora.pages || {};

Dewora.pages.checkout = (function () {
  'use strict';

  var FREE_SHIPPING_THRESHOLD = 499;
  var isSubmitting = false;

  var INDIAN_STATES = [
    'Andaman and Nicobar Islands',
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chandigarh',
    'Chhattisgarh',
    'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jammu and Kashmir',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Ladakh',
    'Lakshadweep',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Puducherry',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal'
  ];

  /**
   * Initialize Checkout Page
   */
  function init() {
    var root = document.getElementById('checkout-root');
    if (!root) {
      console.warn('Dewora: Checkout root element (#checkout-root) not found.');
      return;
    }

    render();

    // Re-render when cart changes in storage (unless actively submitting/confirmed)
    if (Dewora.storage && typeof Dewora.storage.subscribe === 'function') {
      Dewora.storage.subscribe(function (event) {
        if (event === 'cart_updated' && !isSubmitting) {
          var confirmHero = document.querySelector('.checkout-confirm-hero');
          if (!confirmHero) {
            render();
          }
        }
      });
    }

    console.log('Dewora: Checkout page controller initialized.');
  }

  /**
   * Resolve cart items with product catalogue
   */
  function getResolvedCartItems() {
    var cartItems = (Dewora.storage ? Dewora.storage.getCart() : []) || [];
    var resolvedItems = [];

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

    return resolvedItems;
  }

  /**
   * Main Render Dispatcher
   */
  function render() {
    var root = document.getElementById('checkout-root');
    if (!root) return;

    var resolvedItems = getResolvedCartItems();

    if (resolvedItems.length === 0) {
      renderEmptyState(root);
    } else {
      renderCheckoutForm(root, resolvedItems);
    }
  }

  /**
   * Render Empty State
   */
  function renderEmptyState(root) {
    root.innerHTML = [
      '<div class="checkout-empty-box">',
      '  <div class="checkout-empty-icon" aria-hidden="true">',
      '    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">',
      '      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>',
      '      <line x1="3" y1="6" x2="21" y2="6"></line>',
      '      <path d="M16 10a4 4 0 0 1-8 0"></path>',
      '    </svg>',
      '  </div>',
      '  <h1 class="checkout-empty-title">Your Bag is Empty</h1>',
      '  <p class="checkout-empty-desc">You do not have any items in your bag to checkout. Explore our gentle skincare catalogue to start your daily routine.</p>',
      '  <a href="shop.html" class="btn btn-primary" style="padding: 0.85rem 2rem;">Discover Skincare</a>',
      '</div>'
    ].join('\n');
  }

  /**
   * Render Checkout Form & Order Summary
   */
  function renderCheckoutForm(root, resolvedItems) {
    var formatINR = Dewora.currency ? Dewora.currency.formatINR : function (n) { return '₹' + n; };
    var escapeHTML = Dewora.dom ? Dewora.dom.escapeHTML : function (s) { return s; };

    var subtotal = 0;
    var totalItemCount = 0;
    resolvedItems.forEach(function (ri) {
      subtotal += ri.product.price * ri.item.quantity;
      totalItemCount += ri.item.quantity;
    });

    var isFreeDelivery = subtotal >= FREE_SHIPPING_THRESHOLD;
    var total = subtotal; // Strictly equals subtotal, no unapproved delivery fees

    // Step tracker
    var stepTrackerHtml = [
      '<nav class="checkout-steps-tracker" aria-label="Checkout Progress">',
      '  <a href="cart.html" class="checkout-step-item is-completed" aria-label="Step 1: Bag (Completed)">',
      '    <span class="checkout-step-num" aria-hidden="true">✓</span>',
      '    <span>Bag</span>',
      '  </a>',
      '  <div class="checkout-step-divider" aria-hidden="true"></div>',
      '  <div class="checkout-step-item is-active" aria-current="step">',
      '    <span class="checkout-step-num">2</span>',
      '    <span>Delivery Details</span>',
      '  </div>',
      '  <div class="checkout-step-divider" aria-hidden="true"></div>',
      '  <div class="checkout-step-item">',
      '    <span class="checkout-step-num">3</span>',
      '    <span>Confirmation</span>',
      '  </div>',
      '</nav>'
    ].join('\n');

    // Demo notification banner
    var demoBannerHtml = [
      '<div class="checkout-demo-banner" role="region" aria-label="Demo Checkout Notice">',
      '  <div class="checkout-demo-banner-icon" aria-hidden="true">',
      '    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">',
      '      <circle cx="12" cy="12" r="10"></circle>',
      '      <line x1="12" y1="8" x2="12" y2="12"></line>',
      '      <line x1="12" y1="16" x2="12.01" y2="16"></line>',
      '    </svg>',
      '  </div>',
      '  <div>',
      '    <h2 class="checkout-demo-banner-title">Frontend Demonstration Checkout</h2>',
      '    <p class="checkout-demo-banner-text">This is a simulated demo checkout. No actual payment, credit card details, or banking information will ever be requested or processed. Customer details are handled strictly in memory and never saved to browser storage.</p>',
      '  </div>',
      '</div>'
    ].join('\n');

    // State options
    var stateOptionsHtml = '<option value="">Select State / UT</option>';
    INDIAN_STATES.forEach(function (st) {
      stateOptionsHtml += '<option value="' + escapeHTML(st) + '">' + escapeHTML(st) + '</option>';
    });

    // Form markup
    var formHtml = [
      '<form id="checkout-form" class="checkout-form" novalidate>',
      '  <!-- Customer Contact Card -->',
      '  <div class="checkout-card">',
      '    <div class="checkout-card-header">',
      '      <h2 class="checkout-card-title">',
      '        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
      '        1. Customer Information',
      '      </h2>',
      '      <span class="checkout-card-badge">Step 1 of 2</span>',
      '    </div>',
      '    <div class="checkout-form-grid">',
      '      <div class="checkout-form-group full-width">',
      '        <label for="checkout-fullname" class="checkout-label">',
      '          <span>Full Name <span class="required-mark" aria-hidden="true">*</span></span>',
      '        </label>',
      '        <input type="text" id="checkout-fullname" name="fullName" class="checkout-input" placeholder="e.g. Ananya Sharma" autocomplete="name" required aria-required="true" aria-describedby="checkout-fullname-error">',
      '        <div class="checkout-error-msg" id="checkout-fullname-error" role="alert">Please enter your full name.</div>',
      '      </div>',
      '      <div class="checkout-form-group">',
      '        <label for="checkout-email" class="checkout-label">',
      '          <span>Email Address <span class="required-mark" aria-hidden="true">*</span></span>',
      '        </label>',
      '        <input type="email" id="checkout-email" name="email" class="checkout-input" placeholder="name@example.com" autocomplete="email" required aria-required="true" aria-describedby="checkout-email-error">',
      '        <div class="checkout-error-msg" id="checkout-email-error" role="alert">Please enter a valid email address.</div>',
      '      </div>',
      '      <div class="checkout-form-group">',
      '        <label for="checkout-phone" class="checkout-label">',
      '          <span>Mobile Number <span class="required-mark" aria-hidden="true">*</span></span>',
      '        </label>',
      '        <input type="tel" id="checkout-phone" name="phone" class="checkout-input" placeholder="e.g. 9876543210 or +91 98765 43210" autocomplete="tel" required aria-required="true" aria-describedby="checkout-phone-error">',
      '        <div class="checkout-error-msg" id="checkout-phone-error" role="alert">Please enter a valid 10-digit Indian mobile number.</div>',
      '        <span class="checkout-helper-text">Accepts 10 digits starting with 6-9, with optional +91.</span>',
      '      </div>',
      '    </div>',
      '  </div>',
      '',
      '  <!-- Delivery Address Card -->',
      '  <div class="checkout-card">',
      '    <div class="checkout-card-header">',
      '      <h2 class="checkout-card-title">',
      '        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
      '        2. Delivery Address',
      '      </h2>',
      '      <span class="checkout-card-badge">Step 2 of 2</span>',
      '    </div>',
      '    <div class="checkout-form-grid">',
      '      <div class="checkout-form-group full-width">',
      '        <label for="checkout-address1" class="checkout-label">',
      '          <span>Flat, House No., Building, Apartment <span class="required-mark" aria-hidden="true">*</span></span>',
      '        </label>',
      '        <input type="text" id="checkout-address1" name="addressLine1" class="checkout-input" placeholder="e.g. Flat 402, Lotus Residency" autocomplete="address-line1" required aria-required="true" aria-describedby="checkout-address1-error">',
      '        <div class="checkout-error-msg" id="checkout-address1-error" role="alert">Please enter your house or building details.</div>',
      '      </div>',
      '      <div class="checkout-form-group full-width">',
      '        <label for="checkout-address2" class="checkout-label">',
      '          <span>Street, Area, Sector, Locality <span class="required-mark" aria-hidden="true">*</span></span>',
      '        </label>',
      '        <input type="text" id="checkout-address2" name="addressLine2" class="checkout-input" placeholder="e.g. 14th Main, Indiranagar" autocomplete="address-line2" required aria-required="true" aria-describedby="checkout-address2-error">',
      '        <div class="checkout-error-msg" id="checkout-address2-error" role="alert">Please enter your street or area details.</div>',
      '      </div>',
      '      <div class="checkout-form-group full-width">',
      '        <label for="checkout-landmark" class="checkout-label">',
      '          <span>Landmark</span>',
      '          <span class="optional-mark">Optional</span>',
      '        </label>',
      '        <input type="text" id="checkout-landmark" name="landmark" class="checkout-input" placeholder="e.g. Near Metro Station / Behind Central Park">',
      '      </div>',
      '      <div class="checkout-form-group">',
      '        <label for="checkout-city" class="checkout-label">',
      '          <span>Town / City <span class="required-mark" aria-hidden="true">*</span></span>',
      '        </label>',
      '        <input type="text" id="checkout-city" name="city" class="checkout-input" placeholder="e.g. Bengaluru" autocomplete="address-level2" required aria-required="true" aria-describedby="checkout-city-error">',
      '        <div class="checkout-error-msg" id="checkout-city-error" role="alert">Please enter your city.</div>',
      '      </div>',
      '      <div class="checkout-form-group">',
      '        <label for="checkout-state" class="checkout-label">',
      '          <span>State / Union Territory <span class="required-mark" aria-hidden="true">*</span></span>',
      '        </label>',
      '        <select id="checkout-state" name="state" class="checkout-select" autocomplete="address-level1" required aria-required="true" aria-describedby="checkout-state-error">',
      stateOptionsHtml,
      '        </select>',
      '        <div class="checkout-error-msg" id="checkout-state-error" role="alert">Please select your state or union territory.</div>',
      '      </div>',
      '      <div class="checkout-form-group">',
      '        <label for="checkout-pincode" class="checkout-label">',
      '          <span>PIN Code (6 digits) <span class="required-mark" aria-hidden="true">*</span></span>',
      '        </label>',
      '        <input type="text" id="checkout-pincode" name="pincode" class="checkout-input" placeholder="e.g. 560038" maxlength="6" inputmode="numeric" autocomplete="postal-code" required aria-required="true" aria-describedby="checkout-pincode-error">',
      '        <div class="checkout-error-msg" id="checkout-pincode-error" role="alert">Please enter a valid 6-digit Indian PIN code.</div>',
      '      </div>',
      '    </div>',
      '  </div>',
      '',
      '  <!-- Payment Method Box (Simulated Demo Only) -->',
      '  <div class="checkout-card">',
      '    <div class="checkout-card-header">',
      '      <h2 class="checkout-card-title">',
      '        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>',
      '        3. Payment Method',
      '      </h2>',
      '      <span class="checkout-card-badge" style="background: #ecfdf3; color: #027a48; border-color: #a6f4c5;">Simulated Demo</span>',
      '    </div>',
      '    <div class="checkout-payment-box">',
      '      <div class="checkout-payment-icon" aria-hidden="true">',
      '        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
      '      </div>',
      '      <div class="checkout-payment-text">',
      '        <h4>Simulated Free Order Demo</h4>',
      '        <p>This is a frontend demonstration. No real payment gateway is integrated. Clicking "Place Demo Order" below will instantly confirm your order locally without requesting payment credentials.</p>',
      '      </div>',
      '    </div>',
      '  </div>',
      '',
      '  <!-- Actions -->',
      '  <div class="checkout-actions">',
      '    <button type="submit" id="checkout-submit-btn" class="checkout-submit-btn">',
      '      <span>Place Demo Order</span>',
      '      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>',
      '    </button>',
      '    <a href="cart.html" class="checkout-back-cart-link">← Return to Shopping Bag</a>',
      '  </div>',
      '</form>'
    ].join('\n');

    // Sidebar items markup
    var itemsListHtml = '';
    resolvedItems.forEach(function (ri) {
      var itemLineTotal = ri.product.price * ri.item.quantity;
      itemsListHtml += [
        '<div class="checkout-item-row">',
        '  <div class="checkout-item-img-wrapper">',
        '    <img src="' + escapeHTML(ri.product.image) + '" alt="' + escapeHTML(ri.product.name) + '" class="checkout-item-img" loading="lazy">',
        '    <span class="checkout-item-qty-badge" aria-label="Quantity: ' + ri.item.quantity + '">' + ri.item.quantity + '</span>',
        '  </div>',
        '  <div class="checkout-item-info">',
        '    <h3 class="checkout-item-title">' + escapeHTML(ri.product.name) + '</h3>',
        '    <div class="checkout-item-meta">' + (ri.product.size ? escapeHTML(ri.product.size) + ' · ' : '') + formatINR(ri.product.price) + ' each</div>',
        '  </div>',
        '  <div class="checkout-item-price">' + formatINR(itemLineTotal) + '</div>',
        '</div>'
      ].join('\n');
    });

    var deliveryRowHtml = isFreeDelivery
      ? [
          '<div class="checkout-calc-row">',
          '  <span>Delivery</span>',
          '  <span class="checkout-delivery-badge-free">FREE</span>',
          '</div>'
        ].join('\n')
      : [
          '<div class="checkout-calc-row">',
          '  <span>Delivery</span>',
          '  <span class="checkout-calc-val" style="font-size: 0.85rem; color: var(--color-muted);">Not configured</span>',
          '</div>',
          '<div class="checkout-delivery-note">Free on cart subtotals of ₹' + FREE_SHIPPING_THRESHOLD + ' or more. Add ' + formatINR(FREE_SHIPPING_THRESHOLD - subtotal) + ' more to qualify for Free Delivery. Delivery charges below ₹' + FREE_SHIPPING_THRESHOLD + ' have not been configured in this demo.</div>'
        ].join('\n');

    var summaryHtml = [
      '<aside class="checkout-summary-sidebar">',
      '  <div class="checkout-summary-card">',
      '    <div class="checkout-summary-header">',
      '      <h2 class="checkout-summary-title">Order Summary</h2>',
      '      <span class="checkout-card-badge">' + totalItemCount + (totalItemCount === 1 ? ' item' : ' items') + '</span>',
      '    </div>',
      '    <div class="checkout-summary-items" aria-label="Items in bag">',
      itemsListHtml,
      '    </div>',
      '    <div class="checkout-calc-divider"></div>',
      '    <div class="checkout-calc-row">',
      '      <span>Bag Subtotal</span>',
      '      <span class="checkout-calc-val" id="checkout-subtotal-val">' + formatINR(subtotal) + '</span>',
      '    </div>',
      deliveryRowHtml,
      '    <div class="checkout-calc-total">',
      '      <span class="checkout-total-label">Total to Pay</span>',
      '      <span class="checkout-total-val" id="checkout-total-val">' + formatINR(total) + '</span>',
      '    </div>',
      '    <p class="checkout-tax-note">Inclusive of all applicable taxes. Demo prices are whole INR amounts.</p>',
      '  </div>',
      '</aside>'
    ].join('\n');

    root.innerHTML = [
      stepTrackerHtml,
      '<div class="checkout-layout">',
      '  <div class="checkout-main">',
      demoBannerHtml,
      formHtml,
      '  </div>',
      summaryHtml,
      '</div>'
    ].join('\n');

    attachCheckoutEvents(root, resolvedItems, subtotal, isFreeDelivery, total);
  }

  /**
   * Phone number normalization for Indian mobile format check
   */
  function normalizeIndianPhone(phoneStr) {
    if (!phoneStr) return '';
    var cleaned = phoneStr.trim().replace(/[\s\-\(\)]/g, '');
    if (cleaned.indexOf('+91') === 0) {
      cleaned = cleaned.substring(3);
    } else if (cleaned.indexOf('0') === 0 && cleaned.length === 11) {
      cleaned = cleaned.substring(1);
    }
    return cleaned;
  }

  /**
   * Form Field Validation
   */
  function validateForm(inputs) {
    var errors = [];

    // Full name
    var nameVal = (inputs.fullName ? inputs.fullName.value : '').trim();
    if (!nameVal) {
      errors.push({ field: 'fullName', message: 'Please enter your full name.' });
    }

    // Email
    var emailVal = (inputs.email ? inputs.email.value : '').trim();
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal) {
      errors.push({ field: 'email', message: 'Please enter your email address.' });
    } else if (!emailRegex.test(emailVal)) {
      errors.push({ field: 'email', message: 'Please enter a valid email address (e.g. name@example.com).' });
    }

    // Mobile Number
    var phoneRaw = (inputs.phone ? inputs.phone.value : '');
    var normalizedPhone = normalizeIndianPhone(phoneRaw);
    var phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRaw.trim()) {
      errors.push({ field: 'phone', message: 'Please enter your mobile number.' });
    } else if (!phoneRegex.test(normalizedPhone)) {
      errors.push({ field: 'phone', message: 'Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).' });
    }

    // Address Line 1
    var addr1Val = (inputs.addressLine1 ? inputs.addressLine1.value : '').trim();
    if (!addr1Val) {
      errors.push({ field: 'addressLine1', message: 'Please enter your house, flat, or building details.' });
    }

    // Address Line 2
    var addr2Val = (inputs.addressLine2 ? inputs.addressLine2.value : '').trim();
    if (!addr2Val) {
      errors.push({ field: 'addressLine2', message: 'Please enter your street or area details.' });
    }

    // Landmark is optional! No check needed.

    // City
    var cityVal = (inputs.city ? inputs.city.value : '').trim();
    if (!cityVal) {
      errors.push({ field: 'city', message: 'Please enter your town or city.' });
    }

    // State
    var stateVal = (inputs.state ? inputs.state.value : '').trim();
    if (!stateVal) {
      errors.push({ field: 'state', message: 'Please select your state or union territory.' });
    }

    // PIN Code
    var pinVal = (inputs.pincode ? inputs.pincode.value : '').trim();
    var pinRegex = /^[1-9]\d{5}$/;
    if (!pinVal) {
      errors.push({ field: 'pincode', message: 'Please enter your 6-digit PIN code.' });
    } else if (!pinRegex.test(pinVal)) {
      errors.push({ field: 'pincode', message: 'Please enter a valid 6-digit Indian PIN code (e.g. 560038).' });
    }

    return errors;
  }

  /**
   * Generate local simulated reference code (e.g. DEW-DEMO-A8F291)
   */
  function generateDemoRefNumber() {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var code = '';
    for (var i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return 'DEW-DEMO-' + code;
  }

  /**
   * Attach Interactive Handlers to Checkout Form
   */
  function attachCheckoutEvents(root, resolvedItems, subtotal, isFreeDelivery, total) {
    var form = root.querySelector('#checkout-form');
    if (!form) return;

    var inputs = {
      fullName: form.querySelector('#checkout-fullname'),
      email: form.querySelector('#checkout-email'),
      phone: form.querySelector('#checkout-phone'),
      addressLine1: form.querySelector('#checkout-address1'),
      addressLine2: form.querySelector('#checkout-address2'),
      landmark: form.querySelector('#checkout-landmark'),
      city: form.querySelector('#checkout-city'),
      state: form.querySelector('#checkout-state'),
      pincode: form.querySelector('#checkout-pincode')
    };

    // Live validation clearing on input/change
    Object.keys(inputs).forEach(function (key) {
      var inputEl = inputs[key];
      if (!inputEl) return;

      var clearErr = function () {
        inputEl.classList.remove('is-invalid');
        inputEl.setAttribute('aria-invalid', 'false');
      };

      inputEl.addEventListener('input', clearErr);
      inputEl.addEventListener('change', clearErr);
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (isSubmitting) return;

      // Validate all fields
      var errors = validateForm(inputs);

      if (errors.length > 0) {
        // Display errors
        errors.forEach(function (err) {
          var inputEl = inputs[err.field];
          var errEl = form.querySelector('#checkout-' + err.field.toLowerCase() + '-error');
          if (inputEl) {
            inputEl.classList.add('is-invalid');
            inputEl.setAttribute('aria-invalid', 'true');
          }
          if (errEl) {
            errEl.textContent = err.message;
          }
        });

        // Focus the first invalid field
        var firstErrorField = inputs[errors[0].field];
        if (firstErrorField && typeof firstErrorField.focus === 'function') {
          firstErrorField.focus();
        }

        if (Dewora.showToast) {
          Dewora.showToast('Please fix the highlighted errors before submitting.', 'danger');
        }
        return;
      }

      // Check that cart has items
      var currentCart = (Dewora.storage ? Dewora.storage.getCart() : []) || [];
      if (currentCart.length === 0) {
        if (Dewora.showToast) {
          Dewora.showToast('Your bag is empty. Please add items before placing an order.', 'danger');
        }
        render();
        return;
      }

      // Form is valid! Begin simulated order placement.
      isSubmitting = true;
      var submitBtn = form.querySelector('#checkout-submit-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="checkout-btn-spinner" aria-hidden="true"></span> <span>Processing demo order...</span>';
      }

      // Collect customer information strictly in memory (never persisted to localStorage/sessionStorage)
      var orderCustomer = {
        fullName: inputs.fullName.value.trim(),
        email: inputs.email.value.trim(),
        phone: normalizeIndianPhone(inputs.phone.value),
        addressLine1: inputs.addressLine1.value.trim(),
        addressLine2: inputs.addressLine2.value.trim(),
        landmark: inputs.landmark ? inputs.landmark.value.trim() : '',
        city: inputs.city.value.trim(),
        state: inputs.state.value.trim(),
        pincode: inputs.pincode.value.trim()
      };

      var orderItems = resolvedItems.map(function (ri) {
        return {
          id: ri.product.id,
          name: ri.product.name,
          size: ri.product.size || '',
          price: ri.product.price,
          quantity: ri.item.quantity,
          lineTotal: ri.product.price * ri.item.quantity,
          image: ri.product.image
        };
      });

      var orderData = {
        refNumber: generateDemoRefNumber(),
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        customer: orderCustomer,
        items: orderItems,
        subtotal: subtotal,
        isFreeDelivery: isFreeDelivery,
        deliveryStatus: isFreeDelivery ? 'FREE' : 'Not configured (Demo)',
        total: total
      };

      setTimeout(function () {
        // Clear cart from local storage
        if (Dewora.storage) {
          Dewora.storage.saveCart([]);
        }

        // Render confirmation view
        isSubmitting = false;
        renderOrderConfirmation(root, orderData);

        if (Dewora.showToast) {
          Dewora.showToast('Demo order placed successfully!', 'success');
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 800);
    });
  }

  /**
   * Render Order Confirmation View
   */
  function renderOrderConfirmation(root, orderData) {
    var formatINR = Dewora.currency ? Dewora.currency.formatINR : function (n) { return '₹' + n; };
    var escapeHTML = Dewora.dom ? Dewora.dom.escapeHTML : function (s) { return s; };

    // Step tracker on confirmation
    var stepTrackerHtml = [
      '<nav class="checkout-steps-tracker" aria-label="Checkout Progress">',
      '  <span class="checkout-step-item is-completed">',
      '    <span class="checkout-step-num" aria-hidden="true">✓</span>',
      '    <span>Bag</span>',
      '  </span>',
      '  <div class="checkout-step-divider" aria-hidden="true"></div>',
      '  <span class="checkout-step-item is-completed">',
      '    <span class="checkout-step-num" aria-hidden="true">✓</span>',
      '    <span>Delivery Details</span>',
      '  </span>',
      '  <div class="checkout-step-divider" aria-hidden="true"></div>',
      '  <div class="checkout-step-item is-active" aria-current="step">',
      '    <span class="checkout-step-num">3</span>',
      '    <span>Confirmation</span>',
      '  </div>',
      '</nav>'
    ].join('\n');

    // Build items rows
    var itemsRecapHtml = '';
    orderData.items.forEach(function (item) {
      itemsRecapHtml += [
        '<div class="checkout-item-row" style="margin-bottom: 0.75rem;">',
        '  <div class="checkout-item-img-wrapper" style="width: 48px; height: 60px;">',
        '    <img src="' + escapeHTML(item.image) + '" alt="' + escapeHTML(item.name) + '" class="checkout-item-img">',
        '  </div>',
        '  <div class="checkout-item-info">',
        '    <h4 class="checkout-item-title">' + escapeHTML(item.name) + '</h4>',
        '    <div class="checkout-item-meta">Qty: ' + item.quantity + (item.size ? ' · ' + escapeHTML(item.size) : '') + ' · ' + formatINR(item.price) + ' each</div>',
        '  </div>',
        '  <div class="checkout-item-price">' + formatINR(item.lineTotal) + '</div>',
        '</div>'
      ].join('\n');
    });

    // Format address string for safe textContent insertion
    var landmarkPart = '';
    if (orderData.customer.landmark) {
      var lm = orderData.customer.landmark.trim();
      landmarkPart = /^near\s+/i.test(lm) ? ' (' + lm + ')' : ' (Near ' + lm + ')';
    }

    var fullAddress = orderData.customer.addressLine1 + ', ' +
      orderData.customer.addressLine2 +
      landmarkPart + ', ' +
      orderData.customer.city + ', ' +
      orderData.customer.state + ' — ' +
      orderData.customer.pincode;

    var deliveryBadgeHtml = orderData.isFreeDelivery
      ? '<span class="checkout-delivery-badge-free">FREE</span>'
      : '<span style="font-size: 0.85rem; color: var(--color-muted);">Not configured (Demo)</span>';

    // Render structure with static markup; customer-provided data populated safely via textContent below
    root.innerHTML = [
      stepTrackerHtml,
      '<div class="checkout-confirm-container">',
      '  <div class="checkout-confirm-hero">',
      '    <div class="checkout-confirm-icon-circle" aria-hidden="true">',
      '      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">',
      '        <polyline points="20 6 9 17 4 12"></polyline>',
      '      </svg>',
      '    </div>',
      '    <h1 class="checkout-confirm-title">Demo Order Placed Successfully!</h1>',
      '    <p class="checkout-confirm-subtitle">Thank you for testing the simulated Dewora skincare shopping experience.</p>',
      '    <div class="checkout-confirm-ref-box">',
      '      <div class="checkout-confirm-ref-label">Simulated Order Reference</div>',
      '      <div class="checkout-confirm-ref-code" id="order-reference-code"></div>',
      '    </div>',
      '  </div>',
      '',
      '  <div class="checkout-confirm-notice-banner" role="alert">',
      '    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink: 0;" aria-hidden="true">',
      '      <circle cx="12" cy="12" r="10"></circle>',
      '      <line x1="12" y1="8" x2="12" y2="12"></line>',
      '      <line x1="12" y1="16" x2="12.01" y2="16"></line>',
      '    </svg>',
      '    <div>',
      '      <strong>Frontend Demonstration Notice:</strong> This is a simulated checkout. No payment was taken, no credit card details were processed, and no physical order was sent to any server.',
      '    </div>',
      '  </div>',
      '',
      '  <div class="checkout-confirm-grid">',
      '    <!-- Customer & Delivery Details Card -->',
      '    <div class="checkout-confirm-card">',
      '      <h3 class="checkout-confirm-card-title">',
      '        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
      '        Delivery Information',
      '      </h3>',
      '      <div class="checkout-recap-list">',
      '        <div class="checkout-recap-row">',
      '          <span class="checkout-recap-label">Recipient:</span>',
      '          <span class="checkout-recap-val" id="recap-recipient"></span>',
      '        </div>',
      '        <div class="checkout-recap-row">',
      '          <span class="checkout-recap-label">Email:</span>',
      '          <span class="checkout-recap-val" id="recap-email"></span>',
      '        </div>',
      '        <div class="checkout-recap-row">',
      '          <span class="checkout-recap-label">Mobile:</span>',
      '          <span class="checkout-recap-val" id="recap-mobile"></span>',
      '        </div>',
      '        <div class="checkout-recap-row">',
      '          <span class="checkout-recap-label">Address:</span>',
      '          <span class="checkout-recap-val" id="recap-address"></span>',
      '        </div>',
      '        <div class="checkout-recap-row">',
      '          <span class="checkout-recap-label">Order Date:</span>',
      '          <span class="checkout-recap-val" id="recap-date"></span>',
      '        </div>',
      '      </div>',
      '    </div>',
      '',
      '    <!-- Order Pricing Summary Card -->',
      '    <div class="checkout-confirm-card">',
      '      <h3 class="checkout-confirm-card-title">',
      '        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>',
      '        Items & Total',
      '      </h3>',
      '      <div style="margin-bottom: 1rem;">',
      itemsRecapHtml,
      '      </div>',
      '      <div class="checkout-calc-divider"></div>',
      '      <div class="checkout-recap-row" style="margin-bottom: 0.5rem;">',
      '        <span class="checkout-recap-label">Bag Subtotal:</span>',
      '        <span class="checkout-recap-val">' + formatINR(orderData.subtotal) + '</span>',
      '      </div>',
      '      <div class="checkout-recap-row" style="margin-bottom: 0.75rem;">',
      '        <span class="checkout-recap-label">Delivery:</span>',
      '        <div>' + deliveryBadgeHtml + '</div>',
      '      </div>',
      '      <div class="checkout-calc-total" style="padding-top: 0.75rem;">',
      '        <span class="checkout-total-label">Total Amount</span>',
      '        <span class="checkout-total-val">' + formatINR(orderData.total) + '</span>',
      '      </div>',
      '    </div>',
      '  </div>',
      '',
      '  <div class="checkout-confirm-actions">',
      '    <a href="shop.html" class="btn btn-primary" style="padding: 0.85rem 2rem;">Continue Shopping</a>',
      '    <a href="index.html" class="btn btn-outline" style="padding: 0.85rem 2rem;">Return to Home</a>',
      '  </div>',
      '</div>'
    ].join('\n');

    // Security Hardening: Safely populate customer-provided values via textContent (Zero HTML injection risk)
    var refEl = root.querySelector('#order-reference-code');
    if (refEl) refEl.textContent = orderData.refNumber;

    var recipientEl = root.querySelector('#recap-recipient');
    if (recipientEl) recipientEl.textContent = orderData.customer.fullName;

    var emailEl = root.querySelector('#recap-email');
    if (emailEl) emailEl.textContent = orderData.customer.email;

    var mobileEl = root.querySelector('#recap-mobile');
    if (mobileEl) mobileEl.textContent = '+91 ' + orderData.customer.phone;

    var addressEl = root.querySelector('#recap-address');
    if (addressEl) addressEl.textContent = fullAddress;

    var dateEl = root.querySelector('#recap-date');
    if (dateEl) dateEl.textContent = orderData.date;
  }

  return {
    init: init,
    render: render
  };
})();
