# Loading States

Show progress while HTMX request is running.

```html
<button hx-get="/report" hx-target="#out" hx-indicator="#loading">Load report</button>
<div id="loading" class="htmx-indicator">Loading...</div>
<div id="out"></div>
```

Good loading feedback improves user experience.
