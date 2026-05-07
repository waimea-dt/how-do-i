/**
 * svg-zoom.js - click-to-zoom for SVG diagrams and SVG images.
 */
(function () {
    'use strict'

    const OVERLAY_TRANSITION = 'opacity 500ms ease'
    const ZOOM_TRANSITION = 'transform 500ms ease'
    let globalCaptureAttached = false

    function isSvgImage(img) {
        if (window.DocsifyUtils?.isSvgImage) return window.DocsifyUtils.isSvgImage(img)
        if (!img || img.tagName !== 'IMG') return false
        const src = (img.getAttribute('src') || '').toLowerCase()
        return src.endsWith('.svg') || src.startsWith('data:image/svg+xml')
    }

    function registerPlugin(fn) {
        if (window.DocsifyUtils?.registerPlugin) {
            window.DocsifyUtils.registerPlugin(fn)
            return
        }

        window.$docsify = window.$docsify || {}
        const plugins = window.$docsify.plugins || []
        window.$docsify.plugins = [fn, ...plugins]
    }

    function getZoomTargetFromEvent(event) {
        const path = event.composedPath ? event.composedPath() : []
        for (const node of path) {
            if (!node) continue

            if (node.tagName === 'IMG' && node.dataset?.zoomAttached === 'true') {
                if (node.dataset.noZoom !== 'true' && !node.classList?.contains('no-zoom')) {
                    return node
                }
            }

            if (node.tagName === 'SVG' && node.dataset?.zoomAttached === 'true') {
                if (node.dataset.noZoom !== 'true' && !node.classList?.contains('no-zoom')) {
                    return node
                }
            }

            const ownerSvg = node.ownerSVGElement
            if (ownerSvg?.dataset?.zoomAttached === 'true') {
                if (ownerSvg.dataset.noZoom !== 'true' && !ownerSvg.classList?.contains('no-zoom')) {
                    return ownerSvg
                }
            }

            const nearestSvg = node.closest?.('svg[data-zoom-attached="true"]')
            if (nearestSvg && nearestSvg.dataset.noZoom !== 'true' && !nearestSvg.classList?.contains('no-zoom')) {
                return nearestSvg
            }
        }
        return null
    }

    function attachZoom(node) {
        if (!node) return
        if (node.classList?.contains('no-zoom') || node.dataset?.noZoom === 'true') return

        node.dataset.zoomAttached = 'true'
        node.style.cursor = 'zoom-in'

        if (node.tagName === 'SVG') {
            node.querySelectorAll('foreignObject, foreignObject *').forEach(function (el) {
                el.style.cursor = 'zoom-in'
            })
        }
    }

    function scanAndAttach(root) {
        if (!root || !root.querySelectorAll) return
        root.querySelectorAll('svg:not(.no-zoom)').forEach(attachZoom)
        root.querySelectorAll('img:not(.no-zoom)').forEach(function (img) {
            if (isSvgImage(img)) attachZoom(img)
        })
    }

    function ensureGlobalCapture() {
        if (globalCaptureAttached) return
        globalCaptureAttached = true

        document.addEventListener('pointerdown', function (event) {
            if (event.__svgZoomHandled) return
            if (event.button !== 0) return
            if (event.target?.closest?.('a[href]')) return
            if (event.target?.closest?.('[data-svg-zoom-overlay="true"]')) return

            const zoomTarget = getZoomTargetFromEvent(event)
            if (!zoomTarget) return

            event.__svgZoomHandled = true
            event.preventDefault()
            event.stopPropagation()
            showOverlay(zoomTarget)
        }, true)
    }

    function ensureMutationObserver(markdownSection) {
        if (!markdownSection || markdownSection.dataset.svgZoomObserverAttached) return
        markdownSection.dataset.svgZoomObserverAttached = 'true'

        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                mutation.addedNodes.forEach(function (node) {
                    if (node.nodeName === 'SVG' || node.tagName === 'svg') {
                        attachZoom(node)
                    } else if (node.tagName === 'IMG' && isSvgImage(node)) {
                        attachZoom(node)
                    } else if (node.querySelectorAll) {
                        scanAndAttach(node)
                    }
                })
            })
        })

        observer.observe(markdownSection, { childList: true, subtree: true })
    }

    function showOverlay(svg) {
        const from = svg.getBoundingClientRect()
        const isImage = svg.tagName === 'IMG'
        const originTransform = `translate(${from.left + from.width / 2 - window.innerWidth / 2}px, ${from.top + from.height / 2 - window.innerHeight / 2}px) scale(${from.width / window.innerWidth})`

        const overlay = document.createElement('div')
        overlay.dataset.svgZoomOverlay = 'true'
        overlay.style.cssText = [
            'position: fixed',
            'inset: 0',
            'background: var(--color-bg)',
            'display: flex',
            'align-items: center',
            'justify-content: center',
            'z-index: 9999',
            'cursor: zoom-out',
            'opacity: 0',
            `transition: ${OVERLAY_TRANSITION}`,
        ].join(';')

        const clone = svg.cloneNode(true)
        clone.dataset.noZoom = 'true'
        clone.classList.add('no-zoom')
        clone.removeAttribute('data-zoom-attached')
        if (!isImage) {
            clone.removeAttribute('width')
            clone.removeAttribute('height')
        }
        clone.style.cssText = [
            'max-width: 95vw',
            'max-height: 95vh',
            'width: 100%',
            'height: auto',
            'transform-origin: center center',
            `transform: ${originTransform}`,
            `transition: ${ZOOM_TRANSITION}`,
            'will-change: transform',
        ].join(';')

        if (isImage) {
            overlay.appendChild(clone)
        } else {
            const wrapper = document.createElement('div')
            const parentClasses = svg.parentElement?.className || ''
            if (parentClasses) wrapper.className = parentClasses
            wrapper.style.display = 'contents'
            wrapper.appendChild(clone)
            overlay.appendChild(wrapper)
        }

        document.body.appendChild(overlay)

        let canClose = false
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                overlay.style.opacity = '1'
                clone.style.transform = 'translate(0, 0) scale(1)'
                canClose = true
            })
        })

        function close() {
            overlay.style.opacity = '0'
            clone.style.transform = originTransform
            overlay.addEventListener('transitionend', function () {
                overlay.remove()
            }, { once: true })
            document.removeEventListener('keydown', onKey)
        }

        function onKey(e) {
            if (e.key === 'Escape') close()
        }

        overlay.addEventListener('click', function (event) {
            if (!canClose) {
                event.preventDefault()
                event.stopPropagation()
                return
            }
            close()
        })
        document.addEventListener('keydown', onKey)
    }

    function bootstrapNow() {
        const markdownSection = document.querySelector('.markdown-section')
        if (!markdownSection) return false

        ensureGlobalCapture()
        scanAndAttach(markdownSection)
        ensureMutationObserver(markdownSection)
        return true
    }

    const svgZoom = function (hook) {
        hook.doneEach(function () {
            bootstrapNow()
        })
    }

    window.SvgZoom = window.SvgZoom || {}
    window.SvgZoom.refresh = function (root) {
        const target = root || document.querySelector('.markdown-section')
        if (!target) return
        scanAndAttach(target)
    }

    if (!bootstrapNow()) {
        document.addEventListener('DOMContentLoaded', bootstrapNow, { once: true })
        window.addEventListener('load', bootstrapNow, { once: true })
        const retryTimer = window.setInterval(function () {
            if (bootstrapNow()) {
                window.clearInterval(retryTimer)
            }
        }, 250)
        window.setTimeout(function () {
            window.clearInterval(retryTimer)
        }, 10000)
    }

    registerPlugin(svgZoom)
})()
