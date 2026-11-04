/**
 * Dewora — Product Catalogue Controller
 * Phase 4: Product Catalogue, Search, Filters & Sorting
 * Specification: PRD.md Section 7.2, TRD.md Section 6.2-6.3, DESIGN.md Section 8
 */

window.Dewora = window.Dewora || {};
Dewora.pages = Dewora.pages || {};

Dewora.pages.shop = (function () {
  'use strict';

  // Filter & Search State
  var state = {
    search: '',
    categories: [],
    skinTypes: [],
    concerns: [],
    priceRange: '',
    minPrice: null,
    maxPrice: null,
    sort: 'featured'
  };

  var isMobileDrawerOpen = false;

  function init() {
    readUrlParams();
    renderSidebarFilters();
    renderMobileDrawerFilters();
    bindEvents();
    applyFiltersAndRender(false);
    console.log('Dewora: Shop catalogue page initialized with state:', state);
  }

  /**
   * 1. Read URL Query Parameters
   */
  function readUrlParams() {
    var params = new URLSearchParams(window.location.search);

    // Search query
    var q = params.get('q');
    if (q) state.search = q.trim();

    // Category (single or comma-separated)
    var cat = params.get('category');
    if (cat) {
      var catList = cat.split(',').map(function (c) { return c.trim(); }).filter(Boolean);
      state.categories = catList.map(function (c) {
        if (c.toLowerCase() === 'skincare') return 'Skincare';
        return c;
      });
    }

    // Skin Type (single or comma-separated)
    var st = params.get('skinType');
    if (st) {
      state.skinTypes = st.split(',').map(function (t) { return t.trim(); }).filter(Boolean);
    }

    // Skin Concern (single or comma-separated)
    var con = params.get('concern');
    if (con) {
      state.concerns = con.split(',').map(function (c) { return c.trim(); }).filter(Boolean);
    }

    // Price filters
    var pRange = params.get('priceRange');
    if (pRange) state.priceRange = pRange.trim();

    var minP = params.get('minPrice');
    if (minP && !isNaN(parseInt(minP, 10))) state.minPrice = parseInt(minP, 10);

    var maxP = params.get('maxPrice');
    if (maxP && !isNaN(parseInt(maxP, 10))) state.maxPrice = parseInt(maxP, 10);

    // Sorting
    var sortParam = params.get('sort');
    if (sortParam) state.sort = sortParam.trim();
  }

  /**
   * 2. Synchronize State to URL
   */
  function syncUrl(push) {
    var params = new URLSearchParams();

    if (state.search) params.set('q', state.search);
    if (state.categories.length > 0) {
      if (state.categories.length === 1) {
        params.set('category', state.categories[0]);
      } else {
        params.set('category', state.categories.join(','));
      }
    }
    if (state.skinTypes.length > 0) {
      if (state.skinTypes.length === 1) {
        params.set('skinType', state.skinTypes[0]);
      } else {
        params.set('skinType', state.skinTypes.join(','));
      }
    }
    if (state.concerns.length > 0) {
      if (state.concerns.length === 1) {
        params.set('concern', state.concerns[0]);
      } else {
        params.set('concern', state.concerns.join(','));
      }
    }
    if (state.priceRange) params.set('priceRange', state.priceRange);
    if (state.minPrice !== null) params.set('minPrice', state.minPrice);
    if (state.maxPrice !== null) params.set('maxPrice', state.maxPrice);
    if (state.sort && state.sort !== 'featured') params.set('sort', state.sort);

    var queryString = params.toString();
    var currentQuery = window.location.search.replace(/^\?/, '');
    var newUrl = window.location.pathname + (queryString ? '?' + queryString : '');

    if (queryString !== currentQuery) {
      if (push) {
        window.history.pushState({ dewora: true }, '', newUrl);
      } else {
        window.history.replaceState({ dewora: true }, '', newUrl);
      }
    }
  }

  /**
   * 3. Filter Options Definition
   */
  var FILTER_CONFIG = {
    categories: [
      { id: 'Sunscreen', label: 'Sunscreen' },
      { id: 'Cleansers', label: 'Cleansers' },
      { id: 'Moisturizers', label: 'Moisturizers' },
      { id: 'Serums', label: 'Serums' },
      { id: 'Toners', label: 'Toners' },
      { id: 'Lip Care', label: 'Lip Care' },
      { id: 'Body Care', label: 'Body Care' }
    ],
    skinTypes: [
      { id: 'All skin types', label: 'All Skin Types' },
      { id: 'Dry', label: 'Dry Skin' },
      { id: 'Oily', label: 'Oily Skin' },
      { id: 'Combination', label: 'Combination Skin' },
      { id: 'Sensitive', label: 'Sensitive Skin' },
      { id: 'Normal', label: 'Normal Skin' }
    ],
    concerns: [
      { id: 'Hydration', label: 'Hydration & Dryness' },
      { id: 'Dullness', label: 'Dull-looking Skin' },
      { id: 'Sun care', label: 'Everyday Sun Care' },
      { id: 'Barrier care', label: 'Skin Barrier Care' },
      { id: 'Acne-prone', label: 'Blemish & Pore Care' },
      { id: 'Rough texture', label: 'Rough & Uneven Texture' }
    ],
    priceRanges: [
      { id: 'under-300', label: 'Under ₹300', min: 0, max: 299.99, match: function (p) { return p < 300; } },
      { id: '300-500', label: '₹300 – ₹500', min: 300, max: 500, match: function (p) { return p >= 300 && p <= 500; } },
      { id: '500-700', label: '₹500 – ₹700', min: 500.01, max: 700, match: function (p) { return p > 500 && p <= 700; } },
      { id: '700-1000', label: '₹700 – ₹1,000', min: 700.01, max: 1000, match: function (p) { return p > 700 && p <= 1000; } },
      { id: 'above-1000', label: 'Above ₹1,000', min: 1000.01, max: 999999, match: function (p) { return p > 1000; } }
    ]
  };

  /**
   * 4. Count helper for filter options
   */
  function getCountForCategory(catId) {
    if (!Dewora.products) return 0;
    return Dewora.products.filter(function (p) {
      return p.category && p.category.toLowerCase() === catId.toLowerCase();
    }).length;
  }

  function getCountForSkinType(typeId) {
    if (!Dewora.products) return 0;
    if (typeId === 'All skin types') return Dewora.products.length;
    return Dewora.products.filter(function (p) {
      return p.skinTypes && p.skinTypes.includes(typeId);
    }).length;
  }

  function getCountForConcern(conId) {
    if (!Dewora.products) return 0;
    return Dewora.products.filter(function (p) {
      if (!p.concerns) return false;
      if (conId === 'Hydration') {
        return p.concerns.includes('Hydration') || p.concerns.includes('Dryness');
      }
      return p.concerns.some(function (c) {
        return c.toLowerCase() === conId.toLowerCase();
      });
    }).length;
  }

  /**
   * 5. Generate Filter Markup
   */
  function generateFilterHtml(prefix) {
    prefix = prefix || 'sidebar';

    var html = [];

    // Categories
    html.push('<div class="filter-group">');
    html.push('  <h3 class="filter-group-title">Category</h3>');
    html.push('  <ul class="filter-options-list">');
    FILTER_CONFIG.categories.forEach(function (cat) {
      var isChecked = state.categories.some(function (c) {
        return c.toLowerCase() === cat.id.toLowerCase() || (c.toLowerCase() === 'skincare' && cat.id !== 'Body Care');
      });
      var count = getCountForCategory(cat.id);
      var inputId = prefix + '-cat-' + cat.id.replace(/\s+/g, '-').toLowerCase();

      html.push('    <li>');
      html.push('      <label class="filter-option-label" for="' + inputId + '">');
      html.push('        <span class="filter-option-input-wrap">');
      html.push('          <input type="checkbox" id="' + inputId + '" data-filter-type="category" value="' + cat.id + '" ' + (isChecked ? 'checked' : '') + '>');
      html.push('          <span>' + cat.label + '</span>');
      html.push('        </span>');
      html.push('        <span class="filter-option-count">(' + count + ')</span>');
      html.push('      </label>');
      html.push('    </li>');
    });
    html.push('  </ul>');
    html.push('</div>');

    // Skin Types
    html.push('<div class="filter-group">');
    html.push('  <h3 class="filter-group-title">Skin Type</h3>');
    html.push('  <ul class="filter-options-list">');
    FILTER_CONFIG.skinTypes.forEach(function (st) {
      var isChecked = state.skinTypes.some(function (t) {
        return t.toLowerCase() === st.id.toLowerCase();
      });
      var count = getCountForSkinType(st.id);
      var inputId = prefix + '-st-' + st.id.replace(/\s+/g, '-').toLowerCase();

      html.push('    <li>');
      html.push('      <label class="filter-option-label" for="' + inputId + '">');
      html.push('        <span class="filter-option-input-wrap">');
      html.push('          <input type="checkbox" id="' + inputId + '" data-filter-type="skinType" value="' + st.id + '" ' + (isChecked ? 'checked' : '') + '>');
      html.push('          <span>' + st.label + '</span>');
      html.push('        </span>');
      html.push('        <span class="filter-option-count">(' + count + ')</span>');
      html.push('      </label>');
      html.push('    </li>');
    });
    html.push('  </ul>');
    html.push('</div>');

    // Skin Concerns
    html.push('<div class="filter-group">');
    html.push('  <h3 class="filter-group-title">Skin Concern</h3>');
    html.push('  <ul class="filter-options-list">');
    FILTER_CONFIG.concerns.forEach(function (con) {
      var isChecked = state.concerns.some(function (c) {
        if (con.id === 'Hydration' && (c.toLowerCase() === 'hydration' || c.toLowerCase() === 'dryness')) return true;
        return c.toLowerCase() === con.id.toLowerCase();
      });
      var count = getCountForConcern(con.id);
      var inputId = prefix + '-con-' + con.id.replace(/\s+/g, '-').toLowerCase();

      html.push('    <li>');
      html.push('      <label class="filter-option-label" for="' + inputId + '">');
      html.push('        <span class="filter-option-input-wrap">');
      html.push('          <input type="checkbox" id="' + inputId + '" data-filter-type="concern" value="' + con.id + '" ' + (isChecked ? 'checked' : '') + '>');
      html.push('          <span>' + con.label + '</span>');
      html.push('        </span>');
      html.push('        <span class="filter-option-count">(' + count + ')</span>');
      html.push('      </label>');
      html.push('    </li>');
    });
    html.push('  </ul>');
    html.push('</div>');

    // Price Ranges
    html.push('<div class="filter-group">');
    html.push('  <h3 class="filter-group-title">Price Range</h3>');
    html.push('  <ul class="filter-options-list">');
    FILTER_CONFIG.priceRanges.forEach(function (pr) {
      var isChecked = state.priceRange === pr.id;
      var inputId = prefix + '-pr-' + pr.id;

      html.push('    <li>');
      html.push('      <label class="filter-option-label" for="' + inputId + '">');
      html.push('        <span class="filter-option-input-wrap">');
      html.push('          <input type="radio" name="' + prefix + '-price-range" id="' + inputId + '" data-filter-type="priceRange" value="' + pr.id + '" ' + (isChecked ? 'checked' : '') + '>');
      html.push('          <span>' + pr.label + '</span>');
      html.push('        </span>');
      html.push('      </label>');
      html.push('    </li>');
    });
    html.push('  </ul>');
    html.push('</div>');

    return html.join('\n');
  }

  function renderSidebarFilters() {
    var container = document.getElementById('shop-sidebar-filters');
    if (!container) return;
    container.innerHTML = generateFilterHtml('desktop');
  }

  function renderMobileDrawerFilters() {
    var container = document.getElementById('mobile-filter-drawer-filters');
    if (!container) return;
    container.innerHTML = generateFilterHtml('mobile');
  }

  /**
   * 6. Filtering & Sorting Engine
   */
  function applyFiltersAndRender(push) {
    if (!Dewora.products || !Array.isArray(Dewora.products)) return;

    var filtered = Dewora.products.slice();

    // Search filter
    if (state.search) {
      var term = state.search.toLowerCase();
      filtered = filtered.filter(function (p) {
        var searchable = [
          p.name,
          p.category,
          p.shortDescription || '',
          p.description || '',
          (p.concerns || []).join(' '),
          (p.skinTypes || []).join(' '),
          (p.ingredients || []).join(' ')
        ].join(' ').toLowerCase();

        return searchable.indexOf(term) > -1;
      });
    }

    // Category filter
    if (state.categories.length > 0) {
      filtered = filtered.filter(function (p) {
        return state.categories.some(function (selectedCat) {
          var sel = selectedCat.toLowerCase();
          // Broad skincare collection handling
          if (sel === 'skincare') {
            return p.category !== 'Body Care';
          }
          return p.category && p.category.toLowerCase() === sel;
        });
      });
    }

    // Skin type filter
    if (state.skinTypes.length > 0) {
      filtered = filtered.filter(function (p) {
        if (!p.skinTypes) return false;
        return state.skinTypes.some(function (selectedType) {
          if (selectedType === 'All skin types') return true;
          return p.skinTypes.includes(selectedType);
        });
      });
    }

    // Skin concern filter
    if (state.concerns.length > 0) {
      filtered = filtered.filter(function (p) {
        if (!p.concerns) return false;
        return state.concerns.some(function (selectedConcern) {
          var sel = selectedConcern.toLowerCase();
          // Normalize Dryness / Hydration
          if (sel === 'dryness' || sel === 'hydration') {
            return p.concerns.some(function (c) {
              var cl = c.toLowerCase();
              return cl === 'dryness' || cl === 'hydration';
            });
          }
          if (sel === 'barrier care' || sel === 'barrier+care') {
            return p.concerns.some(function (c) {
              return c.toLowerCase() === 'barrier care';
            });
          }
          return p.concerns.some(function (c) {
            return c.toLowerCase() === sel;
          });
        });
      });
    }

    // Price range filter
    if (state.priceRange) {
      var rangeObj = FILTER_CONFIG.priceRanges.find(function (r) {
        return r.id === state.priceRange;
      });
      if (rangeObj) {
        filtered = filtered.filter(function (p) {
          if (typeof rangeObj.match === 'function') {
            return rangeObj.match(p.price);
          }
          return p.price >= rangeObj.min && p.price <= rangeObj.max;
        });
      }
    }

    // Custom Min / Max Price
    if (state.minPrice !== null) {
      filtered = filtered.filter(function (p) { return p.price >= state.minPrice; });
    }
    if (state.maxPrice !== null) {
      filtered = filtered.filter(function (p) { return p.price <= state.maxPrice; });
    }

    // Sorting
    switch (state.sort) {
      case 'price-low':
        filtered.sort(function (a, b) { return a.price - b.price; });
        break;
      case 'price-high':
        filtered.sort(function (a, b) { return b.price - a.price; });
        break;
      case 'rating-high':
        filtered.sort(function (a, b) { return (b.rating || 0) - (a.rating || 0); });
        break;
      case 'featured':
      default:
        filtered.sort(function (a, b) {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
        break;
    }

    // Render results
    renderProducts(filtered);
    renderActiveFilterChips();
    updateCountAndBreadcrumb(filtered.length);
    syncUrl(push);
  }

  /**
   * 7. Render Product Grid & Empty State
   */
  function renderProducts(products) {
    var grid = document.getElementById('shop-product-grid');
    if (!grid) return;

    if (products.length === 0) {
      grid.innerHTML = [
        '<div class="empty-state" style="grid-column: 1 / -1;">',
        '  <div class="empty-state-icon">' + Dewora.dom.getIcon('search') + '</div>',
        '  <h3 class="empty-state-title">No skincare essentials match your filters</h3>',
        '  <p class="empty-state-text">Try loosening your filters, adjusting the price range, or searching for a different active ingredient or concern.</p>',
        '  <button class="btn btn-primary" id="empty-state-reset-btn">Reset All Filters</button>',
        '</div>'
      ].join('\n');

      var resetBtn = document.getElementById('empty-state-reset-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', function () {
          clearAllFilters();
        });
      }
      return;
    }

    var cards = products.map(function (prod) {
      if (Dewora.components && Dewora.components.productCard) {
        return Dewora.components.productCard.render(prod);
      }
      return '';
    }).join('\n');

    grid.innerHTML = cards;
  }

  /**
   * 8. Render Active Filter Chips
   */
  function renderActiveFilterChips() {
    var container = document.getElementById('active-filters-container');
    if (!container) return;

    var chips = [];

    // Search chip
    if (state.search) {
      chips.push({
        label: 'Search: &ldquo;' + Dewora.dom.escapeHTML(state.search) + '&rdquo;',
        type: 'search',
        value: state.search
      });
    }

    // Category chips
    state.categories.forEach(function (cat) {
      chips.push({
        label: 'Category: ' + Dewora.dom.escapeHTML(cat),
        type: 'category',
        value: cat
      });
    });

    // Skin type chips
    state.skinTypes.forEach(function (st) {
      chips.push({
        label: 'Skin Type: ' + Dewora.dom.escapeHTML(st),
        type: 'skinType',
        value: st
      });
    });

    // Concern chips
    state.concerns.forEach(function (con) {
      chips.push({
        label: 'Concern: ' + Dewora.dom.escapeHTML(con),
        type: 'concern',
        value: con
      });
    });

    // Price range chip
    if (state.priceRange) {
      var foundPr = FILTER_CONFIG.priceRanges.find(function (p) { return p.id === state.priceRange; });
      chips.push({
        label: 'Price: ' + (foundPr ? foundPr.label : state.priceRange),
        type: 'priceRange',
        value: state.priceRange
      });
    }

    if (chips.length === 0) {
      container.innerHTML = '';
      container.style.display = 'none';
      return;
    }

    var html = ['<span class="active-filters-label">Active Filters:</span>'];

    chips.forEach(function (chip) {
      html.push(
        '<span class="active-filter-chip">' +
          '<span>' + chip.label + '</span>' +
          '<button type="button" class="active-filter-chip-remove" data-chip-type="' + chip.type + '" data-chip-value="' + Dewora.dom.escapeHTML(chip.value) + '" aria-label="Remove ' + chip.label + ' filter">&times;</button>' +
        '</span>'
      );
    });

    html.push('<button type="button" class="clear-all-chips-btn" id="clear-all-filters-btn">Clear all</button>');

    container.innerHTML = html.join('\n');
    container.style.display = 'flex';

    // Update mobile badge count
    var mobileBadge = document.getElementById('mobile-filter-badge');
    if (mobileBadge) {
      mobileBadge.textContent = chips.length;
      mobileBadge.style.display = chips.length > 0 ? 'inline-block' : 'none';
    }
  }

  /**
   * 9. Update Product Count & Breadcrumbs
   */
  function updateCountAndBreadcrumb(count) {
    var countEl = document.getElementById('shop-product-count');
    if (countEl) {
      countEl.innerHTML = 'Showing <strong>' + count + '</strong> ' + (count === 1 ? 'essential' : 'essentials');
    }

    var breadcrumbCategory = document.getElementById('breadcrumb-category');
    if (breadcrumbCategory) {
      if (state.categories.length === 1) {
        breadcrumbCategory.textContent = state.categories[0];
        breadcrumbCategory.style.display = 'inline';
      } else {
        breadcrumbCategory.textContent = 'All Products';
      }
    }
  }

  /**
   * 10. Clear All Filters
   */
  function clearAllFilters() {
    state.search = '';
    state.categories = [];
    state.skinTypes = [];
    state.concerns = [];
    state.priceRange = '';
    state.minPrice = null;
    state.maxPrice = null;

    // Uncheck desktop & mobile inputs
    var inputs = document.querySelectorAll('#shop-sidebar-filters input, #mobile-filter-drawer-filters input');
    inputs.forEach(function (input) {
      input.checked = false;
    });

    applyFiltersAndRender(true);
  }

  /**
   * 11. Event Handlers
   */
  function bindEvents() {
    // Sort dropdown change
    var sortSelect = document.getElementById('shop-sort-select');
    if (sortSelect) {
      sortSelect.value = state.sort;
      sortSelect.addEventListener('change', function (e) {
        state.sort = e.target.value;
        applyFiltersAndRender(true);
      });
    }

    // Filter Change Delegation (handles both desktop sidebar & mobile drawer)
    function handleFilterChange(e) {
      var input = e.target;
      if (!input.matches('input[data-filter-type]')) return;

      var filterType = input.getAttribute('data-filter-type');
      var val = input.value;

      if (filterType === 'category') {
        if (input.checked) {
          if (!state.categories.includes(val)) state.categories.push(val);
        } else {
          state.categories = state.categories.filter(function (c) {
            return c.toLowerCase() !== val.toLowerCase() && c.toLowerCase() !== 'skincare';
          });
        }
      } else if (filterType === 'skinType') {
        if (input.checked) {
          if (!state.skinTypes.includes(val)) state.skinTypes.push(val);
        } else {
          state.skinTypes = state.skinTypes.filter(function (t) { return t.toLowerCase() !== val.toLowerCase(); });
        }
      } else if (filterType === 'concern') {
        if (input.checked) {
          if (!state.concerns.includes(val)) state.concerns.push(val);
        } else {
          state.concerns = state.concerns.filter(function (c) { return c.toLowerCase() !== val.toLowerCase(); });
        }
      } else if (filterType === 'priceRange') {
        if (input.checked) {
          state.priceRange = val;
        }
      }

      // Sync checked state across both desktop and mobile inputs with same value
      syncInputStates(filterType, val, input.checked);

      applyFiltersAndRender(true);
    }

    var sidebarContainer = document.getElementById('shop-sidebar-filters');
    if (sidebarContainer) sidebarContainer.addEventListener('change', handleFilterChange);

    var mobileDrawerContainer = document.getElementById('mobile-filter-drawer-filters');
    if (mobileDrawerContainer) mobileDrawerContainer.addEventListener('change', handleFilterChange);

    // Sidebar "Clear all" button
    var sidebarClear = document.getElementById('sidebar-clear-all-btn');
    if (sidebarClear) {
      sidebarClear.addEventListener('click', function () {
        clearAllFilters();
      });
    }

    // Active Filter Chip Remove Delegation
    var chipsContainer = document.getElementById('active-filters-container');
    if (chipsContainer) {
      chipsContainer.addEventListener('click', function (e) {
        var removeBtn = e.target.closest('.active-filter-chip-remove');
        if (removeBtn) {
          var chipType = removeBtn.getAttribute('data-chip-type');
          var chipVal = removeBtn.getAttribute('data-chip-value');

          if (chipType === 'search') state.search = '';
          else if (chipType === 'category') {
            state.categories = state.categories.filter(function (c) {
              return c.toLowerCase() !== chipVal.toLowerCase() && c.toLowerCase() !== 'skincare';
            });
            syncInputStates('category', chipVal, false);
          } else if (chipType === 'skinType') {
            state.skinTypes = state.skinTypes.filter(function (t) { return t.toLowerCase() !== chipVal.toLowerCase(); });
            syncInputStates('skinType', chipVal, false);
          } else if (chipType === 'concern') {
            state.concerns = state.concerns.filter(function (c) { return c.toLowerCase() !== chipVal.toLowerCase(); });
            syncInputStates('concern', chipVal, false);
          } else if (chipType === 'priceRange') {
            state.priceRange = '';
            var priceInputs = document.querySelectorAll('input[data-filter-type="priceRange"]');
            priceInputs.forEach(function (pi) { pi.checked = false; });
          }

          applyFiltersAndRender(true);
          return;
        }

        var clearAllBtn = e.target.closest('#clear-all-filters-btn');
        if (clearAllBtn) {
          clearAllFilters();
        }
      });
    }

    // Browser Back / Forward popstate listener
    window.addEventListener('popstate', function () {
      state.search = '';
      state.categories = [];
      state.skinTypes = [];
      state.concerns = [];
      state.priceRange = '';
      state.minPrice = null;
      state.maxPrice = null;
      state.sort = 'featured';

      readUrlParams();
      syncInputsWithState();
      applyFiltersAndRender(false);
    });

    // Mobile Drawer Open / Close
    initMobileFilterDrawer();
  }

  function syncInputsWithState() {
    var allInputs = document.querySelectorAll('#shop-sidebar-filters input, #mobile-filter-drawer-filters input');
    allInputs.forEach(function (input) {
      var filterType = input.getAttribute('data-filter-type');
      var val = input.value;
      if (filterType === 'category') {
        input.checked = state.categories.some(function (c) {
          return c.toLowerCase() === val.toLowerCase() || (c.toLowerCase() === 'skincare' && val !== 'Body Care');
        });
      } else if (filterType === 'skinType') {
        input.checked = state.skinTypes.some(function (t) {
          return t.toLowerCase() === val.toLowerCase();
        });
      } else if (filterType === 'concern') {
        input.checked = state.concerns.some(function (c) {
          if (val === 'Hydration' && (c.toLowerCase() === 'hydration' || c.toLowerCase() === 'dryness')) return true;
          return c.toLowerCase() === val.toLowerCase();
        });
      } else if (filterType === 'priceRange') {
        input.checked = (state.priceRange === val);
      }
    });

    var sortSelect = document.getElementById('shop-sort-select');
    if (sortSelect) {
      sortSelect.value = state.sort || 'featured';
    }
  }

  function syncInputStates(filterType, val, isChecked) {
    var allInputs = document.querySelectorAll('input[data-filter-type="' + filterType + '"][value="' + val + '"]');
    allInputs.forEach(function (inp) {
      inp.checked = isChecked;
    });
  }

  function initMobileFilterDrawer() {
    var trigger = document.getElementById('mobile-filter-trigger');
    var drawer = document.getElementById('mobile-filter-drawer');
    var backdrop = document.getElementById('mobile-filter-drawer-backdrop');
    var closeBtn = document.getElementById('mobile-filter-drawer-close');
    var applyBtn = document.getElementById('mobile-filter-apply-btn');
    var clearBtn = document.getElementById('mobile-filter-clear-btn');

    if (!trigger || !drawer || !backdrop) return;

    function openDrawer() {
      isMobileDrawerOpen = true;
      drawer.classList.add('active');
      drawer.setAttribute('aria-hidden', 'false');
      backdrop.classList.add('active');
      backdrop.setAttribute('aria-hidden', 'false');
      trigger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      if (closeBtn) closeBtn.focus();
    }

    function closeDrawer() {
      isMobileDrawerOpen = false;
      drawer.classList.remove('active');
      drawer.setAttribute('aria-hidden', 'true');
      backdrop.classList.remove('active');
      backdrop.setAttribute('aria-hidden', 'true');
      trigger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      trigger.focus();
    }

    trigger.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (applyBtn) applyBtn.addEventListener('click', closeDrawer);
    if (backdrop) backdrop.addEventListener('click', closeDrawer);

    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        clearAllFilters();
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isMobileDrawerOpen) {
        closeDrawer();
      }
    });
  }

  return {
    init: init,
    clearAllFilters: clearAllFilters,
    getState: function () { return state; }
  };
})();
