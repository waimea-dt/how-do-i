# Web Development

```html
<!DOCTYPE html>

<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">

    <title>DT Notes</title>

    <link rel="icon" href="_assets/macs/macintosh.svg">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
</head>

<body>
    <h1 id="greeting">Hello, World!</h1>

    <div id="app">Please wait...</div>

    <script>
        window.$docsify = {
            name: 'DT Notes',

            logo: '/_assets/macs/macintosh-happy.svg',
            // themeColor: '#2ece53',
        }
    </script>
</body>
```

```css
.token.selector {
    color: var(--code-hl-selector-color);
}


h1.greeting {
    font-size: 5rem;
}

.markdown-section pre[class*="language-"] {
    margin: 0.5em 0;
    overflow: auto;
    border-radius: 0.3em;
}

.token.selector {
    color: var(--code-hl-selector-color);
}

@media screen and (min-width: 800px) {
    .token.selector {
        color: var(--code-hl-selector-color);
    }
}

```

```js
const greeting = () => {
    console.log("Hello, Wordl!")
}

(function () {
    var docsifyKotlinRunner = function (hook) {
        hook.doneEach(function () {
            const kotlinCode = 'pre code.lang-kotlin, pre code.language-kotlin'

            var kotlinCodeBlocks = document.querySelectorAll(kotlinCode)

            console.log(kotlinCodeBlocks.length)

            if (!kotlinCodeBlocks.length) return

            kotlinCodeBlocks.forEach(codeBlock => {
                codeBlock.setAttribute('theme', 'dark')
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
```
