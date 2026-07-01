# Colour Palettes

## What is a Colour Scheme?

A **colour scheme** is a carefully chosen set of colours used throughout a design project. Good colour schemes:

- Create visual harmony and balance
- Establish mood and atmosphere
- Improve readability and accessibility
- Connect with a brand's identity
- Guide user attention to important details

### Primary and Accent Colours

Most websites use a simple colour palette:

- **Primary colour**: The main brand colour, used for headers, navigation, and key UI elements
- **Accent colour**: A contrasting colour used sparingly for buttons, links, and important highlights
- **Neutrals**: Black, white, and shades of grey for text and backgrounds
- **Shades**: Lighter and darker variations of the primary colour for depth and variety

The **accent colour** should **contrast** with the primary colour to draw attention. Complementary colours (opposites on the colour wheel) work well.

## Interactive Colour Picker

Try selecting different primary colours to see how the accent colour and shades are automatically generated:

<colours></colours>


## Other Colour Selection Resources

### Colour Tip Videos

Colour Scheme for a Website the Easy Way (short video):

<videoembed id="7PRSqUwAuis"></videoembed>

Give your Site a Fantastic Colour Scheme Fast (longer video)

<videoembed id="mq8LYj6kRyE"></videoembed>

Also, check these out:
- [Graphic Design - Colour](https://www.youtube.com/watch?v=_2LLXnUdUIc)
- [On Colour](https://www.youtube.com/watch?v=DjA0oiMI3ME)
- [How Not to Suck at Colour](https://www.youtube.com/watch?v=C1rQQ_YpgcI)


### Colour Palette Websites

These websites can really help you come up with colour ideas. Realtime Colours in particular is excellent:

- [Realtime Colors](https://www.realtimecolors.com)
- [Adobe Color](https://color.adobe.com/)
- [Coolors.co](https://coolors.co/)


## Tips for Choosing Colours

### Colour Psychology

Different colours evoke different emotions (these can vary from culture to culture, however):

- **Blue**: Trust, professionalism, calmness (popular for corporate sites)
- **Green**: Growth, nature, health (great for environmental or wellness brands)
- **Red**: Energy, urgency, passion (effective for call-to-action buttons)
- **Purple**: Creativity, luxury, wisdom (often used for creative industries)
- **Orange**: Friendliness, enthusiasm, warmth (good for playful brands)
- **Yellow**: Optimism, clarity, happiness (use sparingly for highlights)

### Accessibility Matters

Always ensure sufficient **contrast** between text and background:

- **4.5:1 ratio** minimum for normal text
- **3:1 ratio** minimum for large text
- Test your colours with accessibility checkers (you can find these in browser **developer tools**)

### Common Mistakes to Avoid

- Using too many colours (stick to 2-3 main colours plus neutrals)
- Poor contrast making text hard to read
- Inconsistent use of colours across pages
- Not testing colours on different screens


## Examples of the Impact of Colour Choices

### Poor Contrast

In this example, the colour palette has poor contrast between text and background colours, resulting in poor accessibility for users with vision impairments...

<accessibility mode="contrast" header="false" theme="lowcontrast">

```html
<header>
    <h1>Riverside Art College</h1>
    <nav aria-label="Main navigation">
        <a href="#home">Home</a>
        <a href="#courses">Courses</a>
        <a href="#support">Support</a>
    </nav>
</header>

<main>
    <h2>Course Overview</h2>
    <p>Choose a pathway and check practical tasks for this week.</p>

    <section>
        <h3>Highlights</h3>
        <ul>
            <li><a href="#design">Design Studio</a></li>
            <li><a href="#code">Creative Coding</a></li>
            <li><a href="#media">Digital Media</a></li>
        </ul>
    </section>

    <form>
        <h3>Search Courses</h3>
        <label for="course-search">Name</label>
        <input id="course-search" type="text" placeholder="e.g. Digital Design">
        <button type="submit">Search</button>
    </form>
</main>
```

</accessibility>


### Contrast on the Limit

This site example has some contrast values that are just on the limit of being acceptable  - they might look fine to you, but the contrast checker tools will flag up any issues...

<accessibility mode="contrast" header="false" theme="blue">

```html
<header style="background: rgba(24, 59, 94, 0.75);">
    <h1 style="color: rgba(255, 255, 255, 0.92);">Layered UI Demo</h1>
    <nav aria-label="Main navigation">
        <a href="#home" style="color: rgba(255, 255, 255, 0.88);">Home</a>
        <a href="#courses" style="color: rgba(255, 255, 255, 0.88);">Courses</a>
        <a href="#support" style="color: rgba(255, 255, 255, 0.88);">Support</a>
    </nav>
</header>

<main>
    <section style="background: rgba(255, 255, 255, 0.55);">
        <h2 style="color: rgba(20, 40, 70, 0.85);">Course Overview</h2>
        <p style="color: rgba(17, 17, 17, 0.72);">This paragraph sits on a translucent card so computed contrast depends on blended background colour.</p>
        <p>
            <a href="#design" style="color: rgba(0, 61, 123, 0.75);">Design pathway details</a>
        </p>
    </section>

    <section style="background: rgba(0, 61, 123, 0.28);">
        <h3 style="color: rgba(0, 20, 40, 0.82);">Quick Actions</h3>
        <button type="button" style="background: rgba(0, 61, 123, 0.65); color: rgba(255, 255, 255, 0.9);">Open Timetable</button>
    </section>
</main>
```

</accessibility>


### Excellent Contrast

In this example, the colours have been chosen so that they provide excellent contrast between text and backgrounds...

<accessibility mode="contrast" header="false" theme="blue">

```html
<header>
    <h1>Riverside Art College</h1>
    <nav aria-label="Main navigation">
        <a href="#home">Home</a>
        <a href="#courses">Courses</a>
        <a href="#support">Support</a>
    </nav>
</header>

<main>
    <h2>Course Overview</h2>
    <p>Choose a pathway and check practical tasks for this week.</p>

    <section>
        <h3>Highlights</h3>
        <ul>
            <li><a href="#design">Design Studio</a></li>
            <li><a href="#code">Creative Coding</a></li>
            <li><a href="#media">Digital Media</a></li>
        </ul>
    </section>

    <form>
        <h3>Search Courses</h3>
        <label for="course-search">Name</label>
        <input id="course-search" type="text" placeholder="e.g. Digital Design">
        <button type="submit">Search</button>
    </form>
</main>
```

</accessibility>


### Impact on Users with Colour-Blindness

A small but significant number of your users will have colour-blindness of some sort. Your colour choices can really impact these users - colours that might have good contrast with normal vision can have very low contrast for colour-blind users...

<accessibility mode="colour-blind" header="false" theme="colourful2">

```html
<header>
    <h1>Riverside Art College</h1>
    <nav aria-label="Main navigation">
        <a href="#home">Home</a>
        <a href="#courses">Courses</a>
        <a href="#support">Support</a>
    </nav>
</header>

<main>
    <h2>Course Overview</h2>
    <p>Choose a pathway and check practical tasks for this week.</p>

    <section>
        <h3>Highlights</h3>
        <ul>
            <li><a href="#design">Design Studio</a></li>
            <li><a href="#code">Creative Coding</a></li>
            <li><a href="#media">Digital Media</a></li>
        </ul>
    </section>

    <img src="web/accessibility/_assets/spectrum.png" alt="Spectrum">
</main>
```

</accessibility>

