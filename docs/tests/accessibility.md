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


## No Audit Header

<accessibility mode="screen-reader" audit="false" header="false">

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
        <button type="button">Open Timetable</button>
        <a href="#assignments">Click Here</a>
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
        <input type="submit">
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



<accessibility mode="screen-reader" theme="lowcontrast" audit="true" header="false">

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

<accessibility mode="colour-blind" header="true" theme="red">

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

    <img src="_assets/macs/macintosh-happy.svg" alt="Smiling computer">
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
        <label for="course-search">Course name</label>
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
