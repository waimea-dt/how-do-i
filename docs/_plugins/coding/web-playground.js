/**
 * docsify-web-playground.js - Live HTML/CSS/JS editor widget, implemented as a Docsify plugin.
 *
 * On each page load, every <div class="web-playground"> is automatically turned into
 * a side-by-side (or stacked on small screens) editor + live preview.
 * All editors are visible at once so students can see the effect of their edits immediately.
 *
 * Requires codemirror.js and the xml, css, javascript, htmlmixed modes and
 * closetag addon to be loaded in index.html before this script runs.
 *
 * Usage in markdown:
 *   <div
 *       class="web-playground"
 *       data-html="_demos/file.html"
 *       data-css="_demos/file.css"
 *       data-js="_demos/file.js"
 *       data-height="40em"
 *   ></div>
 *
 * Paths are relative to the current page's directory.
 * Prefix a path with / to make it relative to the docs root instead.
 */

(function () {

    // Resolve a data-html/css/js path against the current page's directory.
    // A leading / means root-relative (docs root); otherwise page-relative.
    function resolvePath(path) {
        if (path.startsWith('/')) return path.slice(1)
        const hash = window.location.hash.replace(/^#!?\//, '')
        const lastSlash = hash.lastIndexOf('/')
        const dir = lastSlash >= 0 ? hash.slice(0, lastSlash + 1) : ''
        return dir + path
    }

    // Fetch the text of a file at the given docs-root-relative path.
    // Returns an empty string if the file cannot be fetched.
    async function fetchFile(path) {
        try {
            const res = await fetch(path)
            return res.ok ? await res.text() : ''
        } catch {
            return ''
        }
    }

    // Build a self-contained HTML string for the preview iframe.
    function buildSrcdoc(html, css, js) {
        const parts = []
        if (css) parts.push(`<style>\n${css}\n</style>`)
        parts.push(html)
        if (js)  parts.push(`<script>\n${js}\n<\/script>`)
        return parts.join('\n')
    }

    // Push the current editor contents into the iframe.
    // Uses contentDocument.write() for reliable cross-browser rendering.
    function renderPreview(iframe, editors) {
        const get = key => editors[key]?.getValue() ?? ''
        const html = buildSrcdoc(get('html'), get('css'), get('js'))
        const doc = iframe.contentDocument || iframe.contentWindow.document
        doc.open()
        doc.write(html)
        doc.close()
    }

    const CM_MODE = { html: 'htmlmixed', css: 'css', js: 'javascript' }

    function createEditor(el, content, type) {
        return CodeMirror(el, {
            value:             content,
            mode:              CM_MODE[type],
            theme:             'material-darker',
            lineNumbers:       false,
            lineWrapping:      true,
            tabSize:           2,
            indentWithTabs:    false,
            autoCloseBrackets: true,
            autoCloseTags:     true,
        })
    }

    // Build the widget: editors column on the left, live preview on the right.
    // All editors are always visible - no tabs.
    function buildWidget(container, contents) {
        const editorsCol = document.createElement('div')
        editorsCol.className = 'wp-editors'
        container.appendChild(editorsCol)

        const previewCol = document.createElement('div')
        previewCol.className = 'wp-preview'
        container.appendChild(previewCol)

        const iframe = document.createElement('iframe')
        iframe.className = 'wp-iframe'
        previewCol.appendChild(iframe)

        const editors = {}
        const paneEls = []

        Object.entries(contents).forEach(([name, content]) => {
            const pane = document.createElement('div')
            pane.className = 'wp-editor-pane'
            paneEls.push(pane)

            const label = document.createElement('div')
            label.className = 'wp-editor-label'

            const labelText = document.createElement('span')
            labelText.textContent = name.toUpperCase()
            label.appendChild(labelText)

            const btn = document.createElement('button')
            btn.className = 'wp-editor-maximise'
            btn.setAttribute('aria-label', 'Maximise editor')
            btn.setAttribute('title', 'Maximise / restore')
            btn.textContent = '⤢'
            label.appendChild(btn)

            pane.appendChild(label)

            const code = document.createElement('div')
            code.className = 'wp-editor-code'
            pane.appendChild(code)

            editorsCol.appendChild(pane)
            editors[name] = createEditor(code, content, name)
        })

        // Re-render the preview after every edit, debounced so it's not thrashing the iframe.
        let debounceTimer
        Object.values(editors).forEach(ed => {
            ed.on('change', () => {
                clearTimeout(debounceTimer)
                debounceTimer = setTimeout(() => renderPreview(iframe, editors), 400)
            })
        })

        const refreshAll = () => Object.values(editors).forEach(ed => ed.refresh())

        // Vertical split between editor panes - always active.
        let vSplit = null
        let savedSizes = null
        let maximisedPane = null

        if (paneEls.length > 1) {
            // Size each pane proportionally to its line count so larger files
            // get more initial space. Floor at 10 lines so small files still get space.
            const editorList = Object.values(editors)
            const lineCounts = editorList.map(ed => Math.max(ed.lineCount(), 10))
            const totalLines = lineCounts.reduce((a, b) => a + b, 0)
            const defaultSizes = lineCounts.map(n => (n / totalLines) * 100)

            vSplit = Split(paneEls, {
                direction: 'vertical',
                sizes: defaultSizes,
                minSize: 20,
                gutterSize: 5,
                onDragEnd: () => {
                    // If the user drags after a maximise, clear the maximised state.
                    maximisedPane = null
                    savedSizes = null
                    paneEls.forEach(p => p.querySelector('.wp-editor-maximise').textContent = '⤢')
                    refreshAll()
                },
            })

            // Wire up maximise buttons.
            paneEls.forEach((pane, i) => {
                pane.querySelector('.wp-editor-maximise').addEventListener('click', () => {
                    if (maximisedPane === pane) {
                        // Restore
                        vSplit.setSizes(savedSizes)
                        maximisedPane = null
                        savedSizes = null
                        paneEls.forEach(p => p.querySelector('.wp-editor-maximise').textContent = '⤢')
                    } else {
                        // Maximise this pane
                        savedSizes = vSplit.getSizes()
                        maximisedPane = pane
                        const expandedSizes = paneEls.map((_, j) =>
                            j === i ? 100 - (paneEls.length - 1) * 2 : 2
                        )
                        vSplit.setSizes(expandedSizes)
                        paneEls.forEach((p, j) => {
                            p.querySelector('.wp-editor-maximise').textContent = j === i ? '⤡' : '⤢'
                        })
                    }
                    refreshAll()
                })
            })
        }

        // Horizontal split between editors and preview - created/destroyed as the
        // viewport crosses the wide-screen breakpoint so that Split.js inline styles
        // don't override the CSS layout on mobile.
        let hSplit = null
        function syncHorizontalSplit() {
            const isWide = window.matchMedia('(min-width: 120ch)').matches
            if (isWide && !hSplit) {
                hSplit = Split([editorsCol, previewCol], {
                    direction: 'horizontal',
                    sizes: [50, 50],
                    minSize: 120,
                    gutterSize: 5,
                    onDragEnd: refreshAll,
                })
                setTimeout(refreshAll, 0)
            } else if (!isWide && hSplit) {
                hSplit.destroy()  // removes gutter + inline width styles
                hSplit = null
                setTimeout(refreshAll, 0)
            }
        }

        const mq = window.matchMedia('(min-width: 120ch)')
        mq.addEventListener('change', syncHorizontalSplit)
        syncHorizontalSplit()

        return { editors, iframe }
    }

    async function initPlayground(container) {
        if (container.dataset.initialized) return
        container.dataset.initialized = 'true'

        const htmlPath = container.dataset.html ? resolvePath(container.dataset.html) : null
        const cssPath  = container.dataset.css  ? resolvePath(container.dataset.css)  : null
        const jsPath   = container.dataset.js   ? resolvePath(container.dataset.js)   : null
        const height   = container.dataset.height ?? '80vh'

        // Expose the height as a CSS custom property so the stylesheet can use it
        // to size each section independently on narrow screens.
        // On wide layouts the container height comes from the CSS media query;
        // on mobile the container auto-expands to fit the stacked sections.
        container.style.setProperty('--wp-height', height)
        container.innerHTML    = ''

        const [html, css, js] = await Promise.all([
            htmlPath ? fetchFile(htmlPath) : Promise.resolve(null),
            cssPath  ? fetchFile(cssPath)  : Promise.resolve(null),
            jsPath   ? fetchFile(jsPath)   : Promise.resolve(null),
        ])

        const contents = {}
        if (html !== null) contents.html = html
        if (css  !== null) contents.css  = css
        if (js   !== null) contents.js   = js

        const { editors, iframe } = buildWidget(container, contents)

        // Initial render so the preview is populated immediately on load.
        renderPreview(iframe, editors)
    }

    function docsifyWebPlayground(hook) {
        hook.doneEach(async function () {
            const containers = document.querySelectorAll('.web-playground:not([data-initialized])')
            if (!containers.length) return

            await Promise.all(Array.from(containers).map(initPlayground))
        })
    }

    window.$docsify = window.$docsify || {}
    window.$docsify.plugins = [].concat(docsifyWebPlayground, window.$docsify.plugins || [])

})()

