# Flask Route + Jinja Page

Small pattern for rendering dynamic page data.

## Flask route

```python
from flask import Flask, render_template

app = Flask(__name__)

@app.route('/topic/<name>')
def topic(name):
    examples = ['Definition', 'Code snippet', 'Practice task']
    return render_template('topic.html', name=name, examples=examples)
```

## topic.html

```jinja
<h1>{{ name|title }}</h1>
<ul>
{% for item in examples %}
    <li>{{ item }}</li>
{% endfor %}
</ul>
```

This pattern is useful for reusable content pages.
