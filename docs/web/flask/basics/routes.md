# Routes

Routes map URL paths to Python functions.

## Basic routes

```python
@app.route('/')
def home():
	return 'Home page'

@app.route('/about')
def about():
	return 'About page'
```

## Dynamic route parameters

```python
@app.route('/student/<name>')
def student(name):
	return f'Hello, {name}'
```

## Method-specific routes

```python
@app.route('/login', methods=['GET', 'POST'])
def login():
	if request.method == 'POST':
		return 'Process login'
	return 'Show form'
```

Clear route naming helps marker follow your application flow.
