# CSS Reset

This can be used to remove all default styling from a page to provide a clean start to your own CSS styling.

```css
/*------------------------------------------------------------
  Basic CSS Reset to give us a clean starting point
  Referencing:
    - https://github.com/jgthms/minireset.css
    - https://www.joshwcomeau.com/css/custom-css-reset/
    - https://github.com/sindresorhus/modern-normalize
------------------------------------------------------------*/

/* Size blocks logically */
html {
    box-sizing: border-box;
}

*, *::before, *::after {
    box-sizing: inherit;
}

/* Force full-height body */
html, body {
    min-height: 100vh;
}

/* Set a base font and text size. All other text defined in REMs */
html {
    font-family: system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    font-size:   16px;
    line-height: 1.5;
}

code, kbd, samp, pre {
	font-family: ui-monospace, SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace;
	font-size:   1em;
}

/* Clear gaps between and within blocks */
* {
    margin:  0;
    padding: 0;
}

/* A zero min-size on blocks prevents unexpectd overflows */
* {
    min-width: 0;
}

/* Default links to have same colour as text */
a {
    color: inherit;
}

/* Clear default list styling */
ol, ul {
    list-style: none;
}

/* Remove bold from heading and keep lines tight */
h1, h2, h3, h4, h5, h6 {
    font-weight: normal;
    line-height: 1.1;
}

/* Stop long words breaking out of blocks */
h1, h2, h3, h4, h5, h6, p, li, dl, dt {
    overflow-wrap: break-word;
    hyphens:       auto;
}

/* Make media default to a block and not break out of containers */
img, picture, video, canvas, svg {
    display:   block;
    max-width: 100%;
    height:    auto;
}

/* Remove default spacing on tables */
table {
    border-collapse: collapse;
    border-spacing:  0;
}

/* Remove built-in form typography styles */
input, button, textarea, select, optgroup {
    font: inherit;
    line-height: 1.2;
}
```