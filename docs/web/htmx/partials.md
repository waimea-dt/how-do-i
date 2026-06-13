# Partial Templates

Return small Jinja partials for targeted updates.

```python
@app.route('/leaderboard')
def leaderboard():
    scores = get_scores()
    return render_template('partials/leaderboard.html', scores=scores)
```

This keeps responses fast and reusable.
