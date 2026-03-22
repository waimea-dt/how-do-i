# Functions in Kotlin

A **function** is a named, reusable block of code that performs a specific task.

Instead of writing the same code in multiple places, you write it once as a function and **call** it whenever you need it.

```kotlin
fun greet() {
    println("Hello!")
}
```

To run a function, **call** it by name:

```kotlin run
fun greet() {
    println("Hello!")
}

fun main() {
    greet()
    greet()
    greet()
}
```

> [!NOTE]
> Every Kotlin program starts by running a function called `main()`(kotlin) - this is the **entry point** of your program.


## Why Use Functions?

Functions make your code:

- **Easier to read** - a well-named function says exactly what it does
- **Easier to maintain** - fix a bug once, in one place, rather than in several
- **Reusable** - write once, call many times
- **Easier to test** - small, focused functions are simpler to check

✗ Without functions - repetitive, hard to maintain...

```kotlin
println("=== Receipt ===")
println("Item 1: $4.50")
println("===============")
println()
println("=== Receipt ===")
println("Item 2: $12.00")
println("===============")
println()
println("=== Receipt ===")
println("Item 3: $7.50")
println("===============")
```

✓ With a function - clean, reusable and easy to maintain...

```kotlin run
fun main() {
    printReceipt("Item 1", 4.50)
    printReceipt("Item 2", 12.00)
    printReceipt("Item 3", 7.50)
}

fun printReceipt(item: String, price: Double) {
    println("=== Receipt ===")
    println("$item: $${"%.2f".format(price)}")
    println("===============")
    println()
}
```


## Function Names

Function names follow the same rules as variable names:

- Start with a **lowercase letter**
- Use **camelCase** for multiple words
- Use a **verb** (action word) to describe what the function does

✓ Well-named functions...

```kotlin
fun calculateTax()
fun printReceipt()
fun isValidAge()
fun getUserInput()
```

✗ Badly-named functions...

```kotlin
fun Tax()           // capital letter at start
fun stuff()         // vague - says nothing useful
fun calculate()     // too vague - calculate what?
fun my_function()   // wrong convention for Kotlin
```


## Parameters

**Parameters** let you pass values into a function so it can work with different data each time it is called.

Each parameter has a **name** and a **type**, separated by `:`(kotlin):

```kotlin
fun greet(name: String) {
    println("Hello, $name!")
}
```

Call the function by passing in a value - called an **argument**:

```kotlin run
fun greet(name: String) {
    println("Hello, $name!")
}

fun main() {
    greet("Alice")
    greet("Bob")
    greet("Charlie")
}
```

A function can have **multiple parameters**, separated by commas:

```kotlin run
fun describe(name: String, age: Int, city: String) {
    println("$name is $age years old and lives in $city.")
}

fun main() {
    describe("Alice", 16, "Auckland")
    describe("Bob",   14, "Wellington")
}
```

> [!NOTE]
> The terms **parameter** and **argument** are often used interchangeably. Strictly, a *parameter* is the variable in the function definition, and an *argument* is the actual value passed when calling it.


## Default Parameter Values

Parameters can have **default values** - used when no argument is provided:

```kotlin run
fun greet(name: String, greeting: String = "Hello") {
    println("$greeting, $name!")
}

fun main() {
    greet("Alice")               // uses default greeting
    greet("Bob", "Good morning") // uses custom greeting
}
```


## Named Arguments

When calling a function, you can name each argument - this lets you pass them in **any order** and skip parameters that have defaults:

```kotlin run
fun greet(name: String, greeting: String = "Hello", end: String = "!") {
    println("$greeting, $name$end")
}

fun main() {
    greet("Alice")                               // all defaults
    greet("Bob", "Good morning")                 // positional
    greet("Carol", end = ".")                    // skip greeting
    greet(end="?", greeting="Hey", name="Dave")  // any order
}
```

> [!TIP]
> Named arguments are most useful when a function has **multiple parameters with default values** - you can supply just the ones you need, in any order, without having to know their position.


## Return Values

A function can **return** a value back to the caller using the `return`(kotlin) keyword.

Declare the return type after the parameter list using `: Type`(kotlin):

```kotlin
fun add(a: Int, b: Int): Int {
    return a + b
}
```

The returned value can be stored in a variable or used directly:

```kotlin run
fun add(a: Int, b: Int): Int {
    return a + b
}

fun main() {
    // Assign return value to variable
    val result = add(10, 25)
    println("10 + 25 = $result")

    // or... Use return value directly
    println("10 + 25 = ${add(10, 25)}")
}
```

A more realistic example - calculating total price with tax:

```kotlin run
fun totalWithTax(price: Double, taxRate: Double): Double {
    return price + (price * taxRate)
}

fun main() {
    val total = totalWithTax(49.99, 0.15)
    println("Total: $${"%.2f".format(total)}")
}
```

> [!TIP]
> If a function doesn't return a value, you can either leave out the return type entirely, or write `: Unit`(kotlin). Most Kotlin developers simply leave it out.


## Single-Expression Functions

If a function body is just a single expression, you can shorten it using `=`(kotlin):

```kotlin
fun add(a: Int, b: Int): Int = a + b
fun square(n: Int): Int = n * n
```

```kotlin run
fun add(a: Int, b: Int): Int = a + b
fun square(n: Int): Int = n * n

fun main() {
    println(add(3, 4))
    println(square(5))
}
```


## Putting It Together

Here is a simple example combining everything - a function that validates and processes user input:

```kotlin run
fun isValidScore(score: Int): Boolean {
    return score in 0..100
}

fun grade(score: Int): String {
    return when {
        score >= 90 -> "Excellence"
        score >= 75 -> "Merit"
        score >= 60 -> "Achieved"
        else        -> "Not Achieved"
    }
}

fun main() {
    val scores = listOf(95, 74, 60, 45, 110, 13, 67)

    for (score in scores) {
        if (isValidScore(score)) {
            println("Score $score → ${grade(score)}")
        } else {
            println("Score $score → Invalid")
        }
    }
}
```
