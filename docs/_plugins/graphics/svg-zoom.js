/**
 * docsify-svg-zoom.js - Adds click-to-zoom behaviour to all SVG diagrams,
 * including Mermaid, ERD, and other dynamically rendered SVGs.
 * Uses a MutationObserver on the markdown section to catch SVGs rendered
 * asynchronously after Docsify's doneEach hook has already fired.
 *
 * Usage in markdown:
 *   No custom syntax required.
 *   Works automatically for all SVG elements in the content area.
 */

(function () {

    var svgZoom = function (hook) {

        hook.doneEach(function () {
            const markdownSection = document.querySelector('.markdown-section');
            if (!markdownSection) return;

            // Attach zoom to any existing SVGs
            markdownSection.querySelectorAll('svg').forEach(attachZoom);

            // Watch for new SVGs being added (e.g., Mermaid, ERD updates)
            const observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    mutation.addedNodes.forEach(function (node) {
                        // Check if the node itself is an SVG
                        if (node.nodeName === 'SVG' || node.tagName === 'svg') {
                            attachZoom(node);
                        }
                        // Check if the node contains SVGs
                        else if (node.querySelectorAll) {
                            node.querySelectorAll('svg').forEach(attachZoom);
                        }
                    });
                });
            });

            // Observe the entire markdown section for any changes
            observer.observe(markdownSection, {
                childList: true,
                subtree: true // Watch all descendants
            });
        });

    };


    function attachZoom(svg) {
        // Skip if already attached or if the SVG has a data-no-zoom attribute
        if (svg.dataset.zoomAttached || svg.dataset.noZoom === 'true') return;

        svg.dataset.zoomAttached = 'true';
        svg.style.cursor = 'zoom-in';
        svg.addEventListener('click', function () {
            showOverlay(svg);
        });
    }


    function showOverlay(svg) {
        const from = svg.getBoundingClientRect();

        const overlay = document.createElement('div');
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
        ].join(';');

        const clone = svg.cloneNode(true);
        clone.removeAttribute('width');
        clone.removeAttribute('height');
        clone.style.cssText = [
            'max-width: 95vw',
            'max-height: 95vh',
            'width: auto',
            'height: auto',
            // Start from the original SVG's position and size
            'transform-origin: center center',
            `transform: translate(${from.left + from.width / 2 - window.innerWidth / 2}px, ${from.top + from.height / 2 - window.innerHeight / 2}px) scale(${from.width / window.innerWidth})`,
            'transition: transform 0.3s ease',
        ].join(';');

        // Preserve any wrapper classes for styling (e.g., .mermaid)
        const wrapper = document.createElement('div');
        const parentClasses = svg.parentElement?.className || '';
        if (parentClasses) {
            wrapper.className = parentClasses;
        }
        wrapper.style.display = 'contents';
        wrapper.appendChild(clone);
        overlay.appendChild(wrapper);
        document.body.appendChild(overlay);

        // Trigger animation on next frame
        requestAnimationFrame(function () {
            overlay.style.opacity = '1';
            clone.style.transform = 'translate(0, 0) scale(1)';
        });

        function close() {
            overlay.style.opacity = '0';
            clone.style.transform = `translate(${from.left + from.width / 2 - window.innerWidth / 2}px, ${from.top + from.height / 2 - window.innerHeight / 2}px) scale(${from.width / window.innerWidth})`;
            overlay.addEventListener('transitionend', function () {
                overlay.remove();
            }, { once: true });
            document.removeEventListener('keydown', onKey);
        }

        function onKey(e) {
            if (e.key === 'Escape') close();
        }

        overlay.addEventListener('click', close);
        document.addEventListener('keydown', onKey);
    }


    window.$docsify = window.$docsify || {};
    window.$docsify.plugins = [].concat(svgZoom, window.$docsify.plugins || []);

})();
