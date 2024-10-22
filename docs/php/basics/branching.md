# Branching / Decisions in PHP

TODO: Finish this page with full explanations


## If Statement

Only do something if a condition is true...

```php
if (condition) {
    // do something
}
```

## If ... Else Statement

Do something if a condition is true, or something else if it is false...

```php
if (condition) {
    // do something
}
else {
    // do something else
}
```

## Multiple If Statement

Do something if a condition is true, something else if another conditions is true, or something else if all conditions are false...

```php
if (condition 1) {
    // do something
}
else if (condition 2) {
    // do something else
}
else {
    // do something else
}
```


## Switch Statement

Compare a variable to a set of values and run different code blocks if it matches, or a final code block if nothing matches...

```php
switch ($variable) {
    case value21:
        // do something
        break;

    case value 2:
        // do something
        break;

    case value 3:
        // do something
        break;

    default:
        // nothing matched
}
```



