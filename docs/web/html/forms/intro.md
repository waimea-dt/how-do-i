# HTML Form Basics

Forms collect user input such as login details, feedback, or search terms.

## Basic form example

```html
<form action="/signup" method="post">
    <label for="username">Username</label>
    <input id="username" name="username" type="text">

    <label for="email">Email</label>
    <input id="email" name="email" type="email">

    <button type="submit">Create account</button>
</form>
```

## Key attributes

- `action`: URL to send data to
- `method`: `get` for simple query, `post` for data changes
- `name`: key used by server to read submitted value
- `for` and `id`: links label to input for accessibility

## L2/L3 checkpoint

Always include labels and clear button text in assessed work.
