/**
 * docsify-mermaid-zoom.js — Adds click-to-zoom behaviour to Mermaid SVG diagrams,
 * mirroring the effect of the docsify zoom-image plugin.
 * Uses a MutationObserver because Mermaid renders SVGs asynchronously
 * after Docsify's doneEach hook has already fired.
 *
 * Usage in markdown:
 *   No custom syntax required.
 *   Works automatically for standard ```mermaid code blocks.
 */

(function () {

    var mermaidZoom = function (hook) {

        hook.doneEach(function () {
            // Watch for SVGs being inserted into .mermaid containers
            const observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    mutation.addedNodes.forEach(function (node) {
                        if (node.nodeName === 'SVG' || node.tagName === 'svg') {
                            attachZoom(node)
                        }
                    })
                })
            })

            document.querySelectorAll('.mermaid').forEach(function (container) {
                // Attach to any SVGs already present
                container.querySelectorAll('svg').forEach(attachZoom)
                // Watch for SVGs rendered after doneEach
                observer.observe(container, { childList: true })
            })
        })

    }


    function attachZoom(svg) {
        if (svg.dataset.zoomAttached) return
        svg.dataset.zoomAttached = 'true'
        svg.style.cursor = 'zoom-in'
        svg.addEventListener('click', function () {
            showOverlay(svg)
        })
    }


    function showOverlay(svg) {
        const from = svg.getBoundingClientRect()

        const overlay = document.createElement('div')
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
            'transition: opacity 0.3s ease',
        ].join(';')

        const clone = svg.cloneNode(true)
        clone.removeAttribute('width')
        clone.removeAttribute('height')
        clone.style.cssText = [
            'max-width: 95vw',
            'max-height: 95vh',
            'width: auto',
            'height: auto',
            // Start from the original SVG's position and size
            'transform-origin: center center',
            `transform: translate(${from.left + from.width / 2 - window.innerWidth / 2}px, ${from.top + from.height / 2 - window.innerHeight / 2}px) scale(${from.width / window.innerWidth})`,
            'transition: transform 0.3s ease',
        ].join(';')

        const wrapper = document.createElement('div')
        wrapper.className = 'mermaid'
        wrapper.style.display = 'contents'
        wrapper.appendChild(clone)
        overlay.appendChild(wrapper)
        document.body.appendChild(overlay)

        // Trigger animation on next frame
        requestAnimationFrame(function () {
            overlay.style.opacity = '1'
            clone.style.transform = 'translate(0, 0) scale(1)'
        })

        function close() {
            overlay.style.opacity = '0'
            clone.style.transform = `translate(${from.left + from.width / 2 - window.innerWidth / 2}px, ${from.top + from.height / 2 - window.innerHeight / 2}px) scale(${from.width / window.innerWidth})`
            overlay.addEventListener('transitionend', function () {
                overlay.remove()
            }, { once: true })
            document.removeEventListener('keydown', onKey)
        }

        function onKey(e) {
            if (e.key === 'Escape') close()
        }

        overlay.addEventListener('click', close)
        document.addEventListener('keydown', onKey)
    }


    window.$docsify = window.$docsify || {}
    window.$docsify.plugins = [].concat(mermaidZoom, window.$docsify.plugins || [])

})()


