# Conditional Logic

## Comparison Operators

When comparing two values, use:

- `==` is **equal** to
- `!=` is **not equal** to
- `>` is **greater** than
- `>=` is **greater or equal** to
- `<` is **less** than
- `<=` is **less or equal** to
- `in` is **contained in**
- `!in` is **not contained in**


For example...

```kotlin run
val score = 35000

if (score >= 20000) {
    println("High score!")
}
```

or...

```kotlin run
var answer = "Banana"

while (answer != "Apple") {
    println("$answer is wrong, try again...")
    answer = "Apple"    // simulate a correct guess
}

println("Correct!")
```

or...

```kotlin run
val grade = "C"

if (grade !in "ABCDEF") {
    println("Invalid grade")
} else {
    println("Grade: $grade")
}
```

## Ranges

To create a range of values, the range operators can be used:

- `A..B` give a range from A to B (inclusive of A and B)
- `A..<B` give a range from A *up to* B (but not including B)

For example...

```kotlin run
// Show values 1 to 5
for (i in 1..5) {
    println(i)
}
```

or...

```kotlin run
// Index through a list
val colours = listOf("Red", "Green", "Blue")

for (i in 0..<colours.size) {
    println("$i: ${colours[i]}")
}
```

## Boolean Operators

For logical operations on boolean values:

- `&&` for **AND** (*both* values must be true)
- `||` for **OR** (*at least one* value must be true)
- `!` for **NOT** (*reverses* the value)

AND example...

```kotlin run
val loggedIn = true
val isAdmin  = true

if (loggedIn && isAdmin) {
    println("Welcome, admin!")
}
```

OR example...

```kotlin run
var lives    = 0
val cheatsOn = true

if (lives > 0 || cheatsOn) {
    println("Keep playing!")
} else {
    println("Game over!")
}
```

NOT example...

```kotlin run
val isBlocked = false

if (!isBlocked) {
    println("Access granted.")
}
```

