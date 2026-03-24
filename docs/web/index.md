# Web Development

Every website you visit - from a game wiki to a YouTube video - is built from the same three core technologies: **HTML**, **CSS**, and **JavaScript**. Each one has a distinct job.

?> Think of building a website like building a house. HTML is the bricks and walls, CSS is the paint and furniture, and JavaScript is the electricity that makes things actually work.


## HTML - The Structure

**HTML** (HyperText Markup Language) defines *what is on the page*. It describes the content and its meaning using **tags**.

```html
<h1>Welcome to My Game Site</h1>
<p>Here you'll find guides, tips, and reviews.</p>
<img src="banner.png" alt="Game banner">
```

HTML doesn't care about colours, fonts, or layout - it just answers the question: *"what is this content?"*

- `<h1>` - a top-level heading
- `<p>` - a paragraph of text
- `<img>` - an image
- `<a>` - a link


## CSS - The Style

**CSS** (Cascading Style Sheets) controls *how the page looks*. It targets HTML elements and applies visual rules to them.

```css
h1 {
    color: hotpink;
    font-size: 2rem;
    font-family: sans-serif;
}

p {
    color: lightgray;
    line-height: 1.6;
}
```

CSS answers the question: *"what does this content look like?"*

- Colours, fonts, and sizes
- Spacing and layout (where things sit on the page)
- Animations and visual effects


## JavaScript - The Behaviour

**JavaScript (JS)** makes pages *interactive and dynamic*. It can respond to what the user does and update the page without reloading.

```js
const button = document.querySelector('#start-game')

button.addEventListener('click', () => {
    console.log('Game started!')
})
```

JS answers the question: *"what does this content do?"*

- Respond to clicks, key presses, form submissions
- Show or hide content dynamically
- Fetch data from a server without reloading the page


## How They Work Together

The three technologies always work as a team:

| | Responsibility | Example |
|---|---|---|
| **HTML** | Structure & content | "There is a button here" |
| **CSS** | Visual appearance | "That button is green and rounded" |
| **JS** | Behaviour & interaction | "When clicked, that button starts the timer" |

> [!NOTE]
> You can think of a webpage as a layered cake - HTML is the sponge, CSS is the icing, and JS is the candles that actually do something when you interact with them.
