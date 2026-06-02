/**
 * docsify-python-runner.js - Makes ```python run blocks interactive using Codapi's in-browser WASI engine.
 * Python runs entirely in the browser - no server required.
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

    function ensurePythonLintRegistered() {
        if (!window.CodeMirror) return false
        if (!CodeMirror.helpers.lint?.python) {
            CodeMirror.registerHelper('lint', 'python', pythonLint)
        }
        return true
    }

    function initPythonRunnerBlocks(root = document, hiddenBlocks = {}) {
        if (!ensurePythonLintRegistered()) return

        root.querySelectorAll('codapi-snippet[sandbox="python"][editor="external"]:not([data-python-runner-initialized])').forEach(snippet => {
            snippet.dataset.pythonRunnerInitialized = 'true'

            // The <pre> may be a direct previous sibling, or inside a wrapper div
            const prev = snippet.previousElementSibling
            const pre = prev && prev.tagName === 'PRE'
                ? prev
                : prev && prev.querySelector('pre')
            if (!pre) return

            const code = pre.querySelector('code')
            if (!code) return

            // Look up any named hidden code for this snippet
            const dependsName = snippet.dataset.depends
            const hiddenCode = dependsName ? (hiddenBlocks[dependsName] ?? '') : ''
            const visibleCode = code.textContent

            // Prepend hidden code to what the runner sees, but not what the editor shows
            if (hiddenCode) code.textContent = hiddenCode + '\n' + visibleCode

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
                lineWrapping:      false,
                viewportMargin:    Infinity,
                styleActiveLine:   true,
                lint:              true,
                gutters:           ['CodeMirror-lint-markers'],
            })

            pre.style.display = 'none'
            cm.on('change', () => {
                code.textContent = hiddenCode ? hiddenCode + '\n' + cm.getValue() : cm.getValue()
            })
        })
    }

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

                // Not inside a string - check for string openers, comments, brackets

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

        // Named hidden code blocks extracted from the current page.
        // Keys are block IDs, values are the raw code strings.
        // Reset on every page load in beforeEach.
        let hiddenBlocks = {}

        hook.beforeEach(function (content) {
            hiddenBlocks = {}
            content = content.replace(/\r\n/g, '\n')

            // Extract ```python id=NAME blocks, store them, and remove from markdown
            content = content.replace(/^```python id=(\w+)\n([\s\S]*?)^```$/gm, (_, name, code) => {
                hiddenBlocks[name] = code
                return ''
            })

            // Transform ```python run depends=NAME and plain ```python run fence tags
            content = content.replace(/^```python run depends=(\w+)$/gm, '```python-run-$1')
            content = content.replace(/^```python run$/gm, '```python-run')

            return content
        })

        hook.afterEach(function (html) {
            return html.replace(
                /<pre\b[^>]*\blanguage-python-run(?:-(\w+))?\b[^>]*>[\s\S]*?<\/pre>/g,
                function (preBlock, dependsName) {
                    const cleaned = preBlock.replace(/\bpython-run(?:-\w+)?\b/g, 'python')
                    const dataAttr = dependsName ? ` data-depends="${dependsName}"` : ''
                    return '<div class="codapi-runner">' +
                           cleaned +
                           '</div>' +
                           `<codapi-snippet engine="wasi" sandbox="python" editor="external"${dataAttr}></codapi-snippet>`
                }
            )
        })

        hook.doneEach(function () {
            initPythonRunnerBlocks(document, hiddenBlocks)
        })
    }

    window.docsifyPythonRunner = window.docsifyPythonRunner || {}
    window.docsifyPythonRunner.init = initPythonRunnerBlocks

    window.DocsifyUtils.registerPlugin(docsifyPythonRunner)
})()

