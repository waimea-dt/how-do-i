# Branching / Decisions in Kotlin

Branching lets your program **make decisions** - running different blocks of code depending on whether a condition is `true` or `false`.

> [!TIP]
> Conditions are built using **comparison** and **logical operators** - see the [Conditional Logic](programming/kotlin/basics/logic.md) page for a full reference.


## If Statement

Only run a block of code if a condition is `true`:

```kotlin
if (condition) {
    // code runs if condition is true
}
```

For example...

```kotlin run
val score = 85

if (score >= 50) {
    println("You passed!")
}
```


## If...Else Statement

Run one block if a condition is `true`, or a different block if it is `false`:

```kotlin
if (condition) {
    // runs if true
} else {
    // runs if false
}
```

For example...

```kotlin run
val lives = 0

if (lives > 0) {
    println("Keep playing!")
} else {
    println("Game over!")
}
```


## If...Else If...Else Statement

Check multiple conditions in sequence - the first one that is `true` wins:

```kotlin
if (condition1) {
    // runs if condition1 is true
} else if (condition2) {
    // runs if condition2 is true
} else {
    // runs if no condition matched
}
```

For example...

```kotlin run
val score = 72

if (score >= 90) {
    println("Excellence")
} else if (score >= 75) {
    println("Merit")
} else if (score >= 60) {
    println("Achieved")
} else {
    println("Not Achieved")
}
```

> [!TIP]
> It is often more readable to use a `when` statement instead of `if...else if...else if...else`


## When Statement

`when` is Kotlin's alternative to a traditional switch statement. It compares a value against multiple options and runs the matching branch:

```kotlin
when (variable) {
    value1 -> // runs if variable == value1
    value2 -> // runs if variable == value2
    else   -> // runs if nothing matched
}
```

For example...

```kotlin run
val day = 3

when (day) {
    1    -> println("Monday")
    2    -> println("Tuesday")
    3    -> println("Wednesday")
    4    -> println("Thursday")
    5    -> println("Friday")
    6, 7 -> println("Weekend")
    else -> println("Invalid day")
}
```

> [!TIP]
> Multiple values can share the same branch by separating them with commas: `6, 7 -> ...`

`when` can also match **ranges** and **conditions**:

```kotlin run
val score = 82

when {
    score in 90..100 -> println("Excellence")
    score in 75..89  -> println("Merit")
    score in 60..74  -> println("Achieved")
    else             -> println("Not Achieved")
}
```


## If as an Expression

In Kotlin, `if` can return a value, so it can be used directly in an assignment - removing the need for a separate variable and block:

```kotlin run
val age = 20
val status = if (age >= 18) "Adult" else "Minor"

println(status)
```

> [!TIP]
> `when` can also be used as an expression the same way: `val label = when (score) { ... }`
