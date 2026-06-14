# Creating a Session

In Flask, session starts when you first assign to `session`.

```python
from flask import session

@app.route('/set-theme/<mode>')
def set_theme(mode):
	session['theme'] = mode
	return 'Theme saved'
```

Set `app.secret_key` to a strong value before using sessions.

