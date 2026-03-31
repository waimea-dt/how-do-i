/**
 * docsify-callouts.js — Enhances Docsify native callout blocks with icon + title rows.
 *
 * After each Docsify render, this plugin finds .callout blocks and prepends a
 * standardized title row using Lucide icons (Note, Tip, Warning, etc.).
 *
 * Usage in markdown:
 *   > [!NOTE]
 *   > This is a note.
 *
 *   > [!WARNING]
 *   > Careful with this step.
 */
(function () {
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

    function processCallouts() {
        // Docsify v5 natively renders [!TYPE] blockquotes into div.callout.<type>.
        // We just need to inject our p.title (with lucide icon) into each one.
        document.querySelectorAll('.markdown-section .callout').forEach(function (callout) {
            // Skip if we've already processed this callout
            if (callout.querySelector('.title')) return

            const type = TYPES.find(t => callout.classList.contains(t.toLowerCase()))
            if (!type) return

            // Build the title row: icon + label
            const title = document.createElement('p')
            title.className = 'title'

            const icon = document.createElement('i')
            icon.setAttribute('data-lucide', ICONS[type])

            title.appendChild(icon)
            title.appendChild(document.createTextNode(LABELS[type]))

            callout.prepend(title)
        })

        // Re-render icon placeholders after DOM injection.
        // Docsify navigates without full page reloads, so this must run per page render.
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

    const docsifyCallouts = function (hook) {
        hook.doneEach(processCallouts)
    }

    window.$docsify = window.$docsify || {}
    window.$docsify.plugins = [].concat(docsifyCallouts, window.$docsify.plugins || [])
})()

