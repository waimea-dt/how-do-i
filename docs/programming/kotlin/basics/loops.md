# Looping / Iteration in Kotlin

Loops allow you to **repeat a block of code** multiple times, either a set number of times or until a condition is no longer true.

## For Loop

A `for` loop repeats once **for each value in a range or collection**:

```kotlin
for (variable in range) {
    // code to repeat
}
```

Looping over a **range of numbers**...

```kotlin run
for (i in 1..5) {
    println("Count: $i")
}
```

Looping over a **list**...

```kotlin run
val fruits = listOf("Apple", "Banana", "Cherry")

for (fruit in fruits) {
    println(fruit)
}
```

?> See the **Numbers** page for more on ranges using `..` and `..<`


## While Loop

A `while` loop repeats **as long as a condition is true**. The condition is checked **before** each iteration:

```kotlin
while (condition) {
    // code to repeat
}
```

For example...

```kotlin run
var lives = 3

while (lives > 0) {
    println("Lives remaining: $lives")
    lives--
}

println("Game over!")
```

?> Make sure the loop has a way to eventually make the condition `false`, otherwise you will create an **infinite loop**


## Do...While Loop

A `do...while` loop is similar to `while`, but the condition is checked **after** each iteration - so the body always runs **at least once**:

```kotlin
do {
    // code to repeat
} while (condition)
```

For example...

```kotlin run
var attempts = 0

do {
    attempts++
    println("Attempt $attempts")
} while (attempts < 3)
```


## Break and Continue

Two keywords let you control the flow inside a loop:

- `break` - **exits** the loop immediately
- `continue` - **skips** the rest of the current iteration and jumps to the next one

Example of **break** - stop as soon as a target is found...

```kotlin run
val numbers = listOf(4, 7, 2, 9, 1, 6)

for (n in numbers) {
    if (n == 9) {
        println("Found 9, stopping!")
        break
    }
    println("Checked: $n")
}
```

Example of **continue** - skip odd numbers...

```kotlin run
for (i in 1..10) {
    if (i % 2 != 0) continue
    println("Even: $i")
}
```


## Repeat

For a simple fixed number of repetitions, `repeat` is a concise alternative to `for`:

```kotlin
repeat(n) {
    // code to repeat
}
```

For example...

```kotlin run
repeat(5) {
    println("Hello!")
}
```

?> Inside a `repeat` block, the current iteration index (starting from `0`) is available as `it`: `repeat(5) { println(it) }`
