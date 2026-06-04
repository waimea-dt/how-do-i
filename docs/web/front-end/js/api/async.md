# Async and Await

Async code handles delayed tasks like network requests.

```js
async function loadProfile() {
    try {
        const res = await fetch('/api/profile')
        const profile = await res.json()
        renderProfile(profile)
    } catch (error) {
        showError('Could not load profile')
        console.error(error)
    }
}
```

## Why use it

- easier to read than chained promises
- clearer error handling with `try/catch`
