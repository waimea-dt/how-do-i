# Colour Properties

Use colour to support hierarchy and readability.

```css
:root {
    --bg:      #f8fafc;
    --surface: #ffffff;
    --text:    #1f2937;
    --accent:  #0f766e;
}

body {
    background: var(--bg);
    color: var(--text);
}

section {
    background-color: var(--surface);
}

button {
    background: var(--accent);
    color: white;
}
```

Use contrast checks so text remains readable.
