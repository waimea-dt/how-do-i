/**
 * docsify-sidebar-scrollspy.js — Highlights active sidebar links while scrolling content.
 *
 * This plugin tracks heading positions in the markdown section and toggles the
 * active state in the app-sub-sidebar to match the current viewport position.
 *
 * Usage in markdown:
 *   No custom syntax required.
 *   Works with normal headings like #, ##, ### that Docsify renders with IDs.
 */
(function () {
    var docsifySidebarScrollspy = function (hook) {
        var initialized = false;

        hook.doneEach(function () {
            // Register scroll listener once only. doneEach runs for every route change.
            if (initialized) return;
            initialized = true;

            function getActiveId() {
                var headings = Array.from(document.querySelectorAll(
                    '.markdown-section h1[id], .markdown-section h2[id], .markdown-section h3[id]'
                ));
                var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                // Trigger slightly before the heading reaches the top so the active state feels responsive.
                var threshold = window.innerHeight * 0.25;
                var active = null;
                for (var i = 0; i < headings.length; i++) {
                    if (headings[i].offsetTop <= scrollTop + threshold) active = headings[i].id;
                    else break;
                }
                return active;
            }

            function setActive(id) {
                if (!id) return;
                document.querySelectorAll('.app-sub-sidebar li').forEach(function (li) {
                    var a = li.querySelector('a');
                    if (!a) return;
                    // Sidebar href fragments can be URL-encoded; decode before comparing with heading IDs.
                    var href = decodeURIComponent(a.getAttribute('href') || '');
                    li.classList.toggle('active', href.includes('id=' + id));
                });
            }

            window.addEventListener('scroll', function () {
                // Batch read/write work into the next frame to avoid scroll-jank.
                requestAnimationFrame(function () { setActive(getActiveId()); });
            });
        });
    };

    window.$docsify = window.$docsify || {};
    window.$docsify.plugins = [docsifySidebarScrollspy].concat(window.$docsify.plugins || []);
})();
