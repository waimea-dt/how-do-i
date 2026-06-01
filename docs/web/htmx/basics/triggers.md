# Triggers

`hx-trigger` changes when request fires.

```html
<input
    name="search"
    hx-get="/search"
    hx-trigger="keyup changed delay:300ms"
    hx-target="#results"
>
<div id="results"></div>
```

Useful for live search and instant feedback.
