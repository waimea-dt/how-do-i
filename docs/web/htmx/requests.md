# GET and POST Requests

HTMX supports both `hx-get` and `hx-post`.

```html
<button hx-get="/quote" hx-target="#quote">Load quote</button>
<div id="quote"></div>
```

```html
<form hx-post="/check-username" hx-target="#msg">
    <input name="username">
    <button type="submit">Check</button>
</form>
<div id="msg"></div>
```
