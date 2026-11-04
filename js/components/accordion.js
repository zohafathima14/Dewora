/**
 * Dewora — Accessible Accordion Component
 * Specification: TRD.md Section 7 & DESIGN.md Section 11
 * Handles accessible accordion expand/collapse with aria-expanded and keyboard navigation.
 */

window.Dewora = window.Dewora || {};
Dewora.components = Dewora.components || {};

Dewora.components.accordion = (function () {
  'use strict';

  function init(containerSelector) {
    var accordions = document.querySelectorAll(containerSelector || '.accordion');
    
    accordions.forEach(function (acc) {
      acc.addEventListener('click', function (e) {
        var header = e.target.closest('.accordion-header');
        if (!header) return;

        var item = header.closest('.accordion-item');
        var content = item ? item.querySelector('.accordion-content') : null;
        if (!content) return;

        var isExpanded = header.getAttribute('aria-expanded') === 'true';

        // Toggle state
        if (isExpanded) {
          header.setAttribute('aria-expanded', 'false');
          content.classList.remove('active');
          content.setAttribute('aria-hidden', 'true');
        } else {
          header.setAttribute('aria-expanded', 'true');
          content.classList.add('active');
          content.setAttribute('aria-hidden', 'false');
        }
      });
    });
  }

  return {
    init: init
  };
})();
