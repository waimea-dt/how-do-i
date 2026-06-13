# Storing Session Data

Use session for small per-user state, not large datasets.

```python
session['user_id'] = user.id
session['display_name'] = user.name
session['theme'] = 'dark'
```

## Good uses

- login state
- selected theme
- temporary messages

## Avoid

- large blobs of data
- secret information in plain text

