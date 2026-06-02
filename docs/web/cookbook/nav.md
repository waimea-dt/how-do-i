# Responsive Navigation

A simple, clean navigation menu with a UI suitable for mobile and for desktop.


<web-playground data-height="40em" data-width="25em">

```html
<header>
    <h1>Responsive Navigation</h1>

    <nav id="main-menu">
        <button id="menu-open">☰</button>

        <div id="menu-links">
            <a href="#top">Top</a>
            <a href="#part1">Part 1</a>
            <a href="#part2">Part 2</a>
            <a href="#part3">Part 3</a>
        </div>
    </nav>
</header>

<main>
    <h1>Hello World!!!</h1>

    <h2 id="part1">Part 1</h2>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Placerat duis ultricies lacus sed turpis tincidunt id aliquet risus. Etiam tempor orci eu lobortis elementum nibh tellus molestie nunc. Et netus et malesuada fames ac turpis egestas.</p>

    <h2 id="part2">Part 2</h2>
    <p>Placerat duis ultricies lacus sed turpis tincidunt id aliquet risus. Etiam tempor orci eu lobortis elementum nibh tellus molestie nunc. Et netus et malesuada fames ac turpis egestas. Tellus at urna condimentum mattis pellentesque id nibh tortor.</p>

    <h2 id="part3">Part 3</h2>
    <p>Et netus et malesuada fames ac turpis egestas. Tellus at urna condimentum mattis pellentesque id nibh tortor. Justo donec enim diam vulputate ut pharetra sit amet. Cum sociis natoque penatibus et magnis dis parturient.</p>

</main>
```

```css
* {
    box-sizing: border-box;
}

html {
    font-family: sans-serif;
    font-size: 22px;
    scroll-behavior: smooth;
    scroll-padding-top: 5rem;
}

body {
    padding: 0;
    margin: 0;
}

header {
    position: sticky;
    top: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background-color: #ccc;
}

header h1 {
    font-size: 1rem;
    margin: 0;
}

#menu-open {
    background: none;
    border: none;
    padding: 0;
    color: inherit;
    font-size: 1.2rem;
}

#menu-links a {
    display: block;
    width: 100%;
    color: inherit;
    text-decoration: none;
    white-space: nowrap;
}

#menu-links {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 12rem;
    right: -12rem;
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 1rem 1.5rem;
    margin: 0;
    padding: 1rem;
    list-style: none;
    background-color: #369;
    color: #fff;
    transition: all 300ms ease-out;
}

#main-menu.show #menu-links {
    right: 0;
}

#main-menu::before {
    content: '';
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    pointer-events: none;
    background-color: #000;
    opacity: 0;
    transition: all 500ms;
}

#main-menu.show::before {
    opacity: 0.8;
}

@media screen and (min-width: 850px) {
    #menu-links {
        position: static;
        width: auto;
        padding: 0;
        flex-direction: row;
        background-color: transparent;
        color: inherit;
        transition: none;
    }

    #menu-open {
        display: none;
    }

    #main-menu.show::before {
        opacity: 0;
    }
}

main {
    padding: 1rem;
    max-width: 60ch;
    margin: 0 auto;
}
```

```js
// Key elements of the nav system
const openButton = document.getElementById('menu-open')
const mainNav    = document.getElementById('main-menu')
const menuList   = document.getElementById('menu-links')
const menuLinks  = menuList.querySelectorAll('a')

// Open the menu
openButton.addEventListener('click', () => {
    mainNav.classList.add('show')
})

// Each link closes the menu
menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        mainNav.classList.remove('show')
    })
})

// Clicking anywhere outside the menu also closes it
document.addEventListener('click', event => {
    if (event.target != menuList && event.target != openButton) {
        mainNav.classList.remove('show')
    }
})
```

</web-playground>


Below is a minimal version - just enough content and styling to see how it works...

## HTML

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Responsive Navigation</title>
    <link rel="stylesheet" href="styles.css">
</head>


<body>
    <header>
        <h1>Responsive Navigation</h1>

        <nav id="main-menu">
            <button id="menu-open">☰</button>

            <div id="menu-links">
                <a href="#">Link</a>
                <a href="#">Link</a>
                <a href="#">Link</a>
            </div>
        </nav>
    </header>

    <main>
        <h1>Hello World!!!</h1>
    </main>

    <script src="nav.js"></script>
</body>

</html>
```

## CSS

```css
* {
    box-sizing: border-box;
}

header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/* Mobile menu button */
#menu-open {
    background: none;           /* Strip off normal button look */
    border: none;
    padding: 0;
    color: inherit;
    font-size: 1.2rem;
}

/* Links in the menu */
#menu-links li {
    width: 100%;                /* full width for bigger click target */
}

#menu-links a {
    display: block;             /* full width for bigger link target */
    color: inherit;
    text-decoration: none;
    white-space: nowrap;
}

/* The list of links */
#menu-links {
    position: fixed;            /* will sit before page and not scroll */
    top: 0;                     /* full height, from top to bottom */
    bottom: 0;

    width: 12rem;               /* presently positioned off right side */
    right: -12rem;

    display: flex;              /* vertical menu */
    flex-direction: column;
    align-items: start;
    gap: 1rem 1.5rem;

    margin: 0;                  /* remove normal list styling */
    padding: 1rem;
    list-style: none;

    background-color: #369;
    color: #fff;

    transition: all 300ms ease-out;
}

/* Slide in from right when shown */
#main-menu.show #menu-links {
    right: 0;
}

/* Create a pseudo-element to shade the page content */
#main-menu::before {
    content: '';

    position: fixed;            /* cover whole of screen */
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;

    pointer-events: none;       /* allow mouse events to pass through */

    background-color: #000;

    opacity: 0;                 /* initially transparent */
    transition: all 500ms;
}

/* Animate the shade's opacity when menu shown */
#main-menu.show::before {
    opacity: 0.8;
}

/* Changes applied for desktop viewing */
@media screen and (min-width: 850px) {

    #menu-links {
        position: static;               /* turns off fixed positioning */
        width: auto;                    /* and the fixed width */
        padding: 0;                     /* and the mobile padding */

        flex-direction: row;            /* switch to horizontal menu */

        background-color: transparent;  /* remove mobile menu styling */
        color: inherit;

        transition: none;               /* no more animations needed */
    }

    #menu-open {
        display: none;                  /* hide the mobile button */
    }

    #main-menu.show::before {
        opacity: 0;                     /* make sure overlay is off */
    }
}
```

*Note that the overlay `#main-menu::before` could be omitted if this feature is not required.*


## JavaScript

```js
/**
 * Add event listeners to toggle the 'show' class on the main
 * nav menu. CSS handles the actual show/hide of the menu.
 */

// Key elements of the nav system
const openButton  = document.getElementById('menu-open');
const mainNav     = document.getElementById('main-menu');
const menuList    = document.getElementById('menu-links');
// The actual links withon the menu
const menuLinks   = menuList.querySelectorAll('a');

// Setup button to open the menu
openButton.addEventListener('click', () => {
    mainNav.classList.add('show');
});

// Setup links in menu to close the menu
menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        mainNav.classList.remove('show');
    });
});

// Clicking anywhere outside of the menu will also close it
document.addEventListener('click', event => {
    // Don't close if we're clicking the open button or menu itself
    if (event.target != menuList && event.target != openButton) {
        mainNav.classList.remove('show');
    }
});

```

