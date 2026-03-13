# PHP Code Blocks

PHP files with a **.php** file extension can contain **both HTML and PHP code**. In fact, unless you specify that you are writing PHP, it is assumed that the code is plain HTML.

Here is an example of how not to add PHP. This code will *not work* as intended since we have added PHP code without using the correct tag...

```html
<h1>PHP and HTML Example</h1>

<p>This is just plain HTML code</p>

// Here is some PHP code - This will NOT work!
$name = 'Steve';
$school = 'Waimea College';
echo 'Hello, ' . $name . ' from ' . $school;

<p>And now we are back to HTML again!</p>
```

## PHP Code Block Tags

To define a section of PHP code, we must place it within a PHP tag: `<?php ... ?>`

So, to correct the above example...

```php
<h1>PHP and HTML Example</h1>

<p>This is just plain HTML code</p>

<?php
    // Here is some PHP code, correctly inside a PHP tag
    $name = 'Steve';
    $school = 'Waimea College';
    echo 'Hello, ' . $name . ' from ' . $school;
?>

<p>And now we are back to HTML again!</p>
```
