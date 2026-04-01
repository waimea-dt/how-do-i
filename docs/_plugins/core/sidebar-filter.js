/**
 * docsify-sidebar-filter.js — Removes sub-sidebar entries for headings inside custom/plugin elements.
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
    // Only for plugins that preserve the original tag name in the DOM.
    var EXCLUDED_TAGS = [
        'computer',  // Keeps <computer> tag
    ];

    // Most plugins transform their tags before doneEach runs (remove wrapper, add class).
    // Scan for their post-transformation selectors instead of raw tag names.
    var EXCLUDED_SELECTORS = [
        'ul.flash-cards',               // <flashcards> → <ul class="flash-cards">
        'div.cards-container',          // <cards> → <div class="cards-container">
        'div.docsify-slide-deck',       // <slides> → <div class="reveal docsify-slide-deck">
        'ol.sequence',                  // <sequence> → <ol class="sequence">
        'ul.structure',                 // <structure> → <ul class="structure">
        'ol.structure',                 // <structure> → <ol class="structure"> (for ordered)
        'dl.timeline',                  // <timeline> → <dl class="timeline">
        'div.hierarchy-scroll-wrapper', // <hierarchy> → <div class="hierarchy-scroll-wrapper">
        'ul.file-tree',                 // <file-tree> → <ul class="file-tree">
        'ul.quiz',                      // <quiz> → <ul class="quiz">
    ];

    var docsifySidebarFilter = function (hook) {
        hook.doneEach(function () {
            // Collect IDs of headings inside custom tags from the live DOM
            var excludedIds = [];
            var section = document.querySelector('.markdown-section');

            if (section) {
                EXCLUDED_TAGS.forEach(function (tag) {
                    section.querySelectorAll(tag).forEach(function (container) {
                        container.querySelectorAll('h1[id], h2[id], h3[id]').forEach(function (h) {
                            if (h.id) excludedIds.push(h.id);
                        });
                    });
                });

                EXCLUDED_SELECTORS.forEach(function (selector) {
                    section.querySelectorAll(selector).forEach(function (container) {
                        container.querySelectorAll('h1[id], h2[id], h3[id]').forEach(function (h) {
                            if (h.id) excludedIds.push(h.id);
                        });
                    });
                });
            }

            // Remove sub-sidebar entries for excluded heading IDs
            // Before removing, promote children to parent level to preserve non-excluded headings
            if (excludedIds.length > 0) {
                document.querySelectorAll('.app-sub-sidebar li').forEach(function (li) {
                    var a = li.querySelector('a');
                    if (!a) return;
                    var href = decodeURIComponent(a.getAttribute('href') || '');

                    var shouldRemove = excludedIds.some(function(id) {
                        return href.includes('id=' + id);
                    });

                    if (shouldRemove) {
                        // Before removing, promote any children to this li parent
                        var childUl = li.querySelector(':scope > ul');
                        if (childUl && li.parentElement) {
                            var children = Array.from(childUl.children);
                            children.forEach(function(child) {
                                li.parentElement.insertBefore(child, li);
                            });
                        }
                        li.remove();
                    }
                });
            }
        });
    };

    window.$docsify = window.$docsify || {};
    window.$docsify.plugins = [docsifySidebarFilter].concat(window.$docsify.plugins || []);
})();
