# Base Templates

A 'base' template defines the overall, shared page layout that every page will use. Other 'child' templates can **extend** this base template, filling in blocks as needed.

## A Typical Base Template: _base.html

This base template defines all the HTML that is common to every page of the site. It defines some content **blocks** where child page HTML will be inserted (note that some of the blocks have default values)...

```jinja2
<!doctype html>

<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>Site Name - {% block title %}Page Title{% endblock %}</title>
    </head>

    <body>
        <header>
            {% block title %}Page Title{% endblock %}
        </header>

        <main>
            {% block content %}{% endblock %}
        </main>
    </body>
</html>
```

> [!TIP]
> You can call your templates anything you like, but naming the page template `_base.jinja` (with a leading underscore) makes it appear at the top of the template file list, and makes it clear it is 'special'


## A Typical Child Template: home.jinja

This template uses and **extends** the base template above, providing content **blocks** that will be placed into the base template in the defined locations...

```jinja2
{% extends '_base.html' %}

{% block title %}Home{% endblock %}

{% block content %}
    <h1>Welcome!</h1>
    <p>This is a great website!</p>
{% endblock %}
```
