/**
 * docsify-tooltips.js - Smart positioning for any element with data-tooltip
 *
 * This plugin renders a single shared tooltip element appended directly to
 * <body> (a "portal") and positions it with fixed coordinates on hover,
 * rather than using a CSS ::before pseudo-element on the trigger itself.
 * A pseudo-element is clipped by (and stretches the scroll area of) any
 * ancestor with overflow set, e.g. a table wrapper - portalling to <body>
 * avoids that entirely, and also lets us measure the tooltip's real
 * rendered size instead of estimating it.
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
  let tooltipEl = null;

  function getTooltipElement() {
    if (tooltipEl) return tooltipEl;

    tooltipEl = document.createElement('div');
    tooltipEl.className = 'dt-tooltip';
    document.body.appendChild(tooltipEl);
    return tooltipEl;
  }

  function showTooltip(element) {
    const tooltipText = element.getAttribute('data-tooltip');
    if (!tooltipText) return;

    const contentContainer = document.querySelector('section.content');
    if (!contentContainer) return;

    const tooltip = getTooltipElement();
    tooltip.textContent = tooltipText;

    // Render (invisibly) first so we can measure its real size
    tooltip.classList.remove('is-visible');
    const tooltipRect = tooltip.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    const containerRect = contentContainer.getBoundingClientRect();
    const baseFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const safetyMargin = baseFontSize * 0.5;
    const gap = baseFontSize; // matches --space (1rem) used as the trigger-to-tooltip gap

    // Centre under the trigger by default, then clamp to the content bounds
    let left = elementRect.left + elementRect.width / 2 - tooltipRect.width / 2;
    const minLeft = containerRect.left + safetyMargin;
    const maxLeft = containerRect.right - safetyMargin - tooltipRect.width;
    left = Math.min(Math.max(left, minLeft), maxLeft);

    let top = elementRect.bottom + gap;

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
    tooltip.classList.add('is-visible');
  }

  function hideTooltip() {
    if (tooltipEl) {
      tooltipEl.classList.remove('is-visible');
    }
  }

  // Install plugin
  function install(hook, vm) {
    // Set up event delegation after DOM is ready
    hook.doneEach(function () {
      // Use event delegation to handle all [data-tooltip] elements
      // This works for both existing and dynamically added elements
      const contentContainer = document.querySelector('section.content');

      if (!contentContainer) return;

      // Remove any existing listeners to avoid duplicates
      if (contentContainer._tooltipEnterHandler) {
        contentContainer.removeEventListener('mouseenter', contentContainer._tooltipEnterHandler, true);
        contentContainer.removeEventListener('mouseleave', contentContainer._tooltipLeaveHandler, true);
      }

      const tooltipEnterHandler = function (event) {
        const target = event.target;
        const tooltipElement = target.closest('[data-tooltip]');
        if (tooltipElement) {
          showTooltip(tooltipElement);
        }
      };

      const tooltipLeaveHandler = function (event) {
        const target = event.target;
        if (target.closest('[data-tooltip]')) {
          hideTooltip();
        }
      };

      contentContainer._tooltipEnterHandler = tooltipEnterHandler;
      contentContainer._tooltipLeaveHandler = tooltipLeaveHandler;

      // Use capture phase to ensure we catch the event early
      contentContainer.addEventListener('mouseenter', tooltipEnterHandler, true);
      contentContainer.addEventListener('mouseleave', tooltipLeaveHandler, true);
    });

    // Clean up on route changes
    hook.beforeEach(function (content, next) {
      const contentContainer = document.querySelector('section.content');
      if (contentContainer && contentContainer._tooltipEnterHandler) {
        contentContainer.removeEventListener('mouseenter', contentContainer._tooltipEnterHandler, true);
        contentContainer.removeEventListener('mouseleave', contentContainer._tooltipLeaveHandler, true);
        contentContainer._tooltipEnterHandler = null;
        contentContainer._tooltipLeaveHandler = null;
      }
      hideTooltip();
      next(content);
    });
  }

  // Add plugin to docsify
  window.DocsifyUtils.registerPlugin(install)
})();
