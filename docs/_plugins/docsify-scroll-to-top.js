(function () {
    var docsifyScrollToTop = function (hook) {
        hook.doneEach(function () {
            window.scrollTo(0, 0);
        });
    };

    window.$docsify = window.$docsify || {};
    window.$docsify.plugins = [docsifyScrollToTop].concat(window.$docsify.plugins || []);
})();
