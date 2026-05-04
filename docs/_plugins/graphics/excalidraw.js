/**
 * docsify-excalidraw.js - Renders .excalidraw scene files as SVG images.
 *
 * Usage in markdown:
 *   <excalidraw src="tests/_assets/test.excalidraw"></excalidraw>
 *
 * Optional attributes:
 *   - alt: Alt text for generated image.
 *   - class: Extra classes applied to the generated image.
 *
 * Notes:
 *   - src is resolved from docs root.
 *   - The plugin outputs an <img> tag with an SVG data URL source.
 */

;(function () {

    const SCENE_CACHE = new Map()
    let exportToSvgPromise = null

    function isAbsoluteUrl(path) {
        return /^(https?:)?\/\//i.test(path) || path.startsWith('data:')
    }

    function resolveSourcePath(src) {
        const clean = (src || '').trim()
        if (!clean) return ''

        if (isAbsoluteUrl(clean)) {
            return clean
        }

        return clean.replace(/^\//, '')
    }

    async function loadExportToSvg() {
        if (!exportToSvgPromise) {
            exportToSvgPromise = Promise.resolve(window.ExcalidrawReady)
                .then(loadedModule => loadedModule || window.ExcalidrawLib)
                .then(module => {
                    if (!module || typeof module.exportToSvg !== 'function') {
                        throw new Error('Excalidraw exportToSvg is not available from loaded CDN module')
                    }
                    return module.exportToSvg
                })
        }
        return exportToSvgPromise
    }

    function serialiseSvgToDataUrl(svgElement) {
        const serialiser = new XMLSerializer()
        const svg = serialiser.serializeToString(svgElement)
        return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
    }

    function deriveAltText(src, explicitAlt) {
        if (explicitAlt && explicitAlt.trim()) return explicitAlt.trim()
        const fileName = (src || 'diagram').split('/').pop() || 'diagram'
        const base = fileName.replace(/\.excalidraw$/i, '')
        return `${base} diagram`
    }

    function readSceneData(raw) {
        const parsed = JSON.parse(raw)
        if (!parsed || !Array.isArray(parsed.elements)) {
            throw new Error('Invalid .excalidraw file format')
        }

        return {
            elements: parsed.elements.filter(element => !element.isDeleted),
            appState: parsed.appState || {},
            files: parsed.files || {}
        }
    }

    async function renderSceneAsDataUrl(srcPath) {
        if (SCENE_CACHE.has(srcPath)) {
            return SCENE_CACHE.get(srcPath)
        }

        const response = await fetch(srcPath)
        if (!response.ok) {
            throw new Error(`Failed to fetch ${srcPath}`)
        }

        const raw = await response.text()
        const scene = readSceneData(raw)
        const exportToSvg = await loadExportToSvg()

        const svgElement = await exportToSvg({
            elements: scene.elements,
            appState: {
                ...scene.appState,
                exportBackground: false,
                exportWithDarkMode: true,
            },
            files: scene.files,
            exportPadding: 16,
        })

        const dataUrl = serialiseSvgToDataUrl(svgElement)
        SCENE_CACHE.set(srcPath, dataUrl)
        return dataUrl
    }

    function renderError(container, message) {
        container.innerHTML = ''
        const error = document.createElement('div')
        error.className = 'excalidraw-error'
        error.textContent = message
        container.appendChild(error)
    }

    async function processExcalidrawBlock(el) {
        if (el.dataset.excalidrawProcessed === 'true') return
        el.dataset.excalidrawProcessed = 'true'

        const srcAttr = el.getAttribute('src') || ''
        if (!srcAttr.trim()) {
            renderError(el, 'Missing src attribute on excalidraw block.')
            return
        }

        const resolvedSrc = resolveSourcePath(srcAttr)
        const alt = deriveAltText(srcAttr, el.getAttribute('alt'))

        el.innerHTML = '<div class="excalidraw-loading">Loading Excalidraw diagram...</div>'

        try {
            const dataUrl = await renderSceneAsDataUrl(resolvedSrc)
            const img = document.createElement('img')
            img.className = `excalidraw-image ${el.getAttribute('class') || ''}`.trim()
            img.src = dataUrl
            img.alt = alt
            img.loading = 'lazy'
            img.decoding = 'async'

            el.innerHTML = ''
            el.appendChild(img)

            if (window.SvgZoom && typeof window.SvgZoom.refresh === 'function') {
                window.SvgZoom.refresh(el)
            }
        } catch (error) {
            console.error('Failed to render Excalidraw file:', srcAttr, error)
            renderError(el, `Could not render Excalidraw diagram: ${srcAttr}`)
        }
    }

    function processExcalidrawBlocks() {
        const blocks = document.querySelectorAll('excalidraw')
        if (blocks.length === 0) return

        blocks.forEach(block => {
            processExcalidrawBlock(block)
        })
    }

    const docsifyExcalidraw = function (hook) {
        hook.doneEach(function () {
            processExcalidrawBlocks()
        })
    }

    window.$docsify = window.$docsify || {}
    window.$docsify.plugins = [].concat(docsifyExcalidraw, window.$docsify.plugins || [])

})()
