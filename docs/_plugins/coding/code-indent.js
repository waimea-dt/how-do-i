/**
 * docsify-code-indent.js - Indentation guides for fenced code blocks.
 *
 * Usage:
 *   ```python show-indent
 *   code here
 *   ```
 *
 *   ```python show-indent [2-3, 5, 10]
 *   code here
 *   ```
 *
 * The optional [lines] spec also highlights those lines via the Prism
 * line-highlight plugin (same behaviour as the code-line-highlight plugin,
 * but the separator can be either | or ,).
 *
 * Leading whitespace on each code line is wrapped in <span class="whitespace">
 * so that code-indent.css can paint coloured indent guides.
 */

(function () {
    const MARKER_PREFIX = 'CODEINDENT:'

    // Matches: ```lang show-indent  or  ```lang show-indent [lines]
    const FENCE_REGEX = /^```([^\s\[]+)\s+show-indent(?:\s+\[([^\]\n]+)\])?\s*$/gm

    const MARKER_REGEX = new RegExp(
        `<p>${MARKER_PREFIX}([^<]*)</p>\\s*(<pre\\b[^>]*>[\\s\\S]*?<\\/pre>)`,
        'g'
    )

    // Wrap leading whitespace on each line with a span the CSS can target
    function addIndentGuides(pre) {
        const code = pre.querySelector('code')
        if (!code) return

        code.innerHTML = code.innerHTML.replace(
            /(^|\n)([ \t]+)/g,
            (_, nl, ws) => `${nl}<span class="whitespace">${ws}</span>`
        )
    }

    function applyLineHighlights(root = document) {
        const highlightLines = window.Prism?.plugins?.lineHighlight?.highlightLines
        if (typeof highlightLines !== 'function') return

        root.querySelectorAll('.markdown-section pre[data-line]').forEach(pre => {
            const mutateDom = highlightLines(pre)
            if (typeof mutateDom === 'function') mutateDom()
        })
    }

    const docsifyCodeIndent = function (hook) {
        // Strip show-indent (and optional [lines]) from the fence header,
        // replacing with a plain-text marker paragraph
        hook.beforeEach(function (content) {
            return content.replace(FENCE_REGEX, (_, lang, lines) => {
                const spec = lines ? lines.trim() : ''
                return `${MARKER_PREFIX}${spec}\n\n\`\`\`${lang}`
            })
        })

        // Attach a data attribute to the <pre> so doneEach can identify it
        hook.afterEach(function (html) {
            return html.replace(MARKER_REGEX, (_, spec, preBlock) => {
                return preBlock.replace(/<pre\b/, `<pre data-show-indent="${spec.trim()}"`)
            })
        })

        hook.doneEach(function () {
            document
                .querySelectorAll('.markdown-section pre[data-show-indent]:not(.show-indent-done)')
                .forEach(pre => {
                    pre.classList.add('show-indent', 'show-indent-done')

                    const lineSpec = pre.getAttribute('data-show-indent')
                    if (lineSpec) {
                        // Normalise both | and , separators
                        const lines = lineSpec.replace(/\|/g, ',')
                        pre.setAttribute('data-line', lines)
                    }

                    addIndentGuides(pre)
                })

            applyLineHighlights(document)
        })
    }

    window.DocsifyUtils.registerPlugin(docsifyCodeIndent)
})()
