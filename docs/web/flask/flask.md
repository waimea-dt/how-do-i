# Flask

**Flask** is a lightweight web framework for Python. It lets you build websites and web applications using Python code to handle requests, generate pages, and manage data.

## What is Flask For?

Flask handles the *server side* of a web application:

- **Routing** - map URLs to Python functions
- **Templating** - generate HTML pages dynamically using Jinja2
- **Forms and data** - receive and process user input
- **Sessions and security** - manage logged-in users and protect your app

> [!NOTE]
> Flask is called a *micro-framework* because it has a small core that you extend as needed, rather than including everything by default.


## Minimal Flask App

Flask apps can be very simple...

```python
from flask import Flask

app = Flask(__name__)

@app.route('/')
def home():
    return '<h1>Hello, World!</h1>'

@app.route('/test')
def test():
    return '<h1>Test Page</h1>'
```

In this minimal example:
- `app = Flask(__name__)`(python) - create app instance
- `@app.route(...)`(python) - define a URL path to match
- `def home():`(python) - the function to run if route matches
- `return ...`(python) - the content of the HTTP response

## Typical project structure

<filetree>

- app
    - __init__.py           // the main app with routing

    - static                // content served up directly
        - css
            - styles.css
        - images
            - favicon.svg
            - logo.svg

    - templates             // templates to build pages
        - pages
            - _base.jinja
            - home.jinja
            - user.jinja
        - partials
            - nav.jinja
            - messages.jinja
</filetree>

> [!NOTE]
> The template folder contains Jinja Template files - explore these in the [Jinja](/web/jinja/) section of the notes
