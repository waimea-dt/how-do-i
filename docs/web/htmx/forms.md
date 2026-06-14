# Forms with HTMX

HTMX forms can submit and update page section without full reload.

```html
<form hx-post="/save-task" hx-target="#task-list" hx-swap="beforeend">
    <input name="task" required>
    <button type="submit">Add</button>
</form>

<ul id="task-list"></ul>
```

Server returns HTML for new list item.
