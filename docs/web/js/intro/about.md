# What is JavaScript?

JavaScript adds behaviour to webpages.

HTML gives structure.
CSS gives style.
JavaScript gives interaction.

## Simple example

```html
<button id="roll-btn">Roll dice</button>
<p id="result">Ready...</p>

<script>
    const button = document.querySelector('#roll-btn')
    const result = document.querySelector('#result')

    button.addEventListener('click', () => {
        const value = Math.floor(Math.random() * 6) + 1
        result.textContent = `You rolled ${value}`
    })
</script>
```

## L2/L3 checkpoint

You should be able to explain:

- event-driven programming
- variables and conditionals
- reading and updating DOM elements
