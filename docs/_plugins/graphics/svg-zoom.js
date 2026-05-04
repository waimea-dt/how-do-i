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

    const OVERLAY_TRANSITION = 'opacity 500ms ease';
    const ZOOM_TRANSITION = 'transform 500ms ease';

    function isSvgImage(img) {
        if (!img || img.tagName !== 'IMG') return false;
        const src = (img.getAttribute('src') || '').toLowerCase();
        return src.endsWith('.svg') || src.startsWith('data:image/svg+xml');
    }

    function scanAndAttach(root) {
        if (!root || !root.querySelectorAll) return;
        root.querySelectorAll('svg:not(.no-zoom)').forEach(attachZoom);
        root.querySelectorAll('img:not(.no-zoom)').forEach(img => {
            if (isSvgImage(img)) attachZoom(img);
        });
    }

    var svgZoom = function (hook) {

        hook.doneEach(function () {
            const markdownSection = document.querySelector('.markdown-section');
            if (!markdownSection) return;

            // Attach zoom to any existing SVGs and SVG images.
            scanAndAttach(markdownSection);

            // Watch for new SVGs being added (e.g., Mermaid, ERD updates)
            const observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    mutation.addedNodes.forEach(function (node) {
                        // Check if the node itself is an SVG
                        if (node.nodeName === 'SVG' || node.tagName === 'svg') {
                            // Skip if it has the no-zoom class
                            if (!node.classList.contains('no-zoom')) {
                                attachZoom(node);
                            }
                        }
                        // Support zooming image tags that point at SVGs.
                        else if (node.tagName === 'IMG' && isSvgImage(node)) {
                            if (!node.classList.contains('no-zoom') && node.dataset.noZoom !== 'true') {
                                attachZoom(node);
                            }
                        }
                        // Check if the node contains SVGs
                        else if (node.querySelectorAll) {
                            scanAndAttach(node);
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
        // Skip if already attached, has no-zoom class, or has data-no-zoom attribute.
        if (svg.dataset.zoomAttached || svg.classList.contains('no-zoom') || svg.dataset.noZoom === 'true') return;

        svg.dataset.zoomAttached = 'true';
        svg.style.cursor = 'zoom-in';
        svg.addEventListener('click', function () {
            showOverlay(svg);
        });
    }


    function showOverlay(svg) {
        const from = svg.getBoundingClientRect();
        const isImage = svg.tagName === 'IMG';
        const originTransform = `translate(${from.left + from.width / 2 - window.innerWidth / 2}px, ${from.top + from.height / 2 - window.innerHeight / 2}px) scale(${from.width / window.innerWidth})`;

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
            `transition: ${OVERLAY_TRANSITION}`,
        ].join(';');

        const clone = svg.cloneNode(true);
        if (!isImage) {
            clone.removeAttribute('width');
            clone.removeAttribute('height');
        }
        clone.style.cssText = [
            'max-width: 95vw',
            'max-height: 95vh',
            'width: 100%',
            'height: auto',
            // Start from the original element position and size.
            'transform-origin: center center',
            `transform: ${originTransform}`,
            `transition: ${ZOOM_TRANSITION}`,
            'will-change: transform',
        ].join(';');

        // Preserve wrapper classes for style-sensitive diagrams (e.g. mermaid).
        if (isImage) {
            overlay.appendChild(clone);
        } else {
            const wrapper = document.createElement('div');
            const parentClasses = svg.parentElement?.className || '';
            if (parentClasses) {
                wrapper.className = parentClasses;
            }
            wrapper.style.display = 'contents';
            wrapper.appendChild(clone);
            overlay.appendChild(wrapper);
        }
        document.body.appendChild(overlay);

        // Trigger animation after insertion + first paint so opening motion always runs.
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                overlay.style.opacity = '1';
                clone.style.transform = 'translate(0, 0) scale(1)';
            });
        });

        function close() {
            overlay.style.opacity = '0';
            clone.style.transform = originTransform;
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

    window.SvgZoom = window.SvgZoom || {};
    window.SvgZoom.refresh = function (root) {
        const target = root || document.querySelector('.markdown-section');
        if (!target) return;
        scanAndAttach(target);
    };


    window.$docsify = window.$docsify || {};
    window.$docsify.plugins = [].concat(svgZoom, window.$docsify.plugins || []);

})();
