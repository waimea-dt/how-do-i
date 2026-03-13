(function () {
    var docsifyLucideIcons = function (hook) {
        hook.doneEach(function () {
            lucide.createIcons({
                attrs: {
                    class: ['icon'],
                    'stroke-width': 2,
                    stroke: 'currentColor'
                },
            })
        })
    }

    window.$docsify = window.$docsify || {}
    window.$docsify.plugins = [].concat(docsifyLucideIcons, window.$docsify.plugins || [])
})();
