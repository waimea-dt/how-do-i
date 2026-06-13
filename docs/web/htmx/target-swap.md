# Targets and Swaps

`hx-target` selects where response goes.
`hx-swap` controls how content is inserted.

```html
<button
    hx-get="/latest"
    hx-target="#feed"
    hx-swap="afterbegin"
>
    Refresh feed
</button>
<div id="feed"></div>
```

Common swap values:

- `innerHTML`
- `outerHTML`
- `beforeend`
- `afterbegin`
