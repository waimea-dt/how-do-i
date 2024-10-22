# Looping / Iteration in PHP

## While Loops

A `while (...)` loop will keep looping as long as a given contion remains true.

```php
while (condition is true) {
    // do something
}
```

The condition can be any bit of code that equates to a boolean true / false value...

### Infinite Loop

This loop will never stop since the condition is (literally!) always true:

```php
// Loop forever
while (true) {
    // do someting
}
```

### Loop with a counter

This will loop 100 times, since the counter variable, `$i`, is incremented by 1 every time the loop loops:

```php
// Setup loop counter
$i = 0;
// Loop until counter hits 100
while ($i < 100) {
    // do something
    $i++;
}
```

### Loop Until Dead

This will keep looping until the `$alive` variable changes to false (e.g. because the player is killed):

```php
// Start off alive
$alive = true;
// Keep looping until dead
while ($alive) {
    // do something
    // $alive will get set to false when player dies
}
// At this point, the player has died
```


## For Loops

A `for (...)` loop is a shorthand way of creating a loop with a counter variable.

It hase three parts to it:

1. The creation and initialisation of the loop variable
2. The condition that must be true for the loop to continue
3. The update code that us run every time the loop loops


### Typical Loop

This is a pretty typical for loop, with a counter variable called `$i` (but it could be called anything):

```php
// Loop 100 times
for ($i = 0; $i < 100; $i++) {
    // do something
}
```

### Indexing Through an Array

For loops are often used to work through every element of an [array](php/basics/arrays.md) using the loop variable to index the array:

```php
// An array of things, with length/count of 4 and indicies: 0, 1, 2, 3
$things = ['Apple', 'Banana', 'Cat', 'Dog'];

// Loop through the array
for ($i = 0; $i < count($things); $i++) {
    // do something with $things[$i], for example...
    echo $things[$i];
}
```

### Counting Backwards

This loop counts down from 10 to 0:

```php
// Countdown loop
for ($count = 10; $count >= 0; $count--) {
    // do something
}
```


## ForEach Loop

A `foreach (...)` loop is typically used to work through an [array](php/basics/arrays.md), one element at a time.

It works by setting a variable to the value of each element of the array in turn, until no more elements are left...

### Working Through Array Values

In a typical, indexed array, you could work through every value:

```php
// An array of people
$people = [
    'Adam',
    'Barbara',
    'Clive',
    'Danni'
];

// Loop through the array
foreach ($people as $person) {
    // do something with $person, for example...
    echo $person;
}
```


### Working Through Key / Value Pairs in an Associative Array

In an associative array (sometimes called a 'dictionary'), made up of key / value pairs, you could work through every key and value:

```php
// An array of settings
$settings = [
    'mode' => 'dark',
    'sound' => true,
    'fullscreen' => false
];

// Loop through the array
foreach ($settings as $setting => $value) {
    // do something with $setting and $value, for example...
    echo $setting . ' is set to ' . $value;
}
```




