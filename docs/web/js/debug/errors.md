# Error Handling and Debugging

Good debugging saves project time.

## Browser tools

- Console: inspect logs and errors
- Elements: inspect live DOM
- Network: inspect requests and responses

## Defensive coding example

```js
function updateName(name) {
    if (!name || name.trim() === '') {
        throw new Error('Name is required')
    }
    document.querySelector('#name').textContent = name
}
```

## Common mistakes

- wrong selector string
- forgetting `await`
- assuming API always returns success
