# Kotlin Cheatsheet

## Variables

```kotlin
val name  = "Gandalf"        // immutable (can't be reassigned)
var score = 0                // mutable (can change)

val lives: Int    = 3        // explicit type
var health: Double           // declared without value - type required
```

**Types:** `String`, `Char`, `Int`, `Long`, `Double`, `Boolean`

```kotlin
val greeting: String  = "Hello"
val initial:  Char    = 'G'
var year:     Int     = 2026
var distance: Long    = 4_500_000_000L
var cost:     Double  = 9.99
var isAlive:  Boolean = true
```

?> Boolean names should read as questions: `isAlive`, `hasKey`, `canFly`


## Output

```kotlin
println("Hello, world!")          // print + newline
print("Loading... ")              // print, no newline
println()                         // blank line

val name = "Steve"
val score = 1200
println("$name scored $score")           // string template
println("Double: ${score * 2}")          // expression in template
println("Pi: ${"%.2f".format(3.14159)}") // formatted number
```


## Input

```kotlin
print("Enter name: ")
val name = readln()              // reads a String

val age   = readln().toInt()     // convert to Int
val price = readln().toDouble()  // convert to Double
```

?> Use `readlnOrNull()` with null safety — see the [Null Safety](#null-safety) section below.


## Numbers

```kotlin
val a = 10 + 3    // 13   addition
val b = 10 - 3    // 7    subtraction
val c = 10 * 3    // 30   multiplication
val d = 10 / 3    // 3    integer division (truncates!)
val e = 10.0 / 3  // 3.33 float division
val f = 10 % 3    // 1    remainder (modulus)

score++           // increment
lives--           // decrement
score += 100      // shorthand: score = score + 100
```

**Ranges:**

```kotlin
1..10             // 1 to 10 inclusive
0..<10            // 0 to 9 (exclusive upper bound)
10 downTo 1       // 10 to 1
0..20 step 5      // 0, 5, 10, 15, 20
```

**Type conversion:**

```kotlin
val i = price.toInt()       // 9.99 → 9 (truncates)
val d = score.toDouble()    // 42  → 42.0
val s = score.toString()    // 42  → "42"
val n = "100".toInt()       // "100" → 100
```

**Maths (`kotlin.math.*`):**

```kotlin
import kotlin.math.*

round(3.7)          // 4.0
floor(3.7)          // 3.0
ceil(3.2)           // 4.0
abs(-5)             // 5
sqrt(144.0)         // 12.0
2.0.pow(8)          // 256.0
min(4, 9)           // 4
max(4, 9)           // 9
5.coerceIn(1, 10)   // 5  (clamp to range)

import kotlin.random.Random
Random.nextInt(1, 7)         // random Int: 1–6
Random.nextDouble(0.0, 1.0)  // random Double: 0.0–1.0
```


## Text (Strings)

```kotlin
val s = "Kotlin"

s.length              // 6
s[0]                  // 'K'  (first char)
s.first()             // 'K'
s.last()              // 'n'
s.take(3)             // "Kot"
s.drop(4)             // "in"
s.substring(2, 5)     // "tli"

s.uppercase()         // "KOTLIN"
s.lowercase()         // "kotlin"
s.trim()              // remove surrounding whitespace
s.replace("K", "J")   // "Jotlin"
s.split(",")          // split into List<String>
s.startsWith("Ko")    // true
s.endsWith("in")      // true
s.contains("otl")     // true
"otl" in s            // true (same as contains)
```


## Branching

```kotlin
if (score >= 50) {
    println("Passed")
} else if (score >= 40) {
    println("Nearly")
} else {
    println("Failed")
}
```

**`when` — cleaner for multiple branches:**

```kotlin
when (day) {
    1    -> println("Monday")
    2    -> println("Tuesday")
    6, 7 -> println("Weekend")     // multiple values
    else -> println("Weekday")     // default
}

// when with ranges / conditions
when {
    score >= 90 -> println("Excellence")
    score >= 75 -> println("Merit")
    else        -> println("Achieved")
}
```


## Logic

```kotlin
// Comparison operators
==   !=   >   >=   <   <=

// Boolean operators
&&   // and — both must be true
||   // or  — at least one must be true
!    // not — reverses the value

// Range check
score in 1..100    // true if 1 ≤ score ≤ 100
item !in list      // true if not in list
```


## Loops

```kotlin
// for over a range
for (i in 1..5) { println(i) }

// for over a list (by value)
for (item in items) { println(item) }

// for over a list (by index)
for (i in 0..<items.size) { println(items[i]) }

// repeat a fixed number of times
repeat(3) { println("Loading...") }

// while
while (lives > 0) { lives-- }

// do-while (always runs at least once)
do {
    attempts++
} while (attempts < 3)

// break and continue
for (n in numbers) {
    if (n == 0) continue    // skip this item
    if (n < 0) break        // exit loop
}
```


## Functions

```kotlin
fun greet(name: String): String {
    return "Hello, $name!"
}

// single-expression shorthand
fun double(n: Int): Int = n * 2

// default parameter values
fun greet(name: String, greeting: String = "Hello") {
    println("$greeting, $name!")
}

// no return value (Unit)
fun printScore(score: Int) {
    println("Score: $score")
}
```


## Collections

```kotlin
// List — read-only
val colours = listOf("Red", "Green", "Blue")
colours[0]                   // "Red"
colours.last()               // "Blue"
colours.size                 // 3
"Green" in colours           // true

// MutableList — can change
val scores = mutableListOf(10, 25, 8)
scores.add(42)               // append
scores.add(0, 99)            // insert at index
scores.remove(25)            // remove by value
scores.removeAt(0)           // remove by index
scores[1] = 100              // update

scores.sort()                // sort ascending (in place)
scores.sortDescending()      // sort descending (in place)
val sorted = scores.sorted() // sorted copy, original unchanged

// MutableMap — key/value pairs
val player = mutableMapOf("name" to "Steve", "score" to 0)
player["score"] = 100        // update
player["level"] = 5          // add new key
player.remove("level")       // remove key
"name" in player             // true
```

**Useful collection methods:**

```kotlin
items.forEachIndexed { i, item -> println("$i: $item") }

items.filter { it > 10 }     // new list with matching items
items.map { it * 2 }         // new list with transformed items
items.any { it > 50 }        // true if any item matches
items.all { it > 0 }         // true if all items match
items.count { it % 2 == 0 }  // number matching condition
items.sum()                  // total (numeric lists)
items.minOrNull()            // smallest, or null if empty
items.maxOrNull()            // largest, or null if empty
```


## Null Safety

```kotlin
var name: String  = null   // ✗ compile error
var name: String? = null   // ✓ nullable type

// safe-call operator — returns null instead of crashing
val length = name?.length

// elvis operator — fallback if null
val display = name ?: "Unknown"

// chain both
val input = readlnOrNull()?.trim() ?: ""

// safe numeric conversion (returns null instead of crashing)
val n = "abc".toIntOrNull()    // null
val n = "42".toIntOrNull()     // 42
```


## Classes & OOP

```kotlin
class Wizard(val name: String, var mana: Int) {

    var spellsCast: Int = 0

    fun castSpell(spell: String) {
        mana -= 10
        spellsCast++
        println("$name casts $spell! (mana: $mana)")
    }

    override fun toString() = "Wizard($name, mana=$mana)"
}

// create objects
val gandalf = Wizard("Gandalf", 100)
val merlin  = Wizard("Merlin",   80)

gandalf.castSpell("Fireball")
println(gandalf.name)        // property access
println(gandalf)             // calls toString()
```

## Comments

```kotlin
// single-line comment

/*
   multi-line
   comment
*/

/**
 * KDoc — appears as a tooltip in your IDE.
 * @param name The player's name
 * @return A greeting string
 */
fun greet(name: String): String = "Hello, $name!"
```
