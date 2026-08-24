/**
 * docsify-lucide-icons.js - Renders Lucide SVG icons from data-lucide placeholders.
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
            if (!window.lucide?.createIcons) return

            lucide.createIcons({
                attrs: {
                    class: ['icon', 'no-zoom'],
                    'stroke-width': 2,
                    stroke: 'currentColor'
                },
            })
        })
    }

    window.DocsifyUtils.registerPlugin(docsifyLucideIcons)
})();

