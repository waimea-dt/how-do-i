# Fetch and JSON

Use `fetch` to get data from server without full page reload.

```js
async function loadStats() {
    const response = await fetch('/api/stats')
    if (!response.ok) {
        throw new Error('Failed to load stats')
    }
    const data = await response.json()
    console.log(data)
}
```

## JSON example

```json
{
    "topic": "CSS Grid",
    "difficulty": "medium"
}
```
