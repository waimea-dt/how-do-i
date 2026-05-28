/**
 * docsify-callouts.js - Transform and enhance callout blocks with icon + title rows.
 *
 * Converts blockquotes with [!TYPE] markers into styled callout divs and adds
 * a title row with Lucide icons. Handles both Docsify's native callout rendering
 * and transforms raw blockquotes directly for consistent behavior across navigations.
 *
 * Usage in markdown:
 *   > [!NOTE]
 *   > This is a note.
 *
 *   > [!WARNING]
 *   > Careful with this step.
 */
(function () {
    function resolveScope(root) {
        return root && typeof root.querySelectorAll === 'function' ? root : document
    }

    const ICONS = {
        NOTE:      'info',
        TIP:       'lightbulb',
        QUESTION:  'circle-help',
        EXAMPLE:   'pointer',
        IMPORTANT: 'circle-alert',
        WARNING:   'triangle-alert',
        ATTENTION: 'bell-ring',
        DANGER:    'skull',
    }

    const LABELS = {
        NOTE:      'Note',
        TIP:       'Tip',
        QUESTION:  'Question',
        EXAMPLE:   'Example',
        IMPORTANT: 'Important',
        WARNING:   'Warning',
        ATTENTION: 'Attention',
        DANGER:    'Danger',
    }

    const TYPES = Object.keys(ICONS)

    /**
     * Add title row with icon to a callout div
     */
    function addCalloutTitle(callout, type) {
        const title = document.createElement('p')
        title.className = 'callout-title'

        const icon = document.createElement('i')
        icon.setAttribute('data-lucide', ICONS[type])

        title.appendChild(icon)
        title.appendChild(document.createTextNode(LABELS[type]))

        callout.prepend(title)
    }

    function processCallouts(root) {
        const scope = resolveScope(root)
        const selector = scope === document
            ? '.markdown-section .callout'
            : '.callout'

        scope.querySelectorAll(selector).forEach(function (callout) {
            // Skip if we've already processed this callout
            if (callout.querySelector(':scope > .callout-title')) return

            const type = TYPES.find(t => callout.classList.contains(t.toLowerCase()))
            if (type) {
                addCalloutTitle(callout, type)
            }
        })

        // Re-render icon placeholders after DOM injection
        if (window.lucide) {
            lucide.createIcons({
                attrs: {
                    class: ['icon'],
                    'stroke-width': 2,
                    stroke: 'currentColor',
                },
            })
        }
    }

    /**
     * Convert callout markdown to HTML before Docsify processes it
     */
    function preprocessCallouts(markdown) {
        // Match blockquotes that start with [!TYPE]
        const calloutRegex = /^>\s*\[!(NOTE|TIP|QUESTION|EXAMPLE|IMPORTANT|WARNING|ATTENTION|DANGER)\]\s*\n((?:>.*\n?)*)/gim

        return markdown.replace(calloutRegex, function (match, type, content) {
            // Remove leading '>' from content lines
            const cleanContent = content.replace(/^>\s?/gm, '').trim()

            // Return a div that won't be affected by Docsify's blockquote processing
            return '<div class="callout ' + type.toLowerCase() + '" data-callout-type="' + type + '">\n\n' + cleanContent + '\n\n</div>\n\n'
        })
    }

    const docsifyCallouts = function (hook) {
        // Transform markdown before Docsify processes it
        hook.beforeEach(function (markdown) {
            return preprocessCallouts(markdown)
        })

        // Add title rows to callout divs after HTML is rendered
        hook.doneEach(function () {
            processCallouts()
        })

        hook.ready(function () {
            window.DocsifyUtils.onSlidesRendered(function (root) {
                processCallouts(root)
            })
        })
    }

    window.DocsifyUtils.registerPlugin(docsifyCallouts)
})()

