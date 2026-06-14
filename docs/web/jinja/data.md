# Adding Data to Templates

Send values from Flask route into template context.

```python
@app.route('/student')
def student():
    return render_template('student.html', name='Ava', level=2)
```

```jinja2
<h1>{{ name }}</h1>
<p>Level {{ level }}</p>
```
