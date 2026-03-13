(function () {
    var docsifyKotlinRunner = function (hook) {

        // Transform opt-in markers in raw markdown before rendering
        hook.beforeEach(function (content) {
            content = content.replace(
                // Match runnable code blocks
                /^```kotlin\s+run\r?\n([\s\S]*?)^```/gm,
                // And wrap code with fun main() {...} if needed
                function (match, body) {
                    // main() is not there?
                    if (!/fun\s+main\s*\(/.test(body)) {
                        const indented = body.replace(/^(.+)/gm, '    $1')
                        body = 'fun main() {\n//sampleStart\n' + indented + '//sampleEnd\n}\n'
                    }
                    return '<div class="kotlin-run">\n\n```kotlin\n' + body + '```\n\n</div>'
                }
            )
            return content
        })

        // Launcher code runner for runnable code blocks
        hook.doneEach(function () {
            const kotlinCode = '.kotlin-run pre code.lang-kotlin, .kotlin-run pre code.language-kotlin'
            var kotlinCodeBlocks = document.querySelectorAll(kotlinCode)
            if (!kotlinCodeBlocks.length) return

            kotlinCodeBlocks.forEach(codeBlock => {
                codeBlock.setAttribute('theme', 'darcula')
                codeBlock.setAttribute('auto-indent', 'true')
                codeBlock.setAttribute('data-autocomplete', 'true')
                codeBlock.setAttribute('highlight-on-fly', 'true')
                // codeBlock.setAttribute('lines', 'true')
                codeBlock.setAttribute('match-brackets', 'true')
            })

            KotlinPlayground(kotlinCode).catch(function (err) {
                if (!(err instanceof DOMException && err.name === 'AbortError')) throw err
            })
        })
    }

    window.$docsify = window.$docsify || {}
    window.$docsify.plugins = [].concat(docsifyKotlinRunner, window.$docsify.plugins || [])
})();
