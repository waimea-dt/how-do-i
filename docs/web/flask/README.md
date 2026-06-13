# Flask

**Flask** is a lightweight web framework for Python. It lets you build websites and web applications using Python code to handle requests, generate pages, and manage data.

```python
from flask import Flask

app = Flask(__name__)

@app.route('/')
def home():
    return '<h1>Hello, World!</h1>'
```

> [!TIP]
> Use the sidebar to navigate the topics in this guide. If you're new to Flask, start with **Flask Introduction** and follow the sections in order.


## What is Flask For?

Flask handles the *server side* of a web application:

- **Routing** - map URLs to Python functions
- **Templating** - generate HTML pages dynamically using Jinja2
- **Forms and data** - receive and process user input
- **Sessions and security** - manage logged-in users and protect your app

> [!NOTE]
> Flask is called a *micro-framework* because it has a small core that you extend as needed, rather than including everything by default.





# What is Flask?

Flask is a lightweight Python web framework.
It helps you build server-side web apps with clear routing, template rendering, and request handling.

## Why Flask is good for Level 2/3 projects

- simple setup
- easy to read project structure
- strong fit with Python skills already used in class
- supports dynamic pages, forms, and login systems

## What Flask does

- maps URLs to Python functions (routes)
- reads request data from users
- returns HTML, JSON, redirects, or errors
- works with Jinja templates for reusable pages

## Minimal Flask app

```python
from flask import Flask

app = Flask(__name__)

@app.route('/')
def home():
    return '<h1>Welcome to my site</h1>'

if __name__ == '__main__':
    app.run(debug=True)
```

## Key concepts

- `app = Flask(__name__)`: create app instance
- `@app.route(...)`: connect URL path to function
- route function return value becomes HTTP response

## Typical project structure

```text
my-app/
  app.py
  templates/
    base.html
    home.html
  static/
    css/
    js/
```

## Next steps

1. Learn how request and response cycle works
2. Add Jinja templates
3. Process form data with POST routes
4. Add sessions for login state
