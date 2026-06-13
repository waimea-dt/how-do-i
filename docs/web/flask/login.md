# Logging In a User

Typical login flow:

1. user submits username and password
2. app finds user record
3. app verifies password hash
4. app stores user id in session

```python
from flask import request, session, redirect, url_for
from werkzeug.security import check_password_hash

@app.route('/login', methods=['GET', 'POST'])
def login():
	if request.method == 'POST':
		username = request.form.get('username', '').strip()
		password = request.form.get('password', '')

		user = find_user_by_username(username)
		if user and check_password_hash(user.password_hash, password):
			session['user_id'] = user.id
			return redirect(url_for('dashboard'))

		return 'Invalid username or password', 401

	return render_template('login.html')
```
# Logging In a User
