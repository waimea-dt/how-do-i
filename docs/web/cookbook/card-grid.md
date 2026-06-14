# Card Grid Layout

Responsive card grids are useful for portfolio items, product cards, and note collections.

## HTML

```html
<section class="card-grid">
    <article class="card">
        <h3>HTML</h3>
        <p>Page structure and semantics.</p>
    </article>

    <article class="card">
        <h3>CSS</h3>
        <p>Styling, layout, and responsive design.</p>
    </article>

    <article class="card">
        <h3>JavaScript</h3>
        <p>Interactivity and dynamic UI.</p>
    </article>
</section>
```

## CSS

```css
.card-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
}

@media (min-width: 45rem) {
    .card-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (min-width: 65rem) {
    .card-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

.card {
    background: white;
    border: 1px solid #dbe3ef;
    border-radius: 0.75rem;
    padding: 1rem;
}
```
