/**
 * docsify-sql-runner.js — Makes ```sql run blocks interactive using Codapi's SQLite sandbox.
 *
 * Usage in markdown:
 *   ```sql run setup=create
 *   CREATE TABLE cats (id INTEGER PRIMARY KEY, name TEXT);
 *   ```
 *
 *   ```sql run depends=create
 *   SELECT * FROM cats;
 *   ```
 *
 * Supports dependencies between snippets:
 *   ```sql run setup=create    → creates a named setup block
 *   ```sql run depends=create  → depends on the setup block
 *
 * Also enables real-time syntax error highlighting in the editor via
 * CodeMirror's lint addon (bracket matching, string tracking, etc.)
 *
 * Requires in index.html (in this order):
 *   <script src="https://unpkg.com/@antonz/codapi@0.20.0/dist/snippet.js"></script>
 */

(function () {

    // -------------------------------------------------------------------------
    // SQL syntax linter
    //
    // Checks for the structural errors that commonly occur in SQL:
    //   - Mismatched or unclosed parentheses
    //   - Unclosed string literals (single-quoted in SQL)
    //   - Unclosed block comments (/* */)
    // -------------------------------------------------------------------------

    function sqlLint(text) {
        const errors = []
        const lines = text.split('\n')
        const stack = []  // unclosed opening parentheses
        let inString = false
        let inBlockComment = false

        for (let lineNum = 0; lineNum < lines.length; lineNum++) {
            const line = lines[lineNum]
            let i = 0

            while (i < line.length) {
                const ch = line[i]
                const nextCh = line[i + 1]

                // Handle block comments /* */
                if (!inString && !inBlockComment && ch === '/' && nextCh === '*') {
                    inBlockComment = true
                    i += 2
                    continue
                }

                if (inBlockComment) {
                    if (ch === '*' && nextCh === '/') {
                        inBlockComment = false
                        i += 2
                        continue
                    }
                    i++
                    continue
                }

                // Handle single-line comments --
                if (!inString && ch === '-' && nextCh === '-') {
                    break  // rest of line is a comment
                }

                // Handle string literals (single quotes in SQL)
                if (inString) {
                    if (ch === "'") {
                        // Check for escaped quote '' in SQL
                        if (nextCh === "'") {
                            i += 2
                            continue
                        }
                        inString = false
                    }
                    i++
                    continue
                }

                if (ch === "'") {
                    inString = true
                    i++
                    continue
                }

                // Handle parentheses
                if (ch === '(') {
                    stack.push({ ch, pos: CodeMirror.Pos(lineNum, i) })
                } else if (ch === ')') {
                    if (!stack.length) {
                        errors.push({
                            from:     CodeMirror.Pos(lineNum, i),
                            to:       CodeMirror.Pos(lineNum, i + 1),
                            message:  'Unexpected closing parenthesis',
                            severity: 'error',
                        })
                    } else {
                        stack.pop()
                    }
                }

                i++
            }

            // End of line: unclosed string is an error
            if (inString) {
                errors.push({
                    from:     CodeMirror.Pos(lineNum, 0),
                    to:       CodeMirror.Pos(lineNum, line.length),
                    message:  'Unclosed string literal',
                    severity: 'error',
                })
                inString = false  // recover so we keep checking the rest
            }
        }

        // Any parentheses still open at EOF are unclosed
        for (const { ch, pos } of stack) {
            errors.push({
                from:     pos,
                to:       CodeMirror.Pos(pos.line, pos.ch + 1),
                message:  'Unclosed parenthesis',
                severity: 'error',
            })
        }

        // Unclosed block comment at EOF
        if (inBlockComment) {
            errors.push({
                from:     CodeMirror.Pos(0, 0),
                to:       CodeMirror.Pos(lines.length - 1, lines[lines.length - 1].length),
                message:  'Unclosed block comment',
                severity: 'error',
            })
        }

        return errors
    }

    // -------------------------------------------------------------------------
    // Docsify plugin
    // -------------------------------------------------------------------------

    var docsifySqlRunner = function (hook) {

        let snippetCounter = 0

        hook.beforeEach(function (content) {
            snippetCounter = 0
            content = content.replace(/\r\n/g, '\n')

            // Transform all variations of ```sql run to sql-run with attributes preserved
            // Capture: setup=NAME, depends=NAME, or both, or neither
            content = content.replace(
                /^```sql run(?:\s+setup=(\w+))?(?:\s+depends=(\w+))?$/gm,
                function(match, setupName, dependsName) {
                    let className = 'sql-run'
                    if (setupName) className += `-setup-${setupName}`
                    if (dependsName) className += `-depends-${dependsName}`
                    return '```' + className
                }
            )

            return content
        })

        hook.afterEach(function (html) {
            return html.replace(
                /<pre\b[^>]*\blanguage-sql-run(?:-setup-(\w+))?(?:-depends-(\w+))?\b[^>]*>[\s\S]*?<\/pre>/g,
                function (preBlock, setupName, dependsName) {
                    const cleaned = preBlock.replace(/\bsql-run(?:-setup-\w+)?(?:-depends-\w+)?\b/g, 'sql')
                    const snippetId = setupName || `sql-snippet-${++snippetCounter}`
                    const dependsAttr = dependsName ? ` depends-on="${dependsName}"` : ''

                    return '<div class="codapi-runner">' +
                           cleaned +
                           '</div>' +
                           `<codapi-snippet id="${snippetId}" sandbox="sqlite" editor="external"${dependsAttr}></codapi-snippet>`
                }
            )
        })

        hook.doneEach(function () {
            // Register the linter once (will no-op on subsequent page loads)
            if (!CodeMirror.helpers.lint?.sql) {
                CodeMirror.registerHelper('lint', 'sql', sqlLint)
            }

            document.querySelectorAll('codapi-snippet[sandbox="sqlite"][editor="external"]').forEach(snippet => {
                // Skip if already initialized
                if (snippet.dataset.initialized === 'true') return

                // Find the wrapper div and the pre inside it
                const wrapper = snippet.previousElementSibling
                if (!wrapper || !wrapper.classList.contains('codapi-runner')) return

                const pre = wrapper.querySelector('pre')
                if (!pre) return

                const code = pre.querySelector('code')
                if (!code) return

                const visibleCode = code.textContent

                // Create CodeMirror editor
                const cm = CodeMirror(function (editorEl) {
                    wrapper.insertBefore(editorEl, pre)
                }, {
                    value:             visibleCode,
                    mode:              'text/x-sqlite',
                    theme:             'material-darker',
                    lineNumbers:       false,
                    autoCloseBrackets: true,
                    matchBrackets:     true,
                    indentUnit:        2,
                    lineWrapping:      false,
                    viewportMargin:    Infinity,
                    styleActiveLine:   true,
                    lint:              true,
                    gutters:           ['CodeMirror-lint-markers'],
                })

                // Sync CodeMirror changes to the <code> element (for Codapi to pick up)
                cm.on('change', function () {
                    code.textContent = cm.getValue()
                })

                // Hide the original <pre> block
                pre.style.display = 'none'

                // Mark as initialized
                snippet.dataset.initialized = 'true'
            })
        })
    }

    window.$docsify = window.$docsify || {}
    window.$docsify.plugins = [].concat(docsifySqlRunner, window.$docsify.plugins || [])

})();

