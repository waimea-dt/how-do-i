# Contact Form with Validation

Simple accessible contact form with HTML validation and light JavaScript feedback.

## HTML

```html
<form id="contact-form" novalidate>
    <label for="name">Name</label>
    <input id="name" name="name" required minlength="2">

    <label for="email">Email</label>
    <input id="email" name="email" type="email" required>

    <label for="message">Message</label>
    <textarea id="message" name="message" required minlength="10"></textarea>

    <button type="submit">Send</button>
    <p id="form-msg" aria-live="polite"></p>
</form>
```

## JavaScript

```js
const form = document.querySelector('#contact-form')
const msg = document.querySelector('#form-msg')

form.addEventListener('submit', event => {
    if (!form.checkValidity()) {
        event.preventDefault()
        msg.textContent = 'Please complete all fields correctly.'
        return
    }

    event.preventDefault()
    msg.textContent = 'Message sent. Thank you.'
    form.reset()
})
```
