/**
 * docsify-inline-highlight.js — Highlights inline code hints with Prism language rules.
 *
 * This plugin post-processes rendered markdown and converts patterns like
 * <code>code</code>(language) into Prism-highlighted inline code elements.
 *
 * Usage in markdown:
 *   Use inline code followed by a language hint:
 *   `print("hi")`(python)
 */
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

                // Only Prism-highlight when the language is actually loaded.
                // Falling back avoids throwing and still tags the code for later processing.
                if (window.Prism && Prism.languages[lang]) {
                    const highlighted = Prism.highlight(code, Prism.languages[lang], lang)
                    return `<code class="language-${lang}">${highlighted}</code>`
                }

                // Language not loaded — keep the language class so other plugins can process it
                return `<code class="language-${lang}">${rawCode}</code>`
            })
        })
    }

    window.$docsify = window.$docsify || {}
    window.$docsify.plugins = [].concat(docsifyInlineHighlight, window.$docsify.plugins || [])
})()

