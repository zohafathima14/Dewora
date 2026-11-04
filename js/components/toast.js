/**
 * Dewora — Toast Notification System Foundation
 * Specification: TRD.md Section 6.6 & DESIGN.md Section 11
 * Accessible notifications with aria-live and auto-dismiss.
 */

window.Dewora = window.Dewora || {};
Dewora.components = Dewora.components || {};

Dewora.components.toast = (function () {
  'use strict';

  var container = null;

  function ensureContainer() {
    if (!container) {
      container = document.getElementById('toast-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        container.setAttribute('role', 'status');
        container.setAttribute('aria-live', 'polite');
        container.setAttribute('aria-atomic', 'true');
        document.body.appendChild(container);
      }
    }
    return container;
  }

  /**
   * Display a toast notification
   * @param {string} message - Message to display
   * @param {string} type - 'success' | 'error' | 'info'
   * @param {number} duration - Auto-dismiss timeout in ms (default 3000)
   */
  function show(message, type, duration) {
    var parent = ensureContainer();
    type = type || 'info';
    duration = duration || 3200;

    var toastEl = document.createElement('div');
    toastEl.className = 'toast toast-' + type;

    var iconSvg = type === 'success'
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';

    toastEl.innerHTML = iconSvg + '<span>' + Dewora.dom.escapeHTML(message) + '</span>';
    parent.appendChild(toastEl);

    setTimeout(function () {
      toastEl.classList.add('toast-exit');
      setTimeout(function () {
        if (toastEl.parentNode) {
          toastEl.parentNode.removeChild(toastEl);
        }
      }, 200);
    }, duration);
  }

  return {
    show: show
  };
})();

// Convenience alias
Dewora.showToast = Dewora.components.toast.show;
