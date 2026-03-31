/**
 * docsify-kotlin-runner.js — Handles runnable Kotlin code blocks using Kotlin Playground API.
 *
 * Usage in markdown:
 *   ```kotlin run   →  editable, runnable Kotlin block
 */


(function () {
    var docsifyKotlinRunner = function (hook) {

        // Transform opt-in markers in raw markdown before rendering
        hook.beforeEach(function (content) {
            content = content.replace(
                // Match runnable code blocks, with optional input="..." attribute
                /^```kotlin\s+run(?:\s+input="([^"]*)")?\r?\n([\s\S]*?)^```/gm,
                // And wrap code with fun main() {...} if needed
                function (match, inputAttr, body) {
                    // main() is not there?
                    if (!/fun\s+main\s*\(/.test(body)) {
                        // Inject simulated input if readln() / readlnOrNull() is used
                        const hasReadln = /readln(?:OrNull)?\(\)/.test(body)
                        let preamble = 'import kotlin.math.*\n'
                        if (hasReadln) {
                            // Use per-snippet input="..." values, or fall back to defaults
                            const defaultInputs = ['Alex', 'Smith', '25', '49.99', 'yes', '5', 'London', '42', 'hello', '100']
                            const simulatedInputs = inputAttr
                                ? inputAttr.split(',').map(s => s.trim())
                                : defaultInputs
                            // 'null' entries become Kotlin null; everything else is a quoted string
                            const inputList = simulatedInputs.map(s => s === 'null' ? 'null' : `"${s}"`).join(', ')
                            // Shadow stdlib readln/readlnOrNull with a queue-based simulation.
                            preamble +=
                                `private val __inputs = ArrayDeque<String?>(listOf(${inputList}))\n` +
                                `private fun readln(): String { val v = __inputs.removeFirstOrNull() ?: ""; println(v); return v }\n` +
                                `private fun readlnOrNull(): String? { val v = __inputs.removeFirstOrNull(); if (v != null) println(v) else println("(null)"); return v }\n`
                        }

                        // Fix: uninitialized nullable vars (e.g. `var x: String?`) end with a bare `?`
                        // which the CodeMirror Kotlin mode treats as an incomplete expression and
                        // incorrectly indents the next line. Appending `= null` resolves this.
                        // Append ';' to lines ending with bare '?' to prevent CodeMirror Kotlin mode
                        // from treating them as incomplete expressions and mis-indenting the next line.
                        // The semicolons are stripped back out after the first render (see below).
                        body = body.replace(/^(\s*var\s+\w+\s*:\s*[\w<>.]+\?)\s*$/gm, '$1;')

                        body = preamble + 'fun main() {\n//sampleStart\n' + body + '//sampleEnd\n}\n'
                    }
                    return '<div class="kotlin-run">\n\n```kotlin\n' + body + '```\n\n</div>'
                }
            )
            return content
        })

        // Launcher code runner for runnable code blocks
        hook.doneEach(function () {
            const kotlinCode = '.kotlin-run pre code.lang-kotlin, .kotlin-run pre code.language-kotlin'
            var kotlinCodeBlocks = document.querySelectorAll(kotlinCode)
            if (!kotlinCodeBlocks.length) return

            kotlinCodeBlocks.forEach(codeBlock => {
                codeBlock.setAttribute('theme', 'darcula')
                codeBlock.setAttribute('data-autocomplete', 'true')
                // codeBlock.setAttribute('lines', 'true')
                codeBlock.setAttribute('match-brackets', 'true')
            })

            KotlinPlayground(kotlinCode).then(function () {
                // After the first render, strip the semicolons we injected to fix indentation
                document.querySelectorAll('.kotlin-run .CodeMirror').forEach(function (cmEl) {
                    const cm = cmEl.CodeMirror
                    if (!cm) return
                    const doc = cm.getDoc()
                    for (let i = 0; i < doc.lineCount(); i++) {
                        const line = doc.getLine(i)
                        // Only touch lines matching the pattern we created: `var x: Type?;`
                        if (line && /^\s*var\s+\w+\s*:\s*[\w<>.]+\?;\s*$/.test(line)) {
                            doc.replaceRange(
                                line.replace(/;\s*$/, ''),
                                { line: i, ch: 0 },
                                { line: i, ch: line.length }
                            )
                        }
                    }
                })
            }).catch(function (err) {
                if (!(err instanceof DOMException && err.name === 'AbortError')) throw err
            })
        })
    }

    window.$docsify = window.$docsify || {}
    window.$docsify.plugins = [].concat(docsifyKotlinRunner, window.$docsify.plugins || [])
})();

