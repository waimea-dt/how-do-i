# What is Jinja?

Jinja is templating language used by Flask. It lets you generate HTML by combining normal HTML code with data from Python (e.g. from a database query).

## Why use Templates?

Without templates, you repeat same HTML across many pages. With Jinja, you can define your content once, and re-use it as needed (e.g. by **extending** a base template or **including** small partial elements).


```python
return render_template('profile.html', username='Rae')
```
