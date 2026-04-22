/**
 * docsify-scroll-to-top.js - Resets the page scroll position on Docsify navigation.
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
            // Use requestAnimationFrame to ensure this runs after all DOM updates
            // and other plugins have finished their work
            requestAnimationFrame(function () {
                // Scroll both window and the main content area
                window.scrollTo({ top: 0, behavior: 'instant' });

                // Also try scrolling the main content container if it exists
                var main = document.querySelector('.markdown-section');
                if (main && main.parentElement) {
                    main.parentElement.scrollTop = 0;
                }

                // Reset document scroll as fallback
                document.documentElement.scrollTop = 0;
                document.body.scrollTop = 0;
            });
        });
    };

    window.$docsify = window.$docsify || {};
    window.$docsify.plugins = [].concat(docsifyScrollToTop, window.$docsify.plugins || []);
})();

