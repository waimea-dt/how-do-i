# Grid Properties

## Container setup

```css
.layout {
    display: grid;
    grid-template-columns: 16rem 1fr;
    gap: 1rem;
}
```

## Item placement

```css
.header {
    grid-column: 1 / -1;
}

.sidebar {
    grid-column: 1;
}

.main {
    grid-column: 2;
}
```

Grid gives precise control for complex page structure.
