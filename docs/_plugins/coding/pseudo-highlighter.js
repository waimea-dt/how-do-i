/**
 * docsify-pseudo-highlighter.js — Highlights ```pseudo code blocks using a line-based keyword classifier.
 * Each line is wrapped in a <span> whose class reflects the type of statement.
 *
 * Usage in markdown:
 *   ```pseudo
 *   if age > 18
 *       show "Adult"
 *   endif
 *   ```
 *
 * Supported statement types (determined by the first word on the line):
 *   comment   — // or #
 *   block     — start, begin, end, function, procedure, return
 *   output    — say, show, print, display
 *   input     — get, ask, read
 *   decision  — if, else, elseif, elif, otherwise, endif
 *   loop      — repeat, until, while, endwhile, endrepeat, do, forever
 *   action    — everything else (assignments, expressions, etc.)
 *
 * Inline block highlighting within action lines:
 *   call funcName(params)          — 'call funcName(' and ')' highlighted as block
 *   result = call funcName(params) — rendered with ← instead of =
 */

(function () {

    var pseudoHighlighter = function (hook) {

        hook.doneEach(function () {
            document.querySelectorAll('pre code.language-pseudo').forEach(highlightElement)
        })

    }


    function highlightElement(element) {
        const code = element.textContent
        if (!code) return

        const lines = code.trimEnd().split('\n')
        element.innerHTML = lines.map(highlightLine).join('\n')
    }


    function highlightLine(line) {
        if (line.trim().length === 0) return ''

        const indent = line.match(/^(\s*)/)[1]
        const content = line.trimStart()
        const type = classifyLine(content)

        if (type === 'action') {
            return indent + highlightFunctionCalls(content)
        }
        return `${indent}<span class="${type}">${content}</span>`
    }


    // Highlights  call funcName(params)  within action lines.
    // 'call funcName(...)' is styled as function; surrounding text as action.
    // Writing  = call  in source renders as  ← call.
    // All other assignments (variable = value) also render with ←.
    function highlightFunctionCalls(content) {
        content = content.replace(/=\s*(call\s)/g, '\u2190 $1')
        content = content.replace(/(?<![!<>=])=(?!=)/g, '\u2190')

        const parts = []
        let last = 0
        const re = /\bcall\s+(\w+)(\s*\([^)]*\))/g
        let match
        while ((match = re.exec(content)) !== null) {
            if (match.index > last) {
                parts.push(`<span class="action">${content.slice(last, match.index)}</span>`)
            }
            parts.push(`<span class="function">call ${match[1]}${match[2]}</span>`)
            last = match.index + match[0].length
        }
        if (last < content.length) {
            parts.push(`<span class="action">${content.slice(last)}</span>`)
        }
        return parts.length ? parts.join('') : `<span class="action">${content}</span>`
    }


    function classifyLine(line) {
        const firstWord = line.split(/\s+/)[0].toLowerCase()

        switch (firstWord) {
            case '//':
            case '#':
                return 'comment'

            case 'start':
            case 'begin':
            case 'end':
            case 'function':
            case 'procedure':
            case 'return':
                return 'block'

            case 'say':
            case 'show':
            case 'print':
            case 'display':
            case 'output':
                return 'output'

            case 'get':
            case 'ask':
            case 'read':
            case 'input':
                return 'input'

            case 'if':
            case 'else':
            case 'elseif':
            case 'elif':
            case 'otherwise':
            case 'endif':
                return 'decision'

            case 'repeat':
            case 'until':
            case 'while':
            case 'endwhile':
            case 'endrepeat':
            case 'do':
            case 'forever':
            case 'for':
            case 'endfor':
            case 'next':
            case 'break':
            case 'continue':
                return 'loop'

            default:
                return 'action'
        }
    }


    window.$docsify = window.$docsify || {}
    window.$docsify.plugins = [].concat(pseudoHighlighter, window.$docsify.plugins || [])

})()

