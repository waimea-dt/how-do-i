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






# What is URL Routing?

Routing is mapping URL paths to route functions.

## Basic mapping

```python
@app.route('/')
def home():
    return render_template('home.html')

@app.route('/about')
def about():
    return render_template('about.html')
```

## Dynamic routing

```python
@app.route('/student/<int:student_id>')
def student(student_id):
    return f'Student id: {student_id}'
```

## Why routing matters

- clear application structure
- predictable URLs for users
- easier testing and debugging
- supports reusable view logic

## L2/L3 expectations

You should be able to:

- design route plan for your project
- explain GET vs POST usage
- use route parameters for dynamic pages
- handle invalid route input safely
