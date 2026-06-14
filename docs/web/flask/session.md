# What is a Session?

A session stores small user-specific data between requests.

HTTP is stateless, so each request arrives with no memory.
Sessions add memory for each user.

## Typical session data

- `user_id` after login
- selected theme
- temporary flash messages

## Flask example

```python
from flask import session

@app.route('/set-level/<int:level>')
def set_level(level):
    session['level'] = level
    return 'Level saved'
```

## Important rule

Use sessions for small state only.
Do not store large data or secrets in plain text.
