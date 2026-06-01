# Inline Validation

Validate field input as user types.

```html
<input
    name="email"
    hx-post="/validate-email"
    hx-trigger="blur"
    hx-target="#email-error"
>
<div id="email-error"></div>
```

Return short hint message from Flask route.
