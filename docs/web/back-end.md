# What is Back-End Web Development?

Back-end web development is code that runs on server.

Users do not directly see this code, but they see its effects:

- login works
- data saves to database
- pages show personalised content

## Front-End vs Back-End

Front-end runs in browser.
Back-end runs on server.

| Part | Runs Where | Main Jobs |
|---|---|---|
| Front-end | Browser | Display content, collect input, respond to clicks |
| Back-end | Server | Process requests, apply logic, return data/pages |

## Request and Response Flow

1. Browser sends request to URL.
2. Server code receives request.
3. Server decides what to do.
4. Server returns response (HTML, JSON, redirect, error).

```text
Browser -> GET /products -> Flask route -> query data -> render template -> Browser
```

## Core Back-End Skills for L2/L3

- Create routes for different pages
- Read URL parameters and form data
- Use templates to avoid repeating HTML
- Validate user input
- Hash passwords instead of storing plain text
- Keep login state with sessions
- Return clear errors when input is invalid

## Example Flask Route

```python
from flask import Flask, render_template

app = Flask(__name__)

@app.route('/hello/<name>')
def hello(name):
	return render_template('hello.html', name=name)
```

## Why This Matters

Strong back-end skills let you build complete, useful systems, not just static pages.
This is key for higher-grade project work where solution must be dynamic, robust, and testable.

