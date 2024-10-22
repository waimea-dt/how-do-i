# Data Types and Variables in PHP

## Variables

Variables in PHP always begin with a **dollar** sign, `$`.

Variable names should generally:

- **Start with a letter**
- Be **lowercase**
- Use either *camelCase* or *snake_case* for **multiple words** (but be consistent and stick to one style!)

For example:

```php
$name = 'Steve';
$age = 10
$birthPlace = 'London';
$likes_cats = true;
```

## Data Types

PHP has a full range of data types:

- **Integer**, e.g. `10`, `-5`, `1000`
- **Float**, e.g. `7.25`, `0.01`, `-27.99`
- **String**, e.g. `'Steve'`, `'Waimea College'`
- **Boolean**, e.g. `true`, `false`

!> Note that strings (text) are usually surrounded by **single speech marks**, `'...'`, but can also use **double speech marks**, `"..."`. Try to stick to single speech marks where possible, because you often want to include double speech marks as part of the text, e.g. for HTML tags


## Checking if a Variable Exists

You can use the `isset(...)` function to determine if a varaible exists *and* is not null...

```php
// Check if username has been setup
if (isset($username)) {
    // do somthing with user
}
```

You can also use the `empty(...)` function to see if a variable doesn't exist *or* it has nothing in it (e.g. an empty string, or an empty array)...

```php
// Check if the array has something in it
if (!empty($array)) {
    // do something with the array
}
```
