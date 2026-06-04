# Animations

Animations can draw attention to key actions.

```css
@keyframes pulse {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.04);
    }
    100% {
        transform: scale(1);
    }
}

.badge {
    animation: pulse 1.2s ease-in-out infinite;
}
```

Use animation sparingly so page stays readable.
