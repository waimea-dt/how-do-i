# Tracking Login State

Use session data to track whether user is logged in.

```python
from flask import session

def is_logged_in():
	return 'user_id' in session
```

## Route guard example

```python
from flask import redirect, url_for

@app.route('/dashboard')
def dashboard():
	if 'user_id' not in session:
		return redirect(url_for('login'))
	return render_template('dashboard.html')
```

This protects private pages from unauthorised access.

