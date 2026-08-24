/**
 * docsify-callouts.js - Enhances Docsify callout blocks with icon + title rows.
 *
 * Docsify route caching can occasionally return plain blockquotes instead of
 * .callout nodes. This plugin restores missing callout classes from markdown
 * source and then injects a consistent title row.
 */
(function () {
    const CALLOUT_TITLE_CLASS = 'callout-title'

    const ICONS = {
        NOTE: 'info',
        TIP: 'lightbulb',
        QUESTION: 'circle-help',
        EXAMPLE: 'pointer',
        IMPORTANT: 'circle-alert',
        WARNING: 'triangle-alert',
        ATTENTION: 'bell-ring',
        DANGER: 'skull',
    }

    const LABELS = {
        NOTE: 'Note',
        TIP: 'Tip',
        QUESTION: 'Question',
        EXAMPLE: 'Example',
        IMPORTANT: 'Important',
        WARNING: 'Warning',
        ATTENTION: 'Attention',
        DANGER: 'Danger',
    }

    const TYPES = Object.keys(ICONS)
    const MARKER_LINE_RE = new RegExp(`^\\s*>\\s*\\[!(${TYPES.join('|')})\\]\\s*$`, 'i')
    const SOURCE_CACHE = new Map()

    function resolveScope(root) {
        return root && typeof root.querySelectorAll === 'function' ? root : document
    }

    function normalizeText(value) {
        return String(value || '').replace(/\s+/g, ' ').trim()
    }

    function normalizeMarkdownInline(value) {
        return normalizeText(String(value || '')
            .replace(/`([^`]+)`\([a-z0-9-]+\)/gi, '$1')
            .replace(/`([^`]+)`/g, '$1')
            .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
            .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
            .replace(/\*\*([^*]+)\*\*/g, '$1')
            .replace(/__([^_]+)__/g, '$1')
            .replace(/\*([^*]+)\*/g, '$1')
            .replace(/_([^_]+)_/g, '$1'))
    }

    function currentDocPath() {
        const hash = String(window.location.hash || '').replace(/^#\/?/, '')
        const route = hash.split('?')[0].trim() || String(window.$docsify?.homepage || 'README.md')
        if (!route) return ''
        if (route.endsWith('.md')) return route
        return route.endsWith('/') ? `${route}README.md` : `${route}.md`
    }

    function extractSourceCallouts(markdown) {
        const lines = String(markdown || '').replace(/\r\n/g, '\n').split('\n')
        const callouts = []

        for (let index = 0; index < lines.length; index += 1) {
            const marker = lines[index].match(MARKER_LINE_RE)
            if (!marker) continue

            const type = marker[1].toUpperCase()
            const body = []

            index += 1
            while (index < lines.length && /^\s*>/.test(lines[index])) {
                body.push(lines[index].replace(/^\s*>\s?/, ''))
                index += 1
            }
            index -= 1

            const text = normalizeMarkdownInline(body.join(' '))
            if (text) callouts.push({ type, text })
        }

        return callouts
    }

    async function getSourceCallouts() {
        const path = currentDocPath()
        if (!path) return []

        if (SOURCE_CACHE.has(path)) return SOURCE_CACHE.get(path)

        try {
            const response = await fetch(path, { cache: 'no-store' })
            if (!response.ok) {
                SOURCE_CACHE.set(path, [])
                return []
            }

            const markdown = await response.text()
            const parsed = extractSourceCallouts(markdown)
            SOURCE_CACHE.set(path, parsed)
            return parsed
        } catch (_error) {
            SOURCE_CACHE.set(path, [])
            return []
        }
    }

    function recoverPlainBlockquotes(root, sourceCallouts) {
        if (!sourceCallouts.length) return

        const scope = resolveScope(root)
        const selector = scope === document
            ? '.markdown-section blockquote:not(.callout)'
            : 'blockquote:not(.callout)'
        const remaining = sourceCallouts.slice()

        scope.querySelectorAll(selector).forEach(function (blockquote) {
            const text = normalizeText(blockquote.textContent)
            if (!text) return

            const matchIndex = remaining.findIndex(function (entry) {
                return text === entry.text || text.startsWith(entry.text) || entry.text.startsWith(text)
            })

            if (matchIndex === -1) return

            const match = remaining.splice(matchIndex, 1)[0]
            blockquote.classList.add('callout', match.type.toLowerCase())
        })
    }

    function addTitles(root) {
        const scope = resolveScope(root)
        const selector = scope === document ? '.markdown-section .callout' : '.callout'

        scope.querySelectorAll(selector).forEach(function (callout) {
            const firstChild = callout.firstElementChild
            if (firstChild && firstChild.classList.contains(CALLOUT_TITLE_CLASS)) return

            const type = TYPES.find(t => callout.classList.contains(t.toLowerCase()))
            if (!type) return

            const title = document.createElement('p')
            title.className = CALLOUT_TITLE_CLASS

            const icon = document.createElement('i')
            icon.setAttribute('data-lucide', ICONS[type])

            title.appendChild(icon)
            title.appendChild(document.createTextNode(LABELS[type]))
            callout.prepend(title)
        })

        if (window.lucide) {
            lucide.createIcons({
                attrs: {
                    class: ['icon', 'no-zoom'],
                    'stroke-width': 2,
                    stroke: 'currentColor',
                },
            })
        }
    }

    function runCalloutPass(root) {
        addTitles(root)

        getSourceCallouts().then(function (sourceCallouts) {
            recoverPlainBlockquotes(root || document, sourceCallouts)
            addTitles(root)
        })
    }

    const docsifyCallouts = function (hook) {
        hook.doneEach(function () {
            runCalloutPass(document)
        })

        hook.ready(function () {
            window.addEventListener('hashchange', function () {
                runCalloutPass(document)
            })

            window.DocsifyUtils.onSlidesRendered(function (root) {
                runCalloutPass(root)
            })
        })
    }

    window.DocsifyUtils.registerPlugin(docsifyCallouts)
})()
