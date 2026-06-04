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
