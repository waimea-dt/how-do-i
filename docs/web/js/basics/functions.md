# Functions

Functions package reusable logic.

```js
function calcAverage(total, count) {
    if (count === 0) {
        return 0
    }
    return total / count
}

const avg = calcAverage(54, 3)
console.log(avg)
```

## Arrow function

```js
const toPercent = value => `${value}%`
```

Choose clear names that describe behaviour.
