# Escaping and Safe Output

Jinja escapes output by default to prevent script injection.

```jinja2
<p>{{ user_comment }}</p>
```

Do not mark user-generated content as safe unless you fully sanitise it.

```jinja2
{{ trusted_html|safe }}
```

Use `safe` only for content you control.
