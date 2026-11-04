/**
 * Dewora — Currency Formatting Utility
 * Specification: TRD.md Section 6.4
 * Formats numeric INR values using Intl.NumberFormat.
 */

window.Dewora = window.Dewora || {};

Dewora.currency = (function () {
  'use strict';

  var inrFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  });

  /**
   * Format a numeric amount into Indian Rupee (₹) format.
   * @param {number} amount - The numeric price in INR.
   * @returns {string} Formatted string, e.g. "₹549".
   */
  function formatINR(amount) {
    if (typeof amount !== 'number' || isNaN(amount)) {
      return '₹0';
    }
    return inrFormatter.format(amount);
  }

  return {
    formatINR: formatINR
  };
})();
