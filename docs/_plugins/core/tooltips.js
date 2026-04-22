/**
 * docsify-tooltips.js - Smart positioning for any element with data-tooltip
 *
 * This plugin provides intelligent tooltip positioning that prevents tooltips
 * from overflowing off the screen edges. It works with any element that has
 * a [data-tooltip] attribute, including dynamically added elements.
 *
 * Features:
 * - Automatic edge detection and alignment adjustment
 * - Works with dynamically added tooltips (uses event delegation)
 * - Respects content container boundaries (excludes sidebar)
 * - No initialization required - just add data-tooltip attribute
 *
 * Usage:
 *   <span data-tooltip="Your tooltip text">Hover me</span>
 *
 *   Or programmatically:
 *   element.setAttribute('data-tooltip', 'Dynamic tooltip');
 */

(function () {
  function calculateTooltipPosition(element) {
    // Use requestAnimationFrame to ensure tooltip pseudo-element is rendered
    requestAnimationFrame(() => {
      // Get container boundaries (section.content excludes sidebar)
      const contentContainer = document.querySelector('section.content');
      if (!contentContainer) return;

      const containerRect = contentContainer.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      const tooltipText = element.getAttribute('data-tooltip');

      if (!tooltipText) return;

      // Match CSS max-width calculation: min(25ch, 100vw - 2rem)
      const baseFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
      const remInPx = baseFontSize;
      const maxWidthFromVw = window.innerWidth - (2 * remInPx);
      const maxWidthFrom25Ch = 25 * baseFontSize;
      const maxWidth = Math.min(maxWidthFrom25Ch, maxWidthFromVw);

      // Better width estimation: using measured character width from CSS
      // Approximate: 0.55ch per character for typical fonts at 0.9rem
      const estimatedCharWidth = (0.9 * baseFontSize) * 0.55;
      const tooltipPadding = 2.9 * remInPx; // Left padding includes icon space

      // Estimate actual width considering line wrapping
      let estimatedWidth = (tooltipText.length * estimatedCharWidth) + tooltipPadding;
      if (estimatedWidth > maxWidth) {
        // Text will wrap, so width is capped
        estimatedWidth = maxWidth;
      }

      // Calculate where the tooltip edges would be if centered
      const elementCenterX = elementRect.left + elementRect.width / 2;
      const tooltipLeft = elementCenterX - estimatedWidth / 2;
      const tooltipRight = elementCenterX + estimatedWidth / 2;

      // Check against content container boundaries (excludes sidebar area)
      const safetyMargin = remInPx * 0.5;

      // Add data attributes to control positioning via CSS
      // Only align to edges if there's actually not enough space
      if (tooltipLeft < containerRect.left + safetyMargin) {
        // Would overflow left edge of content area
        element.setAttribute('data-tooltip-align', 'left');
      } else if (tooltipRight > containerRect.right - safetyMargin) {
        // Would overflow right edge of content area
        element.setAttribute('data-tooltip-align', 'right');
      } else {
        // Center is fine - there's enough space
        element.setAttribute('data-tooltip-align', 'center');
      }
    });
  }

  // Install plugin
  function install(hook, vm) {
    // Set up event delegation after DOM is ready
    hook.doneEach(function () {
      // Use event delegation to handle all [data-tooltip] elements
      // This works for both existing and dynamically added elements
      const contentContainer = document.querySelector('section.content');

      if (!contentContainer) return;

      // Remove any existing listener to avoid duplicates
      if (contentContainer._tooltipHandler) {
        contentContainer.removeEventListener('mouseenter', contentContainer._tooltipHandler, true);
      }

      // Create handler for mouseenter events
      const tooltipHandler = function(event) {
        const target = event.target;

        // Check if the target or any parent has data-tooltip
        const tooltipElement = target.closest('[data-tooltip]');

        if (tooltipElement) {
          calculateTooltipPosition(tooltipElement);
        }
      };

      // Store handler reference for cleanup
      contentContainer._tooltipHandler = tooltipHandler;

      // Use capture phase to ensure we catch the event early
      contentContainer.addEventListener('mouseenter', tooltipHandler, true);
    });

    // Clean up on route changes
    hook.beforeEach(function (content, next) {
      const contentContainer = document.querySelector('section.content');
      if (contentContainer && contentContainer._tooltipHandler) {
        contentContainer.removeEventListener('mouseenter', contentContainer._tooltipHandler, true);
        contentContainer._tooltipHandler = null;
      }
      next(content);
    });
  }

  // Add plugin to docsify
  if (window.$docsify) {
    window.$docsify.plugins = [].concat(install, window.$docsify.plugins || []);
  }
})();
