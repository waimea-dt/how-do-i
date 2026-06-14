# Conditional Blocks

Use conditional logic to show different output.

```jinja2
{% if mark >= 80 %}
    <p>Excellence</p>
{% elif mark >= 65 %}
    <p>Merit</p>
{% elif mark >= 50 %}
    <p>Achieved</p>
{% else %}
    <p>Not Achieved</p>
{% endif %}
```

Keep template logic simple. Move heavy logic into Python route code.
