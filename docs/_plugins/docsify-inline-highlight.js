(function () {
    // Matches: <code>anything</code>(language)
    const HINT_REGEX = /<code>([^<]*)<\/code>\(([a-zA-Z0-9-]+)\)/g

    // The Markdown parser HTML-encodes characters inside code spans.
    // Prism needs the raw text, so we decode before highlighting.
    function decodeEntities(str) {
        return str
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
    }

    const docsifyInlineHighlight = function (hook) {
        hook.afterEach(function (html) {
            return html.replace(HINT_REGEX, function (_, rawCode, lang) {
                lang = lang.toLowerCase()
                const code = decodeEntities(rawCode)

                if (window.Prism && Prism.languages[lang]) {
                    const highlighted = Prism.highlight(code, Prism.languages[lang], lang)
                    return `<code class="language-${lang}">${highlighted}</code>`
                }

                // Language not loaded — leave the code as-is, just drop the hint
                return `<code>${rawCode}</code>`
            })
        })
    }

    window.$docsify = window.$docsify || {}
    window.$docsify.plugins = [].concat(docsifyInlineHighlight, window.$docsify.plugins || [])
})()
