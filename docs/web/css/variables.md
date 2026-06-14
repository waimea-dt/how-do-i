# Variables and Themes

CSS variables keep colours and spacing consistent.

```css
:root {
    --space-sm: 0.5rem;
    --space-md: 1rem;
    --radius: 0.75rem;
}

.panel {
    padding: var(--space-md);
    border-radius: var(--radius);
}
```

Use shared variables to make theme updates fast and safe.
