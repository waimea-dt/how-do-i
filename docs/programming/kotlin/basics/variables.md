# Variables and Data Types in Kotlin

## Variable Declaration

Variables in Kotlin are declared using either:
- `val`(kotlin) for immutable **val**ues which can't be altered
- `var`(kotlin) for mutable **var**iables which can be changed

```kotlin
val name: String     // Value is fixed (immutable)
var score: Int       // Variable can change (mutable)
```

## Assigning Values to Variables

To **assign** a value to a variable, use `=`:

```kotlin
val name  = "Jimmy"
var age   = 25
var happy = true
var score = 1000
```

## Variable Types

If you are assigning a value at the same time as declaring a variable, you don't need to specify the variable type, Kotlin will infer it. But, if you are just declaring the variable, you must specify the type using `: Type`(kotlin)

```kotlin
val name: String               // String type specified
var age: Int                   // Int type specified
val birthPlace = "London"      // String type is inferred
var likesCats = true           // Boolean type is inferred
```

The most common types you will be using:
- `String`(kotlin) - for text
- `Char`(kotlin) - for single characters
- `Int`(kotlin) - for integer, whole numbers
- `Long`(kotlin) - for very large whole numbers
- `Double`(kotlin) - for decimal numbers
- `Boolean`(kotlin) - for true/false values

```kotlin
val name: String = "Steve"
val initial: Char = 'S'
var year: Int = 2026
val kmToNeptune: Long = 4500000000L
var cost: Double = 123.45
var isAlive: Boolean = true
```

> [!NOTE]
> In Kotlin, **Strings** are wrapped with **double speech marks**: `"Hello"`(kotlin), while **Chars** are wrapped with **single speech marks**: `'Z'`(kotlin)


## Naming Variables

Variable names should:

- Start with a **lowercase letter**
- Use **camelCase** when using **multiple words** (this is the convention for Kotlin)

✓ Well-named variables...

```kotlin
val firstName = "Steve"
var yearsOld = 10
val birthPlace = "London"
var likesCats = true
```

✗ Badly-named variables...

```kotlin
val firstname = "Steve"      // Hard to read multiple words
var YearsOld = 10            // Capital letter at start
val birth_place = "London"   // Incorrect convention
var likes cats = true        // Can't have spaces
```

> [!NOTE]
> Kotlin variables **cannot hold `null`(kotlin) by default** - this is one of Kotlin's key safety features. You will learn more about this in the [Error Handling](programming/kotlin/advanced/errors.md) page.


## Variable Scope

**Scope** determines where in your code a variable can be accessed.

A variable only exists inside the **block** it was declared in - a block is any section of code wrapped in `{ }`(kotlin).

### Local Variables

A variable declared inside a function, loop, or `if`(kotlin) block is **local** to that block. It cannot be accessed outside it:

```kotlin run
fun greet() {
    val message = "Hello!"   // local to greet()
    println(message)
}

greet()
// println(message)   // ✗ Error - 'message' doesn't exist here
```

```kotlin run
for (i in 1..3) {
    val squared = i * i      // local to the loop body
    println("$i² = $squared")
}

println(squared)   // ✗ Error - 'squared' doesn't exist here
```

### Nested Scope

Code inside an inner block **can** see variables from the outer block - but not the other way around:

```kotlin run
fun main() {
    val player = "Alice"           // outer block

    if (true) {
        val bonus = 500            // inner block
        println("$player gets $bonus points!")   // ✓ can see player
    }

    println(bonus)   // ✗ Error - 'bonus' only exists in the if block
}
```

### Top-Level (Global) Variables

Variables declared **outside any function** are called 'top-level' or 'global' variables - they can be accessed from anywhere in the file:

```kotlin run
val maxScore = 100     // top-level - visible everywhere

fun showScore(score: Int) {
    println("Score: $score / $maxScore")   // ✓ can see maxScore
}

showScore(72)
```

> [!TIP]
> Keep variables as **local as possible** - declare them in the smallest block where they are needed. This prevents accidental changes from unrelated parts of your code.


