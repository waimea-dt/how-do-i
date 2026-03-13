# Conditional Logic

## Comparison Operators

When comparing two values, use:

- `==` is **equal** to
- `!=` is **not equal** to
- `>` is **greater**
- `>=` is **greater or equal** to
- `<` is **less** than
- `<=` is **less or equal** to
- `in` is **contained in**
- `!in` is **not contained in**


For example...

```kotlin
if (score >= 20000) {
    // do something
}
```

or...

```kotlin
while (answer != "Apple") {
    // do something
}
```

or...

```kotlin
if (grade !in "ABCDEF") {
    // do something
}
```

## Ranges

To create a range of values, the range operators can be used:

- `A..B` give a range from A to B (inclusive of A and B)
- `A..<B` give a range from A *up to* B (but not including B)

For example...

```kotlin
// Show values 1 to 10
for (i in 1..10) {
    println(i)
}
```

or...

```kotlin
// Index through all values in a list, using index
for (i in 0..<list.size) {
    println(list[i])
}
```

## Boolean Operators

For logical operations on boolean values:

- `&&` for **AND** (*both* values must be true)
- `||` for **OR** (*at least one* value must be true)
- `!` for **NOT** (*reverses* the value)

AND example...

```kotlin
// Is the user logged in AND an admin?
if (loggedIn && isAdmin) {
    // do something
}
```

OR example...

```kotlin
// Keep playing if alive OR have cheats enabled
while (lives > 0 || cheatsOn) {
    // doSomething
}
```

NOT example...

```kotlin
// Check if user is an admin
if (!isAdmin) {
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



