# Form Handling

Use JavaScript to validate or transform form data before sending.

```js
const form = document.querySelector('#signup-form')
const username = document.querySelector('#username')
const error = document.querySelector('#error')

form.addEventListener('submit', event => {
    if (username.value.trim().length < 3) {
        event.preventDefault()
        error.textContent = 'Username must be 3+ characters'
    }
})
```

Client-side checks improve UX, but server-side validation is still required.
