# Main Page Layout View

The **_layout.php** file will setup each page with the common elements needed (meta data, stylesheets, header, nav menu, etc.) then load in the specific content for each route.

Add this code to **_layout.php**...

```php
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title><?= SITE_NAME ?></title>

    <link rel="stylesheet" href="<?= SITE_BASE ?>/css/styles.css">
</head>

<body>
    <header>
        <h1><?= SITE_NAME ?></h1>

        <nav>
            <a href="<?= SITE_BASE ?>">Home</a>
            <a href="<?= SITE_BASE ?>/about">About</a>
            <a href="<?= SITE_BASE ?>/contact">Contact Us</a>
        </nav>
    </header>

    <main>
        <?php
            require VIEWS . $view;
        ?>
    </main>

    <footer>
        <p>&copy; <?= date('Y') ?> <?= SITE_OWNER ?></p>
    </footer>
</body>

</html>
```

!> Note that every **href** URL used in links starts with the **SITE_BASE** (the folder our site sits). This makes sure that the links work correctly, regardless of how deep we are into a route.


## Defining Constants for the Site

To keep the above template flexible and maintainable, we are using **constants** to define data values for the *Site Name* and the *Site Author*.

Define these constants at the *top* of your **index.php** file...

```php
// Site info
define('SITE_NAME', 'Simple Routing');
define('SITE_OWNER', 'Steve Copley');
```

