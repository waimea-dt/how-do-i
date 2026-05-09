# Code Tests


## Python

```python
print("Hello, World!")

for i in range(10):
    print(f"Number: {i}...")
```

```css
h1 {
    color: hotpink;
    font-size: 2rem;
}

#hero {
    width: 100%;
    height: 20rem;
    background-color: #369;
}
```


## JS

```js
hook.doneEach(function () {
    const placeholders = document.querySelectorAll('.slides-placeholder')
    if (!placeholders.length) return

    placeholders.forEach((placeholder) => {
        const index = placeholder.getAttribute('data-index')
        placeholder.outerHTML = buildRevealHTML(index)
    })

    initDecks()
})
```

## JS with Highlights

Should render the `pre` with `data-line="2-3, 5, 10"`.

```js [2-3, 5, 10]
hook.doneEach(function () {
    const placeholders = document.querySelectorAll('.slides-placeholder')
    if (!placeholders.length) return

    placeholders.forEach((placeholder) => {
        const index = placeholder.getAttribute('data-index')
        placeholder.outerHTML = buildRevealHTML(index)
    })

    initDecks()
})
```

## Indent Guides

Should show coloured indent guides on leading whitespace.

```python show-indent
def greet(name):
    if name:
        message = f"Hello, {name}!"
        print(message)
        if name == "Bob":
            print("Yo!")
        else:
            for i in range(3):
                print("Beep!")
    else:
        print("Hello, world!")
```

```js show-indent
hook.doneEach(function () {
    const placeholders = document.querySelectorAll('.slides-placeholder')
    if (!placeholders.length) return

    placeholders.forEach((placeholder) => {
        const index = placeholder.getAttribute('data-index')
        placeholder.outerHTML = buildRevealHTML(index)
    })

    initDecks()
})
```

## Indent Guides with Line Highlights

Should show indent guides AND highlight lines 3-4 and 6.

```python show-indent [3-4, 6]
def greet(name):
    if name:
        message = f"Hello, {name}!"
        print(message)
    else:
        print("Hello, world!")
```
