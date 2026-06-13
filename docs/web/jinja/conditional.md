# Conditional Blocks

Use conditional logic to show different output.

```jinja
{% if mark >= 80 %}
<p>Excellence</p>
{% elif mark >= 65 %}
<p>Merit</p>
{% else %}
<p>Keep practising</p>
{% endif %}
```

Keep template logic simple. Move heavy logic into Python route code.
