# Selecting and Updating Elements

DOM API lets JavaScript read and change page content.

```js
const title = document.querySelector('h1')
const card = document.querySelector('.profile-card')

title.textContent = 'Level 3 Project Dashboard'
card.classList.add('is-active')
```

## Useful selectors

- `#id`
- `.class`
- `tag`
- `[data-role="value"]`
