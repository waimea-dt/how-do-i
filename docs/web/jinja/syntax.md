# Jinja Syntax

Three core syntax styles:

- `{{ ... }}`(jinja2) output value
- `{% ... %}`(jinja2) control logic
- `{# ... #}`(jinja2) comment

```jinja2
<h1>{{ title }}</h1>

{% if logged_in %}
    <p>Welcome back.</p>
{% endif %}
```
