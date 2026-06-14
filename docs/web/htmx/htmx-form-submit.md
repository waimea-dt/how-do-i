# HTMX Form Submit Without Reload

Send a form and update list section only.

## HTML

```html
<form hx-post="/tasks" hx-target="#task-list" hx-swap="beforeend">
    <label for="task">Task</label>
    <input id="task" name="task" required>
    <button type="submit">Add</button>
</form>

<ul id="task-list"></ul>
```

## Flask route

```python
from flask import request, render_template

@app.route('/tasks', methods=['POST'])
def add_task():
    task = request.form.get('task', '').strip()
    if not task:
        return '<li>Task cannot be empty</li>', 400
    return render_template('partials/task_item.html', task=task)
```

## partial template

```jinja2
<li>{{ task }}</li>
```
