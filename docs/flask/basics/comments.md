# Commenting Your PHP Code

PHP has two ways to add comments to your code:

- Inline comments - Used to add a note to a specific line of code
- Block comments - Used to add more detailled notes to a large block of code

## Inline Comments //

Inline comments begin with a **double-slash**, `//`

The PHP engine will ignore everything after this, until the end of the line

```php
// This is an inline comment

$name = 'Steve';  // This is also an inline comment
// $school = 'Waimea College';
```

?> Note the final line - a comment has been used to **disable a line of code**.  We call this *commenting out* the code and is useful when you want to temporarily remove some code, but not actually delete it.

!> In VS Code, <kbd>Ctrl</kbd> + <kbd>/</kbd> will toggle on/off a comment for the current line


## Block Comments /* ... */

Block comments begin with a **slash star**, `/*`, and end with **star slash**, `*/`

The PHP engine will ignore everything between these markers, even if they are on different lines

```php
/* This is a block comment */
$name = 'Steve';

/* This is a much longer block comment that
   spans multiple lines. All of this text is
   ignored by the PHP engine */
echo 'Hello world!';
echo 'This is PHP';
showUser($name);

/**
 * This style of block comment is usually used
 * to document a block of code like afunction
 * or a class definition
 *
 * @param string $name - The user's name
 *
 * @return nothing
 */
function showUser($name) {
    echo 'User: ' . $name;
}
```

!> Note the **slash star star**, `/**`, start of the last block comment. This is clalled a **DocBlock** comment (see [here][docblock] for more info.) and should be used before every function, class, etc.


[docblock]: https://docs.phpdoc.org/guide/getting-started/what-is-a-docblock.html
