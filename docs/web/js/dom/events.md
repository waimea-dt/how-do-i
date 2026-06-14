# Events

Events run code when user interacts with page.

```js
const button = document.querySelector('#save-btn')

button.addEventListener('click', () => {
    console.log('Saved')
})
```

## Common event types

- `click`
- `input`
- `change`
- `submit`
- `keydown`

Keep handlers short and move complex logic into separate functions.
