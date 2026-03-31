/**
 * docsify-scroll-to-top.js — Resets the page scroll position on Docsify navigation.
 *
 * Docsify is client-side routed, so normal browser page-load scroll reset does not
 * happen automatically. This plugin restores that behavior after each route render.
 *
 * Usage in markdown:
 *   No markdown syntax. Lifecycle plugin only.
 */
(function () {
    var docsifyScrollToTop = function (hook) {
        hook.doneEach(function () {
            // Docsify route changes do not reload the document, so preserve classic page-load behavior manually.
            window.scrollTo(0, 0);
        });
    };

    window.$docsify = window.$docsify || {};
    window.$docsify.plugins = [docsifyScrollToTop].concat(window.$docsify.plugins || []);
})();

