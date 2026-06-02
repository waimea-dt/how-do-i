/**
 * docsify-web-playground.js - Live HTML/CSS/JS editor widget, implemented as a Docsify plugin.
 *
 * On each page load, every <web-playground> is automatically turned into
 * a side-by-side (or stacked on small screens) editor + live preview.
 * All editors are visible at once so students can see the effect of their edits immediately.
 *
 * Requires codemirror.js and the xml, css, javascript, htmlmixed modes and
 * closetag addon to be loaded in index.html before this script runs.
 *
 * Usage in markdown:
 *   <web-playground data-height="40em" show-css max-html>
 *
 *   ```html
 *   <h1>Hello!</h1>
 *   ```
 *
 *   ```css
 *   h1 { color: hotpink; }
 *   ```
 *
 *   ```js
 *   console.log('hello')
 *   ```
 *
 *   </web-playground>
 *
 * Hidden setup code (like Python/SQL runners):
 *   <web-playground>
 *
 *   ```html id=base
 *   <div class="container"></div>
 *   ```
 *
 *   ```css id=base
 *   .container { max-width: 800px; }
 *   ```
 *
 *   ```html depends=base
 *   <p>Student edits this</p>
 *   ```
 *
 *   </web-playground>
 *
 * Attributes:
 *   data-height="40em"  - Set container height (default: 80vh)
 *   show-html           - Show HTML panel with placeholder if no content provided
 *   show-css            - Show CSS panel with placeholder if no content provided
 *   show-js             - Show JS panel with placeholder if no content provided
 *   max-html            - Start with HTML panel maximized
 *   max-css             - Start with CSS panel maximized
 *   max-js              - Start with JS panel maximized
 *
 * Panels are shown if they have content OR if show-* attribute is present.
 * HTML is always shown (with default placeholder if no content provided).
 * CSS and JS are only shown if they have content or show-css/show-js is set.
 * If max-* is specified, line-count proportional sizing is skipped.
 */

(function () {

    const WIDE_LAYOUT_BREAKPOINT_PX = 900
    const DEFAULT_HTML_CONTENT = '<h1>Hello, World!</h1>\n<p>This is a test page</p>'
    const DEFAULT_CSS_CONTENT = '/* Add CSS rules here */'
    const DEFAULT_JS_CONTENT = '// Add JS code here'

    // Extract the content of fenced code blocks (rendered by Docsify as
    // <pre><code class="lang-html/css/js">) from inside a <web-playground>.
    // Returns { html, css, js } where each is { visible, hidden } or null.
    function parseContents(container, hiddenBlocks) {
        const result = { html: null, css: null, js: null }

        container.querySelectorAll('pre > code').forEach(codeEl => {
            // Docsify renders ```html as class="lang-html", etc.
            // With depends, it becomes "lang-html-depends-NAME"
            const classList = Array.from(codeEl.classList)
            const langClass = classList.find(c => c.startsWith('lang-'))
            if (!langClass) return

            // Extract language and optional depends name
            const match = langClass.match(/^lang-(html|css|js)(?:-depends-(\w+))?$/)
            if (!match) return

            const lang = match[1]
            const dependsName = match[2]
            const visibleCode = codeEl.textContent

            // Get hidden code if this block depends on something
            const hiddenCode = dependsName ? (hiddenBlocks[`${lang}:${dependsName}`] ?? '') : ''

            result[lang] = {
                visible: visibleCode,
                hidden: hiddenCode
            }
        })

        // HTML is always included; fall back to placeholder if none provided.
        if (result.html === null) {
            result.html = {
                visible: DEFAULT_HTML_CONTENT,
                hidden: ''
            }
        }

        // CSS and JS get default content if show-* attribute is present but no content provided.
        if (result.css === null && container.hasAttribute('show-css')) {
            result.css = {
                visible: DEFAULT_CSS_CONTENT,
                hidden: ''
            }
        }
        if (result.js === null && container.hasAttribute('show-js')) {
            result.js = {
                visible: DEFAULT_JS_CONTENT,
                hidden: ''
            }
        }

        return result
    }

    // Build a self-contained HTML string for the preview iframe.
    // Combines hidden setup code with visible code.
    function buildSrcdoc(htmlObj, cssObj, jsObj) {
        const parts = []
        parts.push('<!DOCTYPE html>')
        parts.push('<html>')
        parts.push('<head>')
        parts.push('<meta charset="utf-8">')
        parts.push('<meta name="viewport" content="width=device-width, initial-scale=1.0">')

        // Combine hidden + visible CSS
        const fullCss = (cssObj.hidden || '') + (cssObj.hidden && cssObj.visible ? '\n' : '') + (cssObj.visible || '')
        if (fullCss) parts.push(`<style>\n${fullCss}\n</style>`)

        parts.push('</head>')
        parts.push('<body>')

        // Combine hidden + visible HTML
        const fullHtml = (htmlObj.hidden || '') + (htmlObj.hidden && htmlObj.visible ? '\n' : '') + (htmlObj.visible || '')
        if (fullHtml) parts.push(fullHtml)

        // Combine hidden + visible JS
        const fullJs = (jsObj.hidden || '') + (jsObj.hidden && jsObj.visible ? '\n' : '') + (jsObj.visible || '')
        if (fullJs) parts.push(`<script>\n${fullJs}\n<\/script>`)

        parts.push('</body>')
        parts.push('</html>')

        return parts.join('\n')
    }

    // Push the current editor contents into the iframe.
    // Uses contentDocument.write() for reliable cross-browser rendering.
    // Combines hidden setup code with visible editor content.
    function renderPreview(iframe, editors, contentObjs) {
        const get = (key) => {
            const editorValue = editors[key]?.getValue() ?? ''
            const hiddenCode = contentObjs[key]?.hidden ?? ''
            return { hidden: hiddenCode, visible: editorValue }
        }
        const htmlObj = get('html')
        const cssObj = get('css')
        const jsObj = get('js')
        const html = buildSrcdoc(htmlObj, cssObj, jsObj)
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
    function buildWidget(container, contents, contentObjs, initialMaxLang) {
        function createGutter(direction) {
            const gutter = document.createElement('div')
            gutter.className = `gutter wp-gutter ${direction === 'vertical' ? 'wp-gutter-vertical' : 'wp-gutter-horizontal'}`
            return gutter
        }

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
            btn.innerHTML = '<svg class="no-zoom" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentcolor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>'
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
                debounceTimer = setTimeout(() => renderPreview(iframe, editors, contentObjs), 400)
            })
        })

        const refreshAll = () => Object.values(editors).forEach(ed => ed.refresh())

        // Vertical split between editor panes - always active.
        let vSplit = null
        let savedSizes = null
        let maximisedPane = null

        if (paneEls.length > 1) {
            const editorList = Object.values(editors)
            const langs = Object.keys(contents)

            // Determine initial sizes
            let defaultSizes
            const initialMaxIndex = initialMaxLang ? langs.indexOf(initialMaxLang) : -1

            if (initialMaxIndex >= 0) {
                // Start with a panel maximized
                defaultSizes = paneEls.map((_, j) =>
                    j === initialMaxIndex ? 100 - (paneEls.length - 1) * 2 : 2
                )
                maximisedPane = paneEls[initialMaxIndex]
            } else {
                // Size each pane proportionally to its line count so larger files
                // get more initial space. Floor at 10 lines so small files still get space.
                const lineCounts = editorList.map(ed => Math.max(ed.lineCount(), 10))
                const totalLines = lineCounts.reduce((a, b) => a + b, 0)
                defaultSizes = lineCounts.map(n => (n / totalLines) * 100)
            }

            vSplit = Split(paneEls, {
                direction: 'vertical',
                sizes: defaultSizes,
                minSize: 30,
                gutterSize: 10,
                gutterAlign: 'center',
                gutter: () => createGutter('vertical'),
                onDragEnd: () => {
                    // If the user drags after a maximise, clear the maximised state.
                    maximisedPane = null
                    savedSizes = null
                    refreshAll()
                },
            })

            // Wire up maximise buttons.
            paneEls.forEach((pane, i) => {
                pane.querySelector('.wp-editor-maximise').addEventListener('click', () => {
                    if (maximisedPane === pane) {
                        // Restore - recalculate line-count proportional sizes
                        const lineCounts = editorList.map(ed => Math.max(ed.lineCount(), 10))
                        const totalLines = lineCounts.reduce((a, b) => a + b, 0)
                        const restoreSizes = lineCounts.map(n => (n / totalLines) * 100)
                        vSplit.setSizes(restoreSizes)
                        maximisedPane = null
                        savedSizes = null
                    } else {
                        // Maximise this pane
                        savedSizes = vSplit.getSizes()
                        maximisedPane = pane
                        const expandedSizes = paneEls.map((_, j) =>
                            j === i ? 100 - (paneEls.length - 1) * 2 : 2
                        )
                        vSplit.setSizes(expandedSizes)
                    }
                    refreshAll()
                })
            })
        }

        // Horizontal split between editors and preview - created/destroyed as the
        // container crosses the wide-screen breakpoint so Split.js inline styles
        // stay in sync with the CSS container query layout.
        let hSplit = null
        function syncHorizontalSplit() {
            const isWide = container.getBoundingClientRect().width >= WIDE_LAYOUT_BREAKPOINT_PX
            if (isWide && !hSplit) {
                hSplit = Split([editorsCol, previewCol], {
                    direction: 'horizontal',
                    sizes: [50, 50],
                    minSize: 120,
                    gutterSize: 10,
                    gutterAlign: 'center',
                    gutter: () => createGutter('horizontal'),
                    onDragEnd: refreshAll,
                })
                setTimeout(refreshAll, 0)
            } else if (!isWide && hSplit) {
                hSplit.destroy()  // removes gutter + inline width styles
                hSplit = null
                setTimeout(refreshAll, 0)
            }
        }

        let containerResizeObserver = null
        let removeResizeFallback = null
        if (typeof ResizeObserver !== 'undefined') {
            containerResizeObserver = new ResizeObserver(() => {
                syncHorizontalSplit()
            })
            containerResizeObserver.observe(container)
        } else {
            // Fallback for older browsers without ResizeObserver support.
            window.addEventListener('resize', syncHorizontalSplit)
            removeResizeFallback = () => window.removeEventListener('resize', syncHorizontalSplit)
        }

        syncHorizontalSplit()

        return { editors, iframe, hSplitRef: () => hSplit, containerResizeObserver, removeResizeFallback }
    }

    function initPlayground(container, hiddenBlocks) {
        if (container.dataset.initialized) return
        container.dataset.initialized = 'true'

        const height = container.dataset.height ?? '80vh'

        // Expose the height as a CSS custom property so the stylesheet can use it
        // to size each section independently on narrow screens.
        // On wide layouts the container height comes from the CSS media query;
        // on mobile the container auto-expands to fit the stacked sections.
        container.style.setProperty('--wp-height', height)

        const contentObjs = parseContents(container, hiddenBlocks)
        container.innerHTML = ''

        // Extract visible content for editors
        const contents = {}
        if (contentObjs.html !== null) contents.html = contentObjs.html.visible
        if (contentObjs.css  !== null) contents.css  = contentObjs.css.visible
        if (contentObjs.js   !== null) contents.js   = contentObjs.js.visible

        // Determine which panel should be initially maximized
        let initialMaxLang = null
        if (container.hasAttribute('max-html')) initialMaxLang = 'html'
        else if (container.hasAttribute('max-css')) initialMaxLang = 'css'
        else if (container.hasAttribute('max-js')) initialMaxLang = 'js'

        const { editors, iframe, hSplitRef, containerResizeObserver, removeResizeFallback } = buildWidget(container, contents, contentObjs, initialMaxLang)

        // Ensure observer is disconnected if the widget is removed from the DOM.
        if (containerResizeObserver) {
            const cleanupObserver = new MutationObserver(() => {
                if (!document.body.contains(container)) {
                    const hSplit = hSplitRef()
                    if (hSplit) hSplit.destroy()
                    containerResizeObserver.disconnect()
                    if (removeResizeFallback) removeResizeFallback()
                    cleanupObserver.disconnect()
                }
            })
            cleanupObserver.observe(document.body, { childList: true, subtree: true })
        } else if (removeResizeFallback) {
            const cleanupFallback = new MutationObserver(() => {
                if (!document.body.contains(container)) {
                    const hSplit = hSplitRef()
                    if (hSplit) hSplit.destroy()
                    removeResizeFallback()
                    cleanupFallback.disconnect()
                }
            })
            cleanupFallback.observe(document.body, { childList: true, subtree: true })
        }

        // Initial render so the preview is populated immediately on load.
        renderPreview(iframe, editors, contentObjs)
    }

    function docsifyWebPlayground(hook) {
        // Hidden code blocks extracted from the current page.
        // Keys are "lang:name", values are the raw code strings.
        let hiddenBlocks = {}

        hook.beforeEach(function (content) {
            hiddenBlocks = {}
            content = content.replace(/\r\n/g, '\n')

            // Process content inside <web-playground> tags
            content = content.replace(
                /<web-playground([^>]*)>([\s\S]*?)<\/web-playground>/g,
                function (match, attrs, innerContent) {
                    // Extract ```html id=NAME, ```css id=NAME, ```js id=NAME blocks
                    innerContent = innerContent.replace(
                        /^```(html|css|js) id=(\w+)\n([\s\S]*?)^```$/gm,
                        function (_, lang, name, code) {
                            hiddenBlocks[`${lang}:${name}`] = code
                            return '' // Remove from markdown
                        }
                    )

                    // Transform ```html depends=NAME to ```html-depends-NAME
                    innerContent = innerContent.replace(
                        /^```(html|css|js) depends=(\w+)$/gm,
                        '```$1-depends-$2'
                    )

                    return `<web-playground${attrs}>${innerContent}</web-playground>`
                }
            )

            return content
        })

        hook.doneEach(function () {
            document.querySelectorAll('web-playground:not([data-initialized])').forEach(el => {
                initPlayground(el, hiddenBlocks)
            })
        })
    }

    window.DocsifyUtils.registerPlugin(docsifyWebPlayground)

})()
