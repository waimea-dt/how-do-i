# How Templates Work

1. Flask route gets request.
2. Route prepares data.
3. `render_template` sends data to Jinja file.
4. Jinja returns final HTML to browser.

```python
@app.route('/scores')
def scores():
    data = [65, 73, 81]
    return render_template('scores.html', scores=data)
```
