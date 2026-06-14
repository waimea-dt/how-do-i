# HTML Form Validation

HTML has built-in validation rules to catch common input mistakes.

## Example with validation attributes

```html
<form>
    <label for="email">School Email</label>
    <input id="email" name="email" type="email" required>

    <label for="age">Age</label>
    <input id="age" name="age" type="number" min="13" max="19" required>

    <label for="password">Password</label>
    <input id="password" name="password" type="password" minlength="8" required>

    <button type="submit">Submit</button>
</form>
```

## Useful attributes

- `required`
- `min` and `max`
- `minlength` and `maxlength`
- `pattern`

Validation improves data quality but server must still validate too.
