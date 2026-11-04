/**
 * Dewora — DOM Helper Utilities
 * Safe DOM construction and query helpers.
 */

window.Dewora = window.Dewora || {};

Dewora.dom = (function () {
  'use strict';

  /**
   * Safe document.querySelector wrapper
   */
  function qs(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  /**
   * Safe document.querySelectorAll wrapper returning array
   */
  function qsa(selector, scope) {
    return Array.from((scope || document).querySelectorAll(selector));
  }

  /**
   * Safe string escaping for HTML
   */
  function escapeHTML(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Safe event listener helper
   */
  function on(target, event, handler, options) {
    if (!target) return;
    target.addEventListener(event, handler, options);
  }

  /**
   * SVG Icon Definitions for standard UI actions
   * Simple, consistent line-art icons per DESIGN.md Section 12
   */
  var SVG_ICONS = {
    search: '<svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
    heart: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>',
    bag: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>',
    menu: '<svg aria-hidden="true" viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>',
    close: '<svg aria-hidden="true" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
    chevronRight: '<svg aria-hidden="true" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg>',
    star: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>'
  };

  function getIcon(name) {
    return SVG_ICONS[name] || '';
  }

  return {
    qs: qs,
    qsa: qsa,
    escapeHTML: escapeHTML,
    on: on,
    getIcon: getIcon
  };
})();
