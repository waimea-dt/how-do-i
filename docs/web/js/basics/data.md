# Arrays and Objects

Arrays store ordered collections.
Objects store related fields.

```js
const marks = [72, 88, 64]
const student = {
    id: 104,
    name: 'Aria',
    level: 3
}
```

## Common array methods

```js
const passed = marks.filter(mark => mark >= 50)
const doubled = marks.map(mark => mark * 2)
const total = marks.reduce((sum, mark) => sum + mark, 0)
```
