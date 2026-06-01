# Setup with Flask

Add HTMX script in base template.

```html
<script src="https://unpkg.com/htmx.org@1.9.12"></script>
```

Create Flask route returning partial HTML.

```python
@app.route('/status')
def status():
    return '<p>Server is online</p>'
```
