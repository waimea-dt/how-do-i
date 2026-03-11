# Responsive Navigation

A simple, clean navigation menu with a UI suitable for mobile and for desktop.

Uses a little JS to add click even handlers to various controls / regions of the page, and CSS to style and animate the menu itself. The code for the demo version below can be found in this [GitHub Gist](https://gist.github.com/waimea-cpy/987192184df82874330e3ea37a28dbb1).

<button onclick="startAllCodePens();">
    Load Demo
</button>

<div
    class="codepen"
    data-html="web/_demos/nav/index.html"
    data-css="web/_demos/nav/styles.css"
    data-js="web/_demos/nav/nav.js"
    data-height="40em"
></div>

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

            <ul id="menu-links">
                <li><a href="#">Link</a></li>
                <li><a href="#">Link</a></li>
                <li><a href="#">Link</a></li>
            </ul>
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

