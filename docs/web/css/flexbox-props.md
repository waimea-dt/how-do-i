# Flexbox Properties

## Container properties

```css
.row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
}
```

## Item properties

```css
.item-main {
    flex: 2;
}

.item-side {
    flex: 1;
}
```

Use `gap` and `flex-wrap` to keep layouts clean on small screens.
