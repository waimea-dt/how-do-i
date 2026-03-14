# Variables and Data Types in Kotlin

## Variable Declaration

Variables in Kotlin are declared using either:
- `val` for immutable **val**ues which can't be altered
- `var` for mutable **var**iables which can be changed

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

If you are assigning a value at the same time as declaring a variable, you don't need to specify the variable type, Kotlin will infer it. But, if you are just declaring the variable, you must specify the type using `: Type`

```kotlin
val name: String               // String type specified
var age: Int                   // Int type specified
val birthPlace = "London"      // String type is inferred
var likesCats = true           // Boolean type is inferred
```

The most common types you will be using:
- `String`- for text
- `Char` - for single characters
- `Int` - for integer, whole numbers
- `Long` - for very large whole numbers
- `Double` - for decimal numbers
- `Boolean` - for true/false values

```kotlin
val name: String = "Steve"
val initial: Char = 'S'
var year: Int = 2026
val kmToNeptune: Long = 4500000000L
var cost: Double = 123.45
var isAlive: Boolean = true
```

?> In Kotlin, **Strings** are wrapped with **double speech marks**: `"Hello"`, while **Chars** are wrapped with **single speech marks**: `'Z'`


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

?> Kotlin variables **cannot hold `null` by default** - this is one of Kotlin's key safety features. You will learn more about this in the [Error Handling](programming/kotlin/advanced/errors.md) page.


