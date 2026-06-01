# Specificity

Specificity decides which style wins when multiple rules target same element.

Order from weaker to stronger:

1. element selectors
2. class selectors
3. id selectors
4. inline styles

```css
p {
    color: black;
}

.note p {
    color: blue;
}

#alert p {
    color: red;
}
```

In this case, paragraph inside `#alert` is red.

Keep specificity low and consistent to avoid style conflicts.
