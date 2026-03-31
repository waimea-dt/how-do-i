/**
 * docsify-lucide-icons.js — Renders Lucide SVG icons from data-lucide placeholders.
 *
 * After each Docsify route render, this plugin runs lucide.createIcons() so icon
 * placeholders added by markdown and other plugins become SVG icons.
 *
 * Usage in markdown:
 *   <i data-lucide="lightbulb"></i>
 *
 * Also used indirectly by other plugins that inject <i data-lucide="..."></i>.
 */
(function () {
    var docsifyLucideIcons = function (hook) {
        hook.doneEach(function () {
            // doneEach is required because Docsify swaps page content via client-side routing.
            lucide.createIcons({
                attrs: {
                    class: ['icon'],
                    'stroke-width': 2,
                    stroke: 'currentColor'
                },
            })
        })
    }

    window.$docsify = window.$docsify || {}
    window.$docsify.plugins = [].concat(docsifyLucideIcons, window.$docsify.plugins || [])
})();

