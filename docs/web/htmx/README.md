# HTMX

**HTMX** is a lightweight library that lets you access modern browser features directly from HTML attributes - without writing any JavaScript. It makes it easy to build dynamic, interactive pages by adding behaviour directly to your HTML elements.

```html
<button hx-get="/greet" hx-target="#result">
  Say Hello
</button>
<div id="result"></div>
```

> [!TIP]
> Use the sidebar to navigate the topics in this guide.


## What is HTMX For?

HTMX extends HTML to support:

- **AJAX requests** - fetch content from a server without a full page reload
- **Partial page updates** - replace just part of the page with new content
- **Events** - trigger requests on clicks, inputs, scrolls, and more

> [!NOTE]
> HTMX works especially well with server-side frameworks like Flask, letting you build interactive sites with very little JavaScript.
