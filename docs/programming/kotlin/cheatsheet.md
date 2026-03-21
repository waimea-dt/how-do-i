# Kotlin Cheatsheet

## Variables

```kotlin
val name  = "Gandalf"   // 'val' → immutable (can't be reassigned)
var score = 0           // 'var' → mutable (can change)
```

**Common types:** `String`, `Char`, `Int`, `Long`, `Double`, `Boolean`

```kotlin
val name: String        // explicit type
val lives: Int = 3      // explicit type with assignment
var height = 1.85       // type is inferred from assigned value (Double)

val greeting: String  = "Hello"
val initial:  Char    = 'G'
var year:     Int     = 2026
var distance: Long    = 4_500_000_000L
var cost:     Double  = 9.99
var isAlive:  Boolean = true
```

> [!IMPORTANT]
> Variable **names** should start with a **lowercase letter** and use **camelCase** for multiple words. Boolean names should read as questions: `isAlive`, `hasKey`, `canFly`


## Output to the Console

```kotlin
println("Hello, world!")   // print + newline
print("Loading... ")       // print, no newline
println()                  // blank line
```

**String templates:**

```kotlin
val name = "Steve"
val age = 21
println("$name is $age years old")        // string template, with variable,using $...
println("Age in 10 years: ${age + 10}")   // template, with expression using ${...}
```

**Formatting numbers:**

```kotlin
val pi = 3.1415927
val dist = 250000000
println("Pi: ${"%.2f".format(pi)}")           // Double to 2dp   → "3.14"
println("Dist: ${"%,d".format(distance)}km")  // Int with commas → "250,000,000"
```

**Escape characters:**

```kotlin
println("Name:\tSteve")          // \t = tab
println("Line1\nLine2\nLine3")   // \n = newline
println("She said \"hi\"")       // \" = double quote
println("It costs \$200")        // \$ = literal dollar sign
```

## Input

```kotlin
print("Enter name: ")
val name  = readln()             // reads a String

val name  = readln().trim()      // remove any spaces at start/end

val age   = readln().toInt()     // convert to Int
val price = readln().toDouble()  // convert to Double

val pick  = readln().first()     // get first Char
```

> [!TIP]
> Use `readlnOrNull()` with null safety - see the [Null Safety](#null-safety) section below.


## Numbers

```kotlin
10 + 3          // addition            → 13
10 - 3          // subtraction         → 7
10 * 3          // multiplication      → 30
10 / 3          // integer division    → 3 (discards the decimals)
10.0 / 3        // double division     → 3.3333 (one value must be double)
10 % 3          // modulus (remainder) → 1

score++         // increment by 1
lives--         // decrement by 1
score += 100    // shorthand → score = score + 100
```

**Ranges:**

```kotlin
1..10           // 1 to 10 inclusive
0..<10          // 0 to 9 (exclusive upper bound)
10 downTo 1     // 10 to 1
0..20 step 5    // 0, 5, 10, 15, 20
```

**Type conversion:**

```kotlin
9.99.toInt()    // 9.99  → 9 (truncates)
42.toDouble()   // 42    → 42.0
42.toString()   // 42    → "42"
"100".toInt()   // "100" → 100
```

**Maths (`kotlin.math.*`):**

```kotlin
import kotlin.math.*

round(3.7)          // round up/down   → 4.0
floor(3.7)          // round down to   → 3.0
ceil(3.2)           // round up        → 4.0
abs(-5)             // ignore +/- sign → 5
sqrt(144.0)         // square root     → 12.0
2.0.pow(8)          // to the power of → 256.0
min(4, 9)           // lowest value    → 4
max(4, 9)           // highest value   → 9
13.coerceIn(1, 10)  // clamp to range  → 10
```

**Random values (`kotlin.random.*`):**

```kotlin
import kotlin.random.Random

Random.nextInt(1, 7)         // random Int → 1 up to 6 (7 not included)
Random.nextDouble(0.0, 1.0)  // random Double → 0.0 up to 0.99999... (1.0 not included)
```


## Text (Strings and Chars)

> [!NOTE]
> **Strings** are wrapped in double-quotes, `"..."`. **Chars** are wrapped in single-quotes, `'.'`. **Multi-line Strings** are wrapped in triple-quotes, `"""..."""`

```kotlin
val text = "Kotlin"

text.length               // number of chars in the string → 6
```

**Extracting parts of the text:**

```kotlin
text[0]                   // char by index       → 'K'
text.first()              // first char          → 'K'
text.last()               // last char           → 'n'
text.take(3)              // first 3 chars       → "Kot"
text.drop(4)              // chars after first 4 → "in"
text.substring(2, 5)      // char index 2 to 4   → "tli"
```

**Converting text:**

```kotlin
text.uppercase()          // all uppercase → "KOTLIN"
text.lowercase()          // all lowercase → "kotlin"

text.replace("K", "J")    // replace text     → "Jotlin"
```

**Checking text content:**

```kotlin
text.startsWith("Ko")     // true if starts with → true
text.endsWith("on")       // true if ends with   → false
text.contains("otl")      // true if contains    → true
"otl" in text             // same as contains()  → true
text.indexOf("tl")        // index of first match or -1 if none → 2
```

**Removing surrounding whitespace:**

```kotlin
val text = "  Hi!  "

text.trim()               // remove surrounding whitespace   → "Hi!"
text.trimStart()          // remove leading whitespace only  → "Hi!  "
text.trimEnd()            // remove trailing whitespace only → "  Hi!"
```

**Padding to a fixed width:**

```kotlin
val text = "42"

text.padStart(5)          // pad with spaces to width 5      → "   42"
text.padStart(5, '0')     // pad with a character to width 5 → "00042"
text.padEnd(5)            // pad with spaces on the right    → "42   "
text.padEnd(5, '.')       // pad with character on the right → "42..."
```

**Converting to a list of words / lines:**

```kotlin
val sentence = "I like cheese"
val colours = "red, green, blue"
val multiLine = """
    First line
    Second line
""".trimIndent()          // trimIndent removes any indents added for clarity

sentence.split(" ")       // split text by spaces → ["I", "like", "cheese"]
colours.split(", ")       // split text at commas → ["red", "green", "blue"]
multiLine.split("\n")     // split into lines → ["First line", "Second line"]
```

**Concatenation (joining):**

```kotlin
"Spell: " + "Fireball"    // join strings with +  → "Spell: Fireball"
"Player: " + name         // join with a variable → "Player: Nova"
```

**Chars (characters):**

```kotlin
val c = 'K'

c.isDigit()           // true if 0-9          → false
c.isLetter()          // true if a-z or A-Z   → true
c.isLowerCase()       // true if a-z          → false
c.isUpperCase()       // true if A-Z          → true
c.lowercaseChar()     // convert to lowercase → 'k'
c.uppercaseChar()     // convert to uppercase → 'k'

c  in "aeiou"         // true if char in string     → false
c !in "aeiou"         // true if char not in string → true
```

**Looping though all chars in a string:**

```kotlin
for (letter in "Kotlin") { print("$letter ") }  // Loop by char → K o t l i n
```


## Conditional Logic

**Comparison operators:**

```kotlin
A == B      // true if both the same
A != B      // true if different
A >  B      // true if A is greater than B
A >= B      // true if A is great than or equal to B
A <  B      // true if A is less than B
A <= B      // true if A is less than or equal to B
```

**Boolean operators:**

```kotlin
A && B      // and - true if both A and B are true
A || B      // or  - true if either A or B are true (or both)
!A          // not - true if A is false, false if A is true
```

**Range checking:**

```kotlin
score in 1..100    // true if 1 ≤ score ≤ 100
item !in list      // true if item not in list
```

## Branching

**`if` statement:**

```kotlin
if (isLoggedIn) {
    println("Welcome!")
}
```

**Alternative branches with `else`:**

```kotlin
if (score >= 50) {
    println("Passed")
}
else if (score >= 40) {
    println("Nearly")
}
else {
    println("Failed")
}
```

**`when` is cleaner for multiple branches:**

```kotlin
when (day) {
    6, 7 -> println("Weekend")     // multiple values
    else -> println("Weekday")     // default
}

// when with ranges / conditions
when {
    score in 85..100 -> println("Excellence")
    score in 70..84  -> println("Merit")
    score in 50..74  -> println("Achieved")
    else             -> println("Not Achieved")
}
```

**As expressions - return a value directly:**

```kotlin
val result = if (score >= 50) "Pass" else "Fail"

val level = when {
    exp >= 200 -> "Ninja"
    exp >= 100 -> "Basic"
    else       -> "Noob"
}
```


## Loops

**Simple `repeat` loop:**

```kotlin
repeat(3) {                  // fixed number of times → Boom! Boom! Boom!
    print("Boom!")
}

repeat(5) {                  // ... with index `it`   → 0 1 2 3 4
    print("$it")
}
```

**`for` loops:**

```kotlin
for (i in 1..5) {            // loop over an inclusive range → 1 2 3 4 5
    print(i)
}
```

**`for` loops over collections:**

```kotlin
for (item in items) {        // loop over a list by value
    println(item)
}

for (i in 0..<items.size) {  // loop over a list by index → 0 1 2 3 4 ...
    println(items[i])
}
```

**`while` and `do..while` loops:**

```kotlin
while (lives > 0) {          // while loop repeats if condition true
    lives--
}

do {                         // do..while always runs at least once
    turn++
} while (turn < 3)
```

```kotlin
while (true) {               // infinite loop - exits only via break
    if (escaped) break
}
```

**`continue` and `break`:**

```kotlin
for (n in numbers) {
    if (n == 3) continue     // skip this item (restart loop code with next value)
    if (n < 0) break         // exit loop (jump to code after loop)
}
```

## Functions

```kotlin
// simple function, no parameters or return value
fun welcome() {
    println("Hello, World!")
}
```

**Parameters:**

```kotlin
fun showScore(score: Int) {
    println("Score: $score")
}
```

```kotlin
// default parameter values
fun greet(name: String, greeting: String = "Hello") {
    println("$greeting, $name!")
}

// named arguments - any order; skip parameters that have defaults
greet("Bob", "Hi")                       // both arguments
greet("Alice")                           // first argument, uses default greeting
greet(greeting = "Hey", name = "Carol")  // named arguments - any order
```

**Return values:**

```kotlin
// function with two parameters and a return value
fun add(a: Int, b: Int): Int {
    return a + b
}
```

```kotlin
// single-expression shorthand
fun square(n: Int): Int = n * n
```


## Lists

```kotlin
val nums = listOf(10, 0, 25, 8, 88, 67)    // List - read-only

nums.size                       // number of items → 6
```

**Accessing list elements:**

```kotlin
nums[0]                         // value by index  → 10
nums.first()                    // first value     → 10
nums.last()                     // last value      → 67
```

**Mathematical Operations:**

```kotlin
nums.sum()                      // total                → 198
nums.average()                  // mean value (Double)  → 33.0
nums.min()                      // smallest             → 0
nums.max()                      // largest              → 88
```

**Checking Values:**

```kotlin
nums.isEmpty()                  // true if no items          → false

67 in nums                      // true if value in list     → true

nums.any    { it > 50 }         // true if any item matches  → true
nums.all    { it > 0 }          // true if all items match   → false
nums.count  { it > 50 }         // number matching condition → 2

nums.filter { it > 50 }         // new list of matching items    → [67, 88]
nums.map    { it % 2 }          // new list of transformed items → [0, 0, 1, 0, 0, 1]
```

**Reorganised copies:**

```kotlin
val sorted   = nums.sorted()    // new copy, sorted      → [0, 8, 10, 25, 67, 88]
val shuffled = nums.shuffled()  // new copy, randomised  → [10, 88, 0, 67, 8, 25]
val pick     = nums.random()    // random item from list → 67
```

**Looping through values:**

```kotlin
for (num in nums)      { println(num) }

for (i in 0..<nums.size) { println(nums[i]) }

nums.forEachIndexed { i, num -> println("$i: $num") }
```

## MutableLists

```kotlin
val letters = mutableListOf('K', 'O', 'T')   // MutableList - can change
val empty   = mutableListOf<Char>()          // empty MutableList (type required)
```

**Adding / removing / updating values:**

```kotlin
letters.add('I')           // append to end          → ['K', 'O', 'T', 'I']
letters.add(3, 'L')        // insert at index 1      → ['K', 'O', 'T', 'L', 'I']

letters.remove('O'))       // remove by value        → ['K', 'T', 'L', 'I']
letters.removeAt(1)        // remove by index        → ['K', 'L', 'I']

letters[2] = 'A'           // update value by index  → ['K', 'L', 'A']

letters.clear()            // remove all items       → []
```

**Rearranging values (in place):**

```kotlin
letters.sort()             // sort list ascending    → ['A', 'K', 'L']
letters.sortDescending()   // sort list descending   → ['L', 'K', 'A']
letters.shuffle()          // randomise list order   → ['K', 'A', 'L']
```


## Maps - Key/Value Pairs

```kotlin
val rgb = mapOf('R' to 255, 'G' to 128, 'B' to 64)   // Map - read-only

rgb.keys                // set of all keys       → ["R", "G", "B"]
rgb.values              // set of all values     → [255, 128, 64]
```

**Accessing values:**

```
rgb['B']                // value by key          → 64
```

**Checking values and keys:**

```kotlin
'G' in rgb              // check if key exists   → true
rgb.containsValue(128)  // check if value exists → true

rgb['A'] ?: "none"      // Elvis fallback for missing key → "none"
```

**Looping over keys and values:**

```kotlin
for ((key, value) in rgb) { println("$key: $value") }
```


## MutableMaps

```kotlin
val stats = mutableMapOf('S' to 5, 'D' to 3, 'I' to 7)   // MutableMap - can change
```

**Updating / adding / removing records:**

```kotlin
stats['S'] = 10         // update value by key   → {'S':10, 'D':3, 'I':7}
stats['W'] = 7          // add new key and value → {'S':10, 'D':3, 'I':7, 'W':7}
stats.remove('D')       // remove by key         → {'S':10, 'I':7, 'W':7}
```


## Nullable Types and Null Safety

```kotlin
var name: String  = null   // ✗ compile error
var name: String? = null   // ✓ nullable type
```

**Null safety operators:**

```kotlin
val length = name?.length                 // safe-call operator - only run if not null

val display = name ?: "Unknown"           // elvis operator - fallback if null

val input = readlnOrNull()?.trim() ?: ""  // Safely chained with fallback
```

**Value conversions:**

```kotlin
"42".toIntOrNull()       // 42
"abc".toIntOrNull()      // null
"3.14".toDoubleOrNull()  // 3.14
name?.firstOrNull()      // first char, or null
```

**Null text checks:**

```kotlin
name.isNullOrBlank()     // true if null, empty, or whitespace
```

**Non-null assertion (when value can't be null):**

```kotlin
val len = name!!.length  // non-null assertion - use cautiously
```


## Classes & OOP

```kotlin
class Wizard(val name: String, var mana: Int) {

    var spellsCast: Int = 0     // internal property with default value

    // runs automatically when object is created
    init {
        println("$name entered the realm!")
    }

    // method (behaviour / api)
    fun castSpell(spell: String) {
        mana -= 10
        spellsCast++
        println("$name casts $spell! (mana: $mana)")
    }

    // Provide human-readable text when printing object
    override fun toString() = "Wizard($name, mana=$mana)"
}
```

**Instantiating (creating) objects from a class:**

```kotlin
val gandalf = Wizard("Gandalf", 100)
val merlin  = Wizard("Merlin",  100)
```

**Accessing object properties:**

```kotlin
println(gandalf.name)
println(gandalf.spellsCast)
```

**Calling object methods:**

```kotlin
gandalf.castSpell("Fireball")
merlin.castSpell("Heal")
```

**Objects as strings:**

```kotlin
println(gandalf)    // calls toString() → "Wizard(Gandalf, mana=80)"
```

**Encapsulation with `private` properties / methods:**

```kotlin
class Account(val owner: String) {
    private var balance = 0      // Private property, not accessible outside the class

    fun getBalance() = balance   // Safely access property via 'getter' method

    fun deposit(amount: Int) {
        if (validateAmount(amount)) balance += amount
    }

    fun withdraw(amount: Int) {
        if (validateAmount(amount) && amount <= balance) balance -= amount
    }

    // private method, only used within class, not accessible outside
    private fun validateAmount(amount: Int): Boolean {
        return amount > 0
    }
}

val myAccount = Account("Dave")

myAccount.deposit(1500)         // Updates private property via method call
myAccount.withdraw(200)         // Updates private property via method call

// try to access a private property
myAccount.balance = 99999       // Error! Property is inaccessible
myAccount.validateAmount(20)    // Error! Method is inaccessible
```

**Data classes**

```kotlin
// data class auto-generates equals, copy(), toString()
data class Point(val x: Int, val y: Int)

val p1 = Point(3, 7)
val p2 = p1.copy(y = 10)     // Point(x=3, y=10)
println(p1 == Point(3, 7))   // true (compares values, not reference)
```

## Comments

```kotlin
// this is a single-line comment
```

```kotlin
/* this is a multi-line
   comment that can cover
   more than one line */
```

```kotlin
/**
 * KDoc - appears as a tooltip in your IDE.
 * @param name The player's name
 * @return A greeting string
 */
fun greet(name: String): String = "Hello, $name!"
```
