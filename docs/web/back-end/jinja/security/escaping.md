# Escaping and Safe Output

Jinja escapes output by default to prevent script injection.

```jinja
<p>{{ user_comment }}</p>
```

Do not mark user-generated content as safe unless you fully sanitise it.

```jinja
{{ trusted_html|safe }}
```

Use `safe` only for content you control.
