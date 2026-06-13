# Jinja Syntax

Three core syntax styles:

- `{{ ... }}` output value
- `{% ... %}` control logic
- `{# ... #}` comment

```jinja
<h1>{{ title }}</h1>
{% if logged_in %}
<p>Welcome back.</p>
{% endif %}
```
