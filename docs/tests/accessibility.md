# Accessibility Screen Reader Simulation

Use this plugin to compare visual similarity with accessibility quality.

## Good Semantic Structure

<accessibility mode="screen-reader">

```html
<header>
    <h1>Lakeview College</h1>
    <nav aria-label="Main navigation">
        <a href="#home">Home</a>
        <a href="#courses">Courses</a>
        <a href="#support">Support</a>
    </nav>
</header>

<main>
    <h2>Welcome</h2>
    <p>Choose your next class and check your assignments.</p>

    <form>
        <label for="student-id">Student ID</label>
        <input id="student-id" type="text" placeholder="e.g. S12345">
        <input type="submit" value="Lookup Details">
    </form>

    <nav area-label="Quick actions">
        <button type="button">Open timetable</button>
        <a href="#assignments">View assignment list</a>
    </nav>

    <img src="_assets/macs/macintosh-happy.svg" alt="Smiling classic Macintosh icon">
</main>
```

</accessibility>

## Weak Semantic Structure

<accessibility mode="screen-reader">

```html
<div class="header">
    <div class="big-title">Lakeview College</div>

    <div class="menu">
        <a href="#home">Click here</a>
        <a href="#courses">More</a>
        <a href="#support">Link</a>
    </div>
</div>

<div class="content">
    <div class="title">Welcome</div>
    <p>Choose your next class and check your assignments.</p>

    <form>
        <input type="text" placeholder="Type something">
        <input type="submit">
    </form>

    <div>
        <button type="button">Open t/t</button>
        <a href="#assignments">List Here</a>
    </div>

    <img src="_assets/macs/macintosh-happy.svg">
</div>
```

</accessibility>

## Syntax

````html
<accessibility mode="screen-reader">

```html
<header>
    <h1>Site title</h1>
</header>
<main>
    ...
</main>
```

</accessibility>
````
