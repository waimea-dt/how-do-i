# What is HTMX?

HTMX lets HTML trigger server requests directly.
You get dynamic UI without large front-end frameworks.

## Idea

- user clicks element
- HTMX sends request
- server returns HTML fragment
- page section updates

```html
<button hx-get="/status" hx-target="#status-box" hx-swap="innerHTML">
    Check status
</button>
<div id="status-box"></div>
```
