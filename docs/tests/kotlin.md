# Kotlin Runner

## Output

```kotlin run
println("Hello, world!")
println()
print("Loading... ")
print("Done!")
```

## String Templates

```kotlin run
val name = "Steve"
val age = 21
println("$name is $age years old")
println("In 10 years: ${age + 10}")
println("Pi: ${"%.2f".format(3.14159)}")
```

## Escape Characters

```kotlin run
println("Name:\tSteve")
println("Line1\nLine2\nLine3")
println("She said \"hello\"")
println("It costs \$200")
```

## Variables and Types

```kotlin run
val name: String  = "Steve"
val initial: Char = 'S'
var year: Int     = 2026
var cost: Double  = 9.99
var isAlive: Boolean = true

println("$name ($initial), born ${year - 21}, cost: \$$cost, alive: $isAlive")
```

## Conditionals

```kotlin run
val score = 75

val grade = when {
    score >= 90 -> "A"
    score >= 70 -> "B"
    score >= 50 -> "C"
    else        -> "Fail"
}

println("Score $score → $grade")
```

```kotlin run
val age = 20
val hasFee = true

if (age >= 18 && hasFee) {
    println("Access granted")
} else if (age >= 18) {
    println("Pay the fee first")
} else {
    println("Too young")
}
```

## Loops

### For Loop

```kotlin run
for (i in 1..5) {
    println("Count: $i")
}
```

### While Loop

```kotlin run
var count = 10
while (count > 0) {
    print("$count ")
    count--
}
println("\nBlast off!")
```

### Looping Over a List

```kotlin run
val fruits = listOf("apple", "banana", "cherry", "mango")

for (fruit in fruits) {
    println("  - $fruit")
}
```

## Functions

```kotlin run
fun greet(name: String, formal: Boolean = false): String {
    return if (formal) "Good day, $name." else "Hey, $name!"
}

println(greet("Alice"))
println(greet("Bob", formal = true))
```

```kotlin run
fun calculateGrade(score: Int): String = when {
    score >= 90 -> "A"
    score >= 70 -> "B"
    score >= 50 -> "C"
    else        -> "Fail"
}

listOf(95, 78, 52, 30).forEach { s ->
    println("$s → ${calculateGrade(s)}")
}
```

## Lists

```kotlin run
val numbers = listOf(4, 7, 2, 19, 5, 1)

val largest = numbers.max()
val sorted  = numbers.sorted()
val total   = numbers.sum()

println("Largest: $largest")
println("Sorted:  $sorted")
println("Sum:     $total")
```

## with fun main()

```kotlin run
fun greetAll(names: List<String>) {
    names.forEach { println("Hello, $it!") }
}

fun main() {
    val names = listOf("Alice", "Bob", "Charlie")
    greetAll(names)
}
```

## Input Simulation

```kotlin run input="Alice,30"
val name = readln()
val age  = readln().toInt()

println("Hello, $name!")
println("You were born around ${2026 - age}.")
```
