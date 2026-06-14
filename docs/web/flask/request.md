# How Does Flask Work?

Flask sits between browser requests and your Python code.

## Request-response cycle

1. Browser sends request for URL.
2. Flask matches URL to route.
3. Route code runs business logic.
4. Flask returns response to browser.

```text
Browser -> GET /profile -> Flask route -> load data -> render template -> Browser
```

## Example

```python
from flask import Flask, render_template

app = Flask(__name__)

@app.route('/profile/<username>')
def profile(username):
    user = {'username': username, 'score': 1280}
    return render_template('profile.html', user=user)
```

```jinja2
<h1>{{ user.username }}</h1>
<p>Score: {{ user.score }}</p>
```

## Request data sources

- path parameters: `/product/<id>`
- query parameters: `/search?q=python`
- form body: submitted via POST form
- JSON body: sent by API clients

## Response types

- HTML page
- JSON data
- redirect to another route
- status/error response
