# Project Starter Template

Use this as a clean starting point for a small web project.

## Folder Structure

```text
my-web-project/
  index.html
  css/
    styles.css
  js/
    app.js
  assets/
    images/
```

## index.html

```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Starter Project</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <header>
        <h1>Starter Project</h1>
    </header>

    <main>
        <section class="panel">
            <h2>Hello</h2>
            <p>Build your page from here.</p>
        </section>
    </main>

    <script src="js/app.js"></script>
</body>
</html>
```

## css/styles.css

```css
:root {
    --bg: #f8fafc;
    --text: #0f172a;
    --accent: #0ea5e9;
}

* {
    box-sizing: border-box;
}

body {
    margin: 0;
    font-family: 'Segoe UI', sans-serif;
    color: var(--text);
    background: var(--bg);
}

header, main {
    max-width: 60rem;
    margin: 0 auto;
    padding: 1rem;
}

.panel {
    background: white;
    border: 1px solid #dbe3ef;
    border-radius: 0.75rem;
    padding: 1rem;
}
```

## js/app.js

```js
console.log('Starter project ready')
```
