# Accessibility Screen Reader Simulation

Use this plugin to compare visual similarity with accessibility quality.

## Good Semantic Structure

<accessibility mode="screen-reader">

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
    <h2>Welcome</h2>
    <p>Access your timetable and check upcoming assignments</p>

    <form>
        <h3>Lookup Your Details</h3>
        <label for="student-id">Student ID</label>
        <input id="student-id" type="text" placeholder="e.g. S12345">
        <input type="submit" value="Lookup">
    </form>

    <nav area-label="Quick actions">
        <h3>Quick Actions</h3>
        <button type="button">Open Timetable</button>
        <a href="#assignments">View Assignment List</a>
    </nav>

    <img src="_assets/macs/macintosh-happy.svg" alt="Smiling computer">
</main>
```

</accessibility>

## Weak Semantic Structure

<accessibility mode="screen-reader">

```html
<div class="header">
    <div class="big-title">Riverside Art College</div>

    <nav class="menu">
        <a href="#home">Click here</a>
        <a href="#courses">More</a>
        <a href="#support">Link</a>
    </nav>
</div>

<div class="content">
    <h3 class="title">Welcome</h3>
    <p>Access your timetable and check upcoming assignments</p>

    <form>
        <div class="small-title">Lookup Your Details</div>
        <span>Student ID</span><input type="text">
        <input type="submit">
    </form>

    <nav>
        <h1 class="small-title">Actions</h1>
        <button type="button">Click</button> for timetable
        <a href="#assignments">Click Here</a> for assignments
    </nav>

    <img src="_assets/macs/macintosh-happy.svg">
</div>
```

</accessibility>


## Themes

<accessibility mode="screen-reader" theme="red" audit="false" header="false">

```html
<div class="header">
    <div class="big-title">Riverside Art College</div>

    <nav class="menu">
        <a href="#home">Click here</a>
        <a href="#courses">More</a>
        <a href="#support">Link</a>
    </nav>
</div>

<div class="content">
    <h3 class="title">Welcome</h3>
    <p>Access your timetable and check upcoming assignments</p>

    <form>
        <div class="small-title">Lookup Your Details</div>
        <span>Student ID</span><input type="text">
        <input type="submit" value="Submit">
    </form>

    <nav>
        <h1 class="small-title">Actions</h1>
        <button type="button">Open Timetable</button>
        <a href="#assignments">Click Here</a>
    </nav>

    <img src="_assets/macs/macintosh-happy.svg">
</div>
```

</accessibility>



<accessibility mode="screen-reader" theme="lowcontrast" audit="false" header="false">

```html
<div class="header">
    <div class="big-title">Riverside Art College</div>

    <nav class="menu">
        <a href="#home">Click here</a>
        <a href="#courses">More</a>
        <a href="#support">Link</a>
    </nav>
</div>

<div class="content">
    <h3 class="title">Welcome</h3>
    <p>Access your timetable and check upcoming assignments</p>

    <form>
        <div class="small-title">Lookup Your Details</div>
        <span>Student ID</span><input type="text">
        <input type="submit" value="Submit">
    </form>

    <nav>
        <h1 class="small-title">Actions</h1>
        <button type="button">Open Timetable</button>
        <a href="#assignments">Click Here</a>
    </nav>

    <img src="_assets/macs/macintosh-happy.svg">
</div>
```

</accessibility>


## Low Vision Mode

<accessibility mode="low-vision" header="true" theme="blue">

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
    <h2>Welcome</h2>
    <p>Access your timetable and check upcoming assignments</p>

    <section>
        <h3>Quick Actions</h3>
        <button type="button">Open Timetable</button>
        <a href="#assignments">View Assignment List</a>
    </section>

    <img src="_assets/macs/macintosh-happy.svg" alt="Smiling computer">
</main>
```

</accessibility>


## Colour Blind Mode

<accessibility mode="colour-blind" header="true" theme="colourful1">

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


---

<accessibility mode="colour-blind" header="true" theme="colourful2">

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

---

<accessibility mode="colour-blind" header="false" theme="blue">

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


</accessibility>


## Contrast Audit Mode

<accessibility mode="contrast" header="true" theme="lowcontrast">

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


<accessibility mode="contrast" header="true" theme="colourful1">

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


<accessibility mode="contrast" header="true" theme="colourful2">

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


### Contrast With Semi-Transparent Layers

<accessibility mode="contrast" header="true" theme="blue">

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


## Motor Impairment Mode

<accessibility mode="motor-impairment" header="true" theme="blue">

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
    <h2>Student Dashboard</h2>
    <p>Use larger controls below to navigate common tasks.</p>

    <section>
        <h3>Quick Actions</h3>
        <button type="button">Open Timetable</button>
        <button type="button">Submit Assignment</button>
        <a href="#support">Contact Support</a>
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
