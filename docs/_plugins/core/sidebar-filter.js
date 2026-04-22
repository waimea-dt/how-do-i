/**
 * docsify-sidebar-filter.js - Removes sub-sidebar entries for headings inside custom/plugin elements.
 *
 * Many custom plugins (flashcards, sequences, timelines, etc.) include headings inside their blocks.
 * These internal headings should not appear in the page's table-of-contents sidebar.
 *
 * This plugin scans for known plugin containers and removes their heading IDs from the sidebar.
 *
 * Usage in markdown:
 *   No custom syntax required. Works automatically with supported plugin blocks.
 */
(function () {
    // Custom block tags whose headings should NOT appear in the sub-sidebar.
    var EXCLUDED_TAGS = [
        'computer',
        'flashcards',
        'cards',
        'slides',
        'sequence',
        'structure',
        'timeline',
        'hierarchy',
        'filetree',
        'quiz',
    ];

    // Transformed selectors after plugins process in doneEach
    var EXCLUDED_SELECTORS = [
        'ul.flash-cards',
        'div.cards-container',
        'div.docsify-slide-deck',
        'ol.sequence',
        'ul.structure',
        'ol.structure',
        'dl.timeline',
        'div.hierarchy-scroll-wrapper',
        'div.computer-screen-content',
        'ul.file-tree',
        'ul.quiz',
    ];

    var docsifySidebarFilter = function (hook) {
        var sidebarObserver = null;

        function getExcludedHeadingIds() {
            var excludedIds = [];
            var section = document.querySelector('.markdown-section');

            if (!section) return excludedIds;

            // Check raw tag names
            EXCLUDED_TAGS.forEach(function(tag) {
                section.querySelectorAll(tag).forEach(function(container) {
                    container.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]').forEach(function(h) {
                        if (h.id) excludedIds.push(h.id);
                    });
                });
            });

            // Check transformed selectors
            EXCLUDED_SELECTORS.forEach(function(selector) {
                section.querySelectorAll(selector).forEach(function(container) {
                    container.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]').forEach(function(h) {
                        if (h.id) excludedIds.push(h.id);
                    });
                });
            });

            return excludedIds;
        }

        function filterSidebar() {
            var excludedIds = getExcludedHeadingIds();
            if (excludedIds.length === 0) return 0;

            var sidebar = document.querySelector('.app-sub-sidebar');
            if (!sidebar) return 0;

            var removedCount = 0;
            sidebar.querySelectorAll('li').forEach(function(li) {
                var link = li.querySelector(':scope > a');
                if (!link) return;

                var href = decodeURIComponent(link.getAttribute('href') || '');

                var shouldRemove = excludedIds.some(function(id) {
                    return href.includes('id=' + id);
                });

                if (shouldRemove) {
                    // Promote children before removing
                    var childUl = li.querySelector(':scope > ul');
                    if (childUl && li.parentElement) {
                        Array.from(childUl.children).forEach(function(child) {
                            li.parentElement.insertBefore(child, li);
                        });
                    }
                    li.remove();
                    removedCount++;
                }
            });

            return removedCount;
        }

        function watchSidebar() {
            if (sidebarObserver) {
                sidebarObserver.disconnect();
            }

            var sidebarNav = document.querySelector('.sidebar-nav');
            if (!sidebarNav) return;

            // Continuous cleanup with RAF until stable
            var stableCount = 0;
            var lastRemoved = -1;

            function cleanupLoop() {
                var removed = filterSidebar();

                if (removed > 0 || removed !== lastRemoved) {
                    // Still changing, keep checking
                    lastRemoved = removed;
                    stableCount = 0;
                    requestAnimationFrame(cleanupLoop);
                } else {
                    // Stable, but verify a few more times
                    stableCount++;
                    if (stableCount < 20) {
                        requestAnimationFrame(cleanupLoop);
                    }
                }
            }

            sidebarObserver = new MutationObserver(function(mutations) {
                // Check if the app-sub-sidebar was added or modified
                var relevant = mutations.some(function(m) {
                    if (m.addedNodes.length > 0) return true;
                    if (m.target.classList && m.target.classList.contains('app-sub-sidebar')) return true;
                    return false;
                });

                if (relevant) {
                    stableCount = 0;
                    lastRemoved = -1;
                    requestAnimationFrame(cleanupLoop);
                }
            });

            sidebarObserver.observe(sidebarNav, {
                childList: true,
                subtree: true
            });

            // Start continuous cleanup
            requestAnimationFrame(cleanupLoop);
        }

        hook.doneEach(function() {
            watchSidebar();
        });

        hook.ready(function() {
            watchSidebar();
        });
    };

    window.$docsify = window.$docsify || {};
    window.$docsify.plugins = (window.$docsify.plugins || []).concat(docsifySidebarFilter);
})();
