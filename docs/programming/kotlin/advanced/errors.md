# Error Handling in Kotlin

## Null Safety

In Kotlin, variables cannot hold `null` by default. If you try to assign `null` to a regular variable, it won't compile:

```kotlin
var name: String = null    // ✗ Compile error - String cannot be null
```

To allow `null`, add `?` after the type - making it a **nullable type**:

```kotlin
var name: String? = null   // ✓ String? can hold null
```

?> This is Kotlin's **null safety** system. By distinguishing nullable from non-nullable types at compile time, Kotlin prevents the common `NullPointerException` crash.


## Reading User Input

The `readlnOrNull()` function reads a line from the user and returns a `String?` - it returns `null` if no input is available (e.g. end of input stream):

```kotlin
val input: String? = readlnOrNull()
```

Because the result is nullable, you must handle the `null` case before using the value:

```kotlin
val input: String? = readlnOrNull()
if (input != null) {
    val upperInput = input.trim().uppercase()
}
```


## Safe-Call Operator `?.`

The **safe-call operator** `?.` calls a method or accesses a property **only if the value is not `null`**. If it is null, the whole expression returns `null` instead of crashing.

This lets you **chain** (connect) function calls safely - you can call multiple methods without a crash:

```kotlin
val input: String? = readlnOrNull()?.trim()?.uppercase()
```

## Elvis Operator `?:`

The **Elvis operator** `?:` provides a **fallback value** if the left side is `null`:

```kotlin
val value = nullableValue ?: fallback
```

For example, use a default if the user input fails...

```kotlin
val input = readlnOrNull() ?: ""    // empty string if input is null
```

## Validating Text Input

Combining these operators, here is a reusable pattern for reading a **non-blank string** from the user:

```kotlin run input="null, null, null, Cabbages are cool"
var text: String?
while (true) {
    print("Text: ")
    text = readlnOrNull()?.trim()
    if (!text.isNullOrBlank()) break
    println("INVALID\n")
}

println("VALID. Text entered: $text")
```

## Validating Numeric Input

Here is a reusable pattern for reading a **number**:

```kotlin run input="null, null, bacon, 12345"
var value: Int?
while (true) {
    print("Value: ")
    value = readlnOrNull()?.trim()?.toIntOrNull()
    if (value != null) break
    println("INVALID\n")
}

println("VALID. Value entered: $value")
```

?> `toIntOrNull()` safely converts a string to an `Int?`, returning `null` if the string isn't a valid number. Similarly `toDoubleOrNull()` and `toLongOrNull()` do the same.

You could extend this code to also check if the number input is **within a specific range**:

```kotlin run input="0, 11, -3, 99, 7"
var value: Int?
while (true) {
    print("Value (1-10): ")
    value = readlnOrNull()?.trim()?.toIntOrNull()
    if (value != null && value in 1..10) break
    println("INVALID\n")
}

println("VALID. Value entered: $value")
```

## Validating Char Input

For reading a **char** (e.g. to get a menu choice from the user), `firstOrNull()` safely gets the first character of a string, returning `null` if there isn't one:

```kotlin run input="null, x, b"
println("Option [A]")
println("Option [B]")
println("Option [C]")
println()

var choice: Char?
while (true) {
    print("Choice: ")
    choice = readlnOrNull()?.trim()?.firstOrNull()?.uppercaseChar()
    if (choice != null && choice in "ABC") break
    println("INVALID\n")
}

println("VALID. Option chosen: $choice")
```

## Non-Null Assertion

The `!!` operator (non-null assertion) tells Kotlin "I guarantee this is not null".

Only use it if you need to let the Kotlin compiler know that you have previously checked a value is not null - but avoid `!!` in situations where you can't be certain.

```kotlin run input="67"
val input = readlnOrNull()

if (input != null) {
    val number = input!!.toInt()    // Asserting that input isn't null here
    println("Numeric value: $number")
}
```

