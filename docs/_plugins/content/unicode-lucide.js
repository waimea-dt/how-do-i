/**
 * unicode-lucide.js - Replaces selected unicode symbols with Lucide icon placeholders.
 *
 * Converts symbols in markdown content before Docsify renders HTML.
 * Keeps code fences and inline code unchanged.
 *
 * Replacements:
 *   ✅ -> check
 *   ⚠️ -> triangle-alert
 *   ❌ -> x
 */
;(function () {
    'use strict'

    const REPLACEMENTS = [
        {
            symbol: '✅',
            html: '<i class="unicode-lucide unicode-lucide-check" data-lucide="check" style="color: var(--color-good); stroke-width: 3;"></i>',
        },
        {
            symbol: '⚠️',
            html: '<i class="unicode-lucide unicode-lucide-warning" data-lucide="triangle-alert" style="color: var(--color-warning); stroke-width: 3;"></i>',
        },
        {
            symbol: '❌',
            html: '<i class="unicode-lucide unicode-lucide-error" data-lucide="x" style="color: var(--color-attention); stroke-width: 3;"></i>',
        },
    ]

    function replaceSymbols(value) {
        let output = String(value || '')

        REPLACEMENTS.forEach(replacement => {
            output = output.split(replacement.symbol).join(replacement.html)
        })

        return output
    }

    function replaceOutsideInlineCode(line) {
        const parts = String(line || '').split(/(`+[^`]*`+)/g)

        return parts.map(part => {
            if (/^`+[^`]*`+$/.test(part)) return part
            return replaceSymbols(part)
        }).join('')
    }

    function replaceUnicodeWithLucide(markdown) {
        const lines = String(markdown || '').split('\n')
        let inFence = false
        let fenceChar = ''

        return lines.map(line => {
            const trimmed = line.trimStart()
            const fenceMatch = trimmed.match(/^(```+|~~~+)/)

            if (!inFence && fenceMatch) {
                inFence = true
                fenceChar = fenceMatch[1][0]
                return line
            }

            if (inFence) {
                const closeFencePattern = new RegExp(`^${fenceChar}{3,}`)
                if (closeFencePattern.test(trimmed)) {
                    inFence = false
                    fenceChar = ''
                }
                return line
            }

            return replaceOutsideInlineCode(line)
        }).join('\n')
    }

    const docsifyUnicodeLucide = function (hook) {
        hook.beforeEach(function (content) {
            return replaceUnicodeWithLucide(content)
        })
    }

    window.DocsifyUtils.registerPlugin(docsifyUnicodeLucide)
})()