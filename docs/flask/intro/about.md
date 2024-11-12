# What is <dfn title="HyperText Markup Language">HTML</dfn>?

Yo! Look at this: :mi-outlined|check_circle:

<!-- tabs:start -->

### **English**

#### Hello!

```html
<body>
    <h1>Awesome System</h1>
    <p>The best system for doing things</p>
</body>
```

### **French**

#### Bonjour!

```html
<body>
    <h1>Awesome System</h1>
    <p>The best system for doing things</p>
</body>
```

### **Italian**

#### Ciao!

```html
<body>
    <h1>Awesome System</h1>
    <p>The best system for doing things</p>
</body>
```
<!-- tabs:end -->

PHP is a **server-side scripting language**, which means that it is used for running code on a web server that can change the web pages that are served up.

<!-- tabs:start -->

### **English**

#### Yup!


### **French**

#### Oui!


### **Italian**

#### Si!

<!-- tabs:end -->


**PHP** stands for **P**HP: **H**ypertext **P**reprocessor (yes, it's a nerdy self-referencing, recursive name!)


<!-- panels:start -->

<!-- div:title-panel -->

## This is a Panels Test

<!-- div:left-panel -->

Still, the underlying point held; experience as well as common sense indicated that the most reliable method of avoiding self-extinction was not to equip oneself with the means to accomplish it in the first place. I will allow my fear to pass through me and around me and when it is gone, I will turn and look, and only myself will remain. The difference between stupid and intelligent people - and this is true whether or not they are well-educated - is that intelligent people can handle subtlety. As nightmarishly lethal, memetically programmed death-machines went, these were the nicest you could ever hope to meet. But the human race did not have even the slightest bit of psychological preparation for what was about to happen.

<!-- div:right-panel -->

### Example

```php
echo '<h2>Hello ' . $forename . '!</h2>';
echo '<p>Today is ' . date('d/m/Y');

include 'main-menu.php';
```
<!-- panels:end -->


You can find out more about the language at the official docs [here][php].

Or watch a 100 second overview video [here][php100s]


## What Does PHP Look Like?

PHP code can be combined with HTML to alter / generate the HTML in some way...

```php
<body>
    <h1>Awesome System</h1>
    <p>The best system for doing things</p>

    <?php
        // This is a PHP block

        echo '<h2>Hello ' . $forename . '!</h2>';
        echo '<p>Today is ' . date('d/m/Y');

        include 'main-menu.php';
    ?>

</body>
```

In this example, the PHP block sits within a normal HTML page. You will see a lot of this - mixing HTML and PHP. Try using `<h1>Hello!</h1>`


## Learn PHP

Some resources to help you learn PHP:

- [PHP for Beginners](https://www.youtube.com/watch?v=BUCiSSyIGGU) - Three-hour crash course video
- [PHP Tutorial](https://www.w3schools.com/php/default.asp) - W3 Schools PHP course

## PHP References

This id the official language reference:

- [PHP Language Reference](https://www.php.net/manual/en/langref.php)



[php]: https://www.php.net/manual/en/getting-started.php
[php100s]: https://www.youtube.com/watch?v=a7_WFUlFS94

