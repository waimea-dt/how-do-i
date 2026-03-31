/**
 * docsify-python-runner.js — Makes ```python run blocks interactive using Codapi's in-browser WASI engine.
 * Python runs entirely in the browser — no server required.
 *
 * Usage in markdown:
 *   ```python run
 *   print("Hello, World!")
 *   ```
 *
 * Also enables real-time syntax error highlighting in the editor via
 * CodeMirror's lint addon (bracket matching, string tracking, etc.)
 *
 * Requires in index.html (in this order, before snippet.js):
 *   <script src="https://unpkg.com/@antonz/runno@0.6.1/dist/runno.js"></script>
 *   <script src="https://unpkg.com/@antonz/codapi@0.20.0/dist/engine/wasi.js"></script>
 *   <script src="https://unpkg.com/@antonz/codapi@0.20.0/dist/snippet.js"></script>
 */

(function () {

    // -------------------------------------------------------------------------
    // Python syntax linter
    //
    // Checks for the structural errors that most commonly trip up students:
    //   - Mismatched or unclosed brackets, parens, and braces
    //   - Unclosed string literals (single or double quoted)
    // Multi-line strings (''' / """) and escape sequences are handled correctly.
    // -------------------------------------------------------------------------

    function pythonLint(text) {
        const errors  = []
        const lines   = text.split('\n')
        const pairs   = { '(': ')', '[': ']', '{': '}' }
        const closers = new Set([')', ']', '}'])
        const stack   = []  // unclosed opening brackets
        let inString  = null  // null | "'" | '"' | "'''" | '"""'

        for (let lineNum = 0; lineNum < lines.length; lineNum++) {
            const line = lines[lineNum]
            let i = 0

            while (i < line.length) {
                const ch = line[i]

                if (inString !== null) {
                    const delim = inString  // save before we might clear it
                    if (line.startsWith(delim, i)) {
                        inString = null
                        i += delim.length
                        continue
                    }
                    if (ch === '\\') { i += 2; continue }  // skip escaped char
                    i++
                    continue
                }

                // Not inside a string — check for string openers, comments, brackets

                const triple = line.slice(i, i + 3)
                if (triple === '"""' || triple === "'''") {
                    inString = triple
                    i += 3
                    continue
                }

                if (ch === '"' || ch === "'") {
                    inString = ch
                    i++
                    continue
                }

                if (ch === '#') break  // rest of line is a comment

                if (ch in pairs) {
                    stack.push({ ch, pos: CodeMirror.Pos(lineNum, i) })
                } else if (closers.has(ch)) {
                    if (!stack.length) {
                        errors.push({
                            from:     CodeMirror.Pos(lineNum, i),
                            to:       CodeMirror.Pos(lineNum, i + 1),
                            message:  `Unexpected '${ch}'`,
                            severity: 'error',
                        })
                    } else {
                        const open = stack[stack.length - 1]
                        if (pairs[open.ch] === ch) {
                            stack.pop()
                        } else {
                            errors.push({
                                from:     CodeMirror.Pos(lineNum, i),
                                to:       CodeMirror.Pos(lineNum, i + 1),
                                message:  `Expected '${pairs[open.ch]}' but got '${ch}'`,
                                severity: 'error',
                            })
                        }
                    }
                }

                i++
            }

            // End of line: a single-char string that wasn't closed is an error
            if (inString !== null && inString.length === 1) {
                errors.push({
                    from:     CodeMirror.Pos(lineNum, 0),
                    to:       CodeMirror.Pos(lineNum, line.length),
                    message:  'Unclosed string literal',
                    severity: 'error',
                })
                inString = null  // recover so we keep checking the rest
            }
        }

        // Any brackets still open at EOF are unclosed
        for (const { ch, pos } of stack) {
            errors.push({
                from:     pos,
                to:       CodeMirror.Pos(pos.line, pos.ch + 1),
                message:  `Unclosed '${ch}'`,
                severity: 'error',
            })
        }

        return errors
    }

    // -------------------------------------------------------------------------
    // Docsify plugin
    // -------------------------------------------------------------------------

    var docsifyPythonRunner = function (hook) {

        // Named setup blocks extracted from the current page.
        // Keys are setup names, values are the raw code strings.
        // Reset on every page load in beforeEach.
        let setupBlocks = {}

        hook.beforeEach(function (content) {
            setupBlocks = {}
            content = content.replace(/\r\n/g, '\n')

            // Extract ```python setup=NAME blocks, store them, and remove from markdown
            content = content.replace(/^```python setup=(\w+)\n([\s\S]*?)^```$/gm, (_, name, code) => {
                setupBlocks[name] = code
                return ''
            })

            // Transform ```python run setup=NAME and plain ```python run fence tags
            content = content.replace(/^```python run setup=(\w+)$/gm, '```python-run-$1')
            content = content.replace(/^```python run$/gm, '```python-run')

            return content
        })

        hook.afterEach(function (html) {
            return html.replace(
                /<pre\b[^>]*\blanguage-python-run(?:-(\w+))?\b[^>]*>[\s\S]*?<\/pre>/g,
                function (preBlock, setupName) {
                    const cleaned = preBlock.replace(/\bpython-run(?:-\w+)?\b/g, 'python')
                    const dataAttr = setupName ? ` data-setup="${setupName}"` : ''
                    return '<div class="codapi-runner">' +
                           cleaned +
                           '</div>' +
                           `<codapi-snippet engine="wasi" sandbox="python" editor="external"${dataAttr}></codapi-snippet>`
                }
            )
        })

        hook.doneEach(function () {
            // Register the linter once (will no-op on subsequent page loads).
            if (!CodeMirror.helpers.lint?.python) {
                CodeMirror.registerHelper('lint', 'python', pythonLint)
            }

            document.querySelectorAll('codapi-snippet[sandbox="python"][editor="external"]').forEach(snippet => {
                // The <pre> may be a direct previous sibling, or inside a wrapper div
                const prev = snippet.previousElementSibling
                const pre = prev && prev.tagName === 'PRE'
                    ? prev
                    : prev && prev.querySelector('pre')
                if (!pre) return

                const code = pre.querySelector('code')
                if (!code) return

                // Look up any named setup code for this snippet
                const setupName = snippet.dataset.setup
                const setupCode = setupName ? (setupBlocks[setupName] ?? '') : ''
                const visibleCode = code.textContent

                // Prepend setup code to what the runner sees, but not what the editor shows
                if (setupCode) code.textContent = setupCode + '\n' + visibleCode

                const cm = CodeMirror(function (editorEl) {
                    pre.parentNode.insertBefore(editorEl, pre)
                }, {
                    value:             visibleCode,
                    mode:              'text/x-python',
                    theme:             'material-darker',
                    lineNumbers:       false,
                    autoCloseBrackets: true,
                    matchBrackets:     true,
                    indentUnit:        4,
                    lineWrapping:      true,
                    viewportMargin:    Infinity,
                    styleActiveLine:   true,
                    lint:              true,
                    gutters:           ['CodeMirror-lint-markers'],
                })

                pre.style.display = 'none'
                cm.on('change', () => {
                    code.textContent = setupCode ? setupCode + '\n' + cm.getValue() : cm.getValue()
                })
            })
        })
    }

    window.$docsify = window.$docsify || {}
    window.$docsify.plugins = [].concat(docsifyPythonRunner, window.$docsify.plugins || [])
})()

