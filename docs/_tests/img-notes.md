# Image Notes

Image notes let you mark parts of an image with percentage-based boxes. Hover or click a highlighted area to show the matching note.

<img src="_tests/_assets/ui-demo.png" alt="UI shop demo screen">

## Example

<img-notes>

<img src="_tests/_assets/ui-demo.png" alt="UI shop demo screen">

- Brand area [1.5, 1, 10, 5]

    The **brand block** anchors the page quickly.

    - Simple logo mark
    - Short product brand name
    - Strong top-left placement

- Product title and summary [57, 12, 33, 20]

    This section carries the main sales message.

    - Small category label first
    - Large product name next
    - Short supporting text after that

- Size selector [57, 41, 21, 18]

    Good example of a compact control group.

    - One active option
    - Plenty of whitespace
    - Easy scan across rows

- Colour choices [57, 60, 16, 11]

    Colour is shown with **plain swatches** instead of text-heavy controls.

- Add to cart CTA [57, 74, 25, 9]

    This is the main action, so it gets the strongest contrast.

    - Wide button
    - Dark fill
    - Clear icon + label

- Floating model toggle [42, 74, 6, 9]

    Small secondary action sitting over the image. Nice for a quick *3D / preview* affordance.

</img-notes>


## With Numbered Regions

<img-notes colour="5">

<img src="_tests/_assets/ui-demo.png" alt="UI shop demo screen">

1. Brand area [1.5, 1, 10, 5]

    The **brand block** anchors the page quickly.

    - Simple logo mark
    - Short product brand name
    - Strong top-left placement

2. Product title and summary [57, 12, 33, 20]

    This section carries the main sales message.

    - Small category label first
    - Large product name next
    - Short supporting text after that

3. Size selector [57, 41, 21, 18]

    Good example of a compact control group.

    - One active option
    - Plenty of whitespace
    - Easy scan across rows

4. Colour choices [57, 60, 16, 11]

    Colour is shown with **plain swatches** instead of text-heavy controls.

5. Add to cart CTA [57, 74, 25, 9]

    This is the main action, so it gets the strongest contrast.

    - Wide button
    - Dark fill
    - Clear icon + label

6. Floating model toggle [42, 74, 6, 9]

    Small secondary action sitting over the image. Nice for a quick *3D / preview* affordance.

</img-notes>


## Mixed Regions

<img-notes colour="8">

<img src="_tests/_assets/ui-demo.png" alt="UI shop demo screen">

1. Brand area [1.5, 1, 10, 5]

    The **brand block** anchors the page quickly.

    - Simple logo mark
    - Short product brand name
    - Strong top-left placement

2. Product title and summary [57, 12, 33, 20]

    This section carries the main sales message.

    - Small category label first
    - Large product name next
    - Short supporting text after that

3. Size selector [57, 41, 21, 18]

    Good example of a compact control group.

    - One active option
    - Plenty of whitespace
    - Easy scan across rows

- Colour choices [57, 60, 16, 11]

    Colour is shown with **plain swatches** instead of text-heavy controls.

- Add to cart CTA [57, 74, 25, 9]

    This is the main action, so it gets the strongest contrast.

    - Wide button
    - Dark fill
    - Clear icon + label

- Floating model toggle [42, 74, 6, 9]

    Small secondary action sitting over the image. Nice for a quick *3D / preview* affordance.

</img-notes>


## Syntax

```html
<img-notes colour="8">

<img src="file.png" alt="Description">

- Note Title [x, y, w, h]

    Text for the note plus other MD.

    - Item 1
    - Item 2

1. Numbered Note [58, 76, 24, 11]

    OL items show numbered labels; UL items do not.

</img-notes>
```

## Notes

- Coordinates are percentages, so the boxes scale with the image.
- `x` and `y` are the top-left corner.
- `w` and `h` are width and height.
- Place the image as an `<img>` tag inside the block - it renders fine in plain markdown too.
- `colour="1"` through `colour="10"` sets the hotspot/label colour using palette variables.
- OL items show numbered labels on hotspots; UL items show no labels.
- Bodies support paragraphs, headings, lists, links, emphasis, and fenced code blocks.