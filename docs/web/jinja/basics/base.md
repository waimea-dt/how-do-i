# Base Templates

Base template defines shared page layout.
Child templates fill blocks.

## base.html

```jinja
<!doctype html>
<html lang="en">
<head>
    <title>{% block title %}Site{% endblock %}</title>
</head>
<body>
    <header>School Project Hub</header>
    <main>{% block content %}{% endblock %}</main>
</body>
</html>
```

## child template

```jinja
{% extends 'base.html' %}

{% block title %}Dashboard{% endblock %}

{% block content %}
<h1>Dashboard</h1>
{% endblock %}
```
