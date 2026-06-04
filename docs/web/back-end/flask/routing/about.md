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
