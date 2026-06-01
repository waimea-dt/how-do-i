# Responsive Design

Responsive design adapts layout to different screen widths.

```css
.grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
}

@media (min-width: 48rem) {
    .grid {
        grid-template-columns: 1fr 1fr;
    }
}

@media (min-width: 64rem) {
    .grid {
        grid-template-columns: 1fr 1fr 1fr;
    }
}
```

## L2/L3 checkpoint

Show evidence that design works on phone and desktop.
