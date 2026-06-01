# HTMX Search and Filter

Live search pattern without writing front-end fetch code.

## HTML

```html
<input
    name="q"
    hx-get="/search"
    hx-trigger="keyup changed delay:250ms"
    hx-target="#results"
    placeholder="Search topics"
>

<div id="results"></div>
```

## Flask route

```python
from flask import request, render_template

@app.route('/search')
def search():
    q = request.args.get('q', '').strip().lower()
    topics = ['HTML', 'CSS', 'JavaScript', 'Flask', 'HTMX']
    matches = [item for item in topics if q in item.lower()]
    return render_template('partials/search_results.html', matches=matches)
```

## partial template

```jinja
<ul>
{% for item in matches %}
    <li>{{ item }}</li>
{% else %}
    <li>No matches</li>
{% endfor %}
</ul>
```
