(function () {
    var docsifyKotlinRunner = function (hook) {
        hook.doneEach(function () {
            const kotlinCode = 'pre code.lang-kotlin, pre code.language-kotlin'

            var kotlinCodeBlocks = document.querySelectorAll(kotlinCode)

            console.log(kotlinCodeBlocks.length)

            if (!kotlinCodeBlocks.length) return

            kotlinCodeBlocks.forEach(codeBlock => {
                codeBlock.setAttribute('theme', 'darcula')
                codeBlock.setAttribute('auto-indent', 'true')
                codeBlock.setAttribute('data-autocomplete', 'true')
                codeBlock.setAttribute('highlight-on-fly', 'true')
                // codeBlock.setAttribute('lines', 'true')
                codeBlock.setAttribute('match-brackets', 'true')
            })

            KotlinPlayground(
                kotlinCode
            )
        })
    }

    window.$docsify = window.$docsify || {}
    window.$docsify.plugins = [].concat(docsifyKotlinRunner, window.$docsify.plugins || [])
})();
