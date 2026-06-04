# Filters

Filters transform values in templates.

```jinja
<p>{{ username|upper }}</p>
<p>{{ bio|truncate(80) }}</p>
<p>{{ created_at|default('Unknown') }}</p>
```

Common filters:

- `upper`, `lower`
- `length`
- `default`
- `title`
