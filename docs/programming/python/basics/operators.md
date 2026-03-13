# PHP Operators

## Assignment Operator

To assign a value to a variable, use `=`:

```php
$name  = 'Jimmy';
$age   = 25;
$happy = true;
$score = $score + 100;
```


## Arithmetic Operators

For mathematical operations:

- `+` for **addition**
- `-` for **subtraction**
- `*` for **multiplication**
- `/` for **division**
- `%` for **modulus** (remainder of a division)
- `**` for **exponent** (power of)
- `++` to **increment** by one
- `--` to **decrement** by one

For example...

```php
// Pay calculations
$pay   = 90000;
$bonus = 2000;
$total = $pay + $bonus;
$tax   = $total * 0.40;
$takeHome = $total - $tax;
$payRate  = $pay / $hoursWorked;

// Determining the player index: 0, 1, 0, 1, 0, etc.
$player = $turnCount % 2;

// Find the area of the circle
$circleArea = pi() * $radius ** 2;

// Move on to the next item
$index++;
```

### Combining with Assignment Operator

If a variable is being modified like this...

```php
$score = $score + 100;
$lives = $lives - 1;
```

... then there is a shortened form:

```php
$score += 100;
$lives -= 1;
```


## String Concatenation Operator

Strings can be combined using the **concatenation** operator, `.`...

```php
$fullName = $forename . ' ' . $surname;
```

There is also a short form if a string is being modified:

```php
$message = 'Hello, there!';
$message .= 'You are awesome!';
```


## Comparison Operators

When comparing two values, use:

- `==` is **equal** to
- `!=` or `<>` is **not equal** to
- `>` is **greater**
- `>=` is **greater or equal** to
- `<` is **less** than
- `<=` is **less or equal** to


For example...

```php
if ($score >= 20000) {
    // do something
}
```

or...

```php
while ($answer != 'Apple') {
    // do something
}
```


## Boolean Operators

For logical operations on boolean values:

- `&&` or `and` for **AND** (both values must be true)
- `||` or `or` for **OR** (at least one value must be true)
- `!` for **NOT** (reverses the value)

AND example...

```php
// Is the user logged in AND an admin?
if ($loggedIn && $isAdmin) {
    // do something
}
```

OR example...

```php
// Keep playing if alive OR have cheats enabled
while ($lives > 0 or $cheatOn) {
    // doSomething
}
```

NOT example...

```php
// Check if user has inputted someting
if (!empty($input)) {
    // doSomething
}
```


## Conditional Assignment Operators

These are syntactic shortcuts that can be used to check a logical condition, and then to select one of two values (much shorter to write that using `if ... else`)...

### Ternary Operator, `?:`

Checks a condition and select one value if the condition is true, or another value if false:

```php
$displayName = $loggedIn ? $username : 'Guest';
```

This will set the display name to:
- the username if `$loggedIn` is true
- the string 'Guest' if `$loggedIn` is false


### Null Coalescing Operator, `??`

Selects a value if it exists and is not null, otherwise selects an alternative value:

```php
$username = $_GET['user'] ?? 'Guest';
```

This will set the username to:
- the value from the `$_GET` array if it exists and is not null
- otherwise the string 'Guest'



