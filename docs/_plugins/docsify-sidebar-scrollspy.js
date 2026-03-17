(function () {
    var docsifySidebarScrollspy = function (hook) {
        var initialized = false;

        function getActiveId() {
            var headings = Array.from(document.querySelectorAll(
                '.markdown-section h1[id], .markdown-section h2[id], .markdown-section h3[id]'
            ));
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
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
                var href = decodeURIComponent(a.getAttribute('href') || '');
                li.classList.toggle('active', href.includes('id=' + id));
            });
        }

        hook.doneEach(function () {
            if (initialized) return;
            initialized = true;
            window.addEventListener('scroll', function () {
                requestAnimationFrame(function () { setActive(getActiveId()); });
            });
        });
    };

    window.$docsify = window.$docsify || {};
    window.$docsify.plugins = [docsifySidebarScrollspy].concat(window.$docsify.plugins || []);
})();
