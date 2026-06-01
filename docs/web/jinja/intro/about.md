# What is Jinja?

Jinja is templating language used by Flask.
It lets you generate HTML using Python data.

## Why use templates

Without templates, you repeat same HTML across many pages.
With Jinja, you reuse base layout and inject page-specific content.

```python
return render_template('profile.html', username='Rae')
```
