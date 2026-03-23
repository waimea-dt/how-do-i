// docsify-python-runner.js
// Makes ```python run blocks interactive using Codapi's in-browser WASI engine.
// Python runs entirely in the browser — no server required.
//
// Requires in index.html (in this order, before snippet.js):
//   <script src="https://unpkg.com/@antonz/runno@0.6.1/dist/runno.js"></script>
//   <script src="https://unpkg.com/@antonz/codapi@0.20.0/dist/engine/wasi.js"></script>
//   <script src="https://unpkg.com/@antonz/codapi@0.20.0/dist/snippet.js"></script>

(function () {
    var docsifyPythonRunner = function (hook) {

        hook.beforeEach(function (content) {
            return content.replace(/^```python run$/gm, '```python-run')
        })

        hook.afterEach(function (html) {
            return html.replace(
                /(<pre\b[^>]*\blanguage-python-run\b[^>]*>[\s\S]*?<\/pre>)/g,
                function (preBlock) {
                    const cleaned = preBlock.replace(/\bpython-run\b/g, 'python')
                    return '<div class="codapi-runner">' +
                           cleaned +
                           '</div>' +
                           '<codapi-snippet engine="wasi" sandbox="python" editor="external"></codapi-snippet>'
                }
            )
        })

        hook.doneEach(function () {
            document.querySelectorAll('codapi-snippet[editor="external"]').forEach(snippet => {
                // The <pre> may be a direct previous sibling, or inside a wrapper div
                const prev = snippet.previousElementSibling
                const pre = prev && prev.tagName === 'PRE'
                    ? prev
                    : prev && prev.querySelector('pre')
                if (!pre) return

                const code = pre.querySelector('code')
                if (!code) return

                const cm = CodeMirror(function (editorEl) {
                    pre.parentNode.insertBefore(editorEl, pre)
                }, {
                    value: code.textContent,
                    mode: 'python',
                    theme: 'material-darker',
                    lineNumbers: false,
                    autoCloseBrackets: true,
                    matchBrackets: true,
                    indentUnit: 4,
                    lineWrapping: true,
                    viewportMargin: Infinity,
                    styleActiveLine: true
                })

                pre.style.display = 'none'
                cm.on('change', () => { code.textContent = cm.getValue() })
            })
        })
    }

    window.$docsify = window.$docsify || {}
    window.$docsify.plugins = [].concat(docsifyPythonRunner, window.$docsify.plugins || [])
})()
