# Logging Out a User

Logging out should remove authentication data from session.

```python
from flask import session, redirect, url_for

@app.route('/logout')
def logout():
	session.pop('user_id', None)
	return redirect(url_for('home'))
```

Use `pop(..., None)` so route works even if user is already logged out.


