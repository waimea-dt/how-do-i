# Lists and Loops

Render repeated data with `for` loops.

```python
@app.route('/topics')
def topics():
    items = ['HTML', 'CSS', 'JavaScript']
    return render_template('topics.html', items=items)
```

```jinja
<ul>
{% for item in items %}
    <li>{{ item }}</li>
{% endfor %}
</ul>
```
