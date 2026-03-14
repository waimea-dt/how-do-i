# Working with Numbers

The most commonly used numeric types are:

| Type | Description | Size (bits) | Range |
|------|-------------|-------|-----|
| `Int` | for integer, whole numbers | 32 | ±2,147,483,647 |
| `Long` | for very large whole numbers | 64 | ±9,223,372,036,854,775,807 |
| `Double` | for decimal numbers | 64 | ±very large! (10<sup>308</sup>) |


## Writing Numeric Values

When writing literal numbers in code...

```kotlin
val score: Int = 2000                  // Plain number
val kmToNeptune: Long = 4500000000L    // 'L' suffix at end
var cost: Double = 123.45              // Decimal point
```

## Numeric Ranges

To create a range of values, the range operators can be used:

- `A..B` give a range from A to B (inclusive of A and B)
- `A..<B` give a range from A *up to* B (but not including B)

For example...

```kotlin run
// Show values 1 to 10
for (i in 1..10) {
    println(i)
}
```

or...

```kotlin run
// Index values (useful when working with lists)
for (i in 0..<10) {
    println(i)
}
```


## Arithmetic Operators

For mathematical operations:

- `+` for **addition**
- `-` for **subtraction**
- `*` for **multiplication**
- `/` for **division**
- `%` for **modulus** (remainder of a division)
- `++` to **increment** by one
- `--` to **decrement** by one

Example of **arithmetic** operators...

```kotlin run
// Pay calculations
val pay      = 3200
val bonus    = 675
val hours    = 160
val total    = pay + bonus
val payRate  = total / hours
val tax      = total * 0.35
val takeHome = total - tax

println("Total pay:  $total")
println("Pay rate:   $payRate/hour")
println("Tax to pay: $tax")
println("Take home:  $takeHome")
```

?> An **Int divided by an Int** will result in an **Int** value - any decimal places will be lost.
To get the exact decimal answer, at least one value needs to be a **Double**. So, in the above example we should change the line to: `val payRate = total.toDouble() / hours`. Try editing the code and see how the result changes


Example of **modulus** operator...

```kotlin run
// Determining if numbers are odd or even
for (number in 1..10) {
    print("$number: ")
    // Even if no remainder from divide by 2
    if (number % 2 == 0) println("Even")
    else                 println("Odd")
}
```

Example of **increment** operator...

```kotlin run
// Stop after 10 rounds
var round = 0
while (round < 10) {
    // Next round
    round++
    println("Round $round")
}
```


### Combining with Assignment Operator

If a variable is being modified like this...

```kotlin
score = score + 100
lives = lives - 1
cost  = cost * 2
value = value / 10
```

... then there are shortened form: `+=`, `-=`, `*=`, etc...

```kotlin
score += 100
lives -= 1
cost  *= 2
value /= 10
```


## Converting Between Types

Kotlin is strict about types — you can't use an `Int` where a `Double` is expected without explicitly converting it. Use the built-in conversion methods:

```kotlin run
val score: Int    = 42
val price: Double = 9.99

val scoreAsDouble = score.toDouble()   // 42.0
val priceAsInt    = price.toInt()      // 9  — truncates, does not round
val priceAsLong   = price.toLong()     // 9

println(scoreAsDouble)
println(priceAsInt)
println(priceAsLong)
```

Converting between numbers and strings:

```kotlin run
val number = 42
val text   = "100"

val numberToString = number.toString()   // "42"
val stringToInt    = text.toInt()        // 100
val stringToDouble = "3.14".toDouble()   // 3.14

println(numberToString)
println(stringToInt + 1)
println(stringToDouble)
```

?> `.toInt()` on a `Double` **truncates** — it drops the decimal part without rounding. To round to the nearest integer, use `round(n).toInt()` from `kotlin.math`.


## Maths Functions

Kotlin's `kotlin.math` library provides common mathematical functions. Import it at the top of your file:

```kotlin
import kotlin.math.*
```

**Rounding and absolute value:**

```kotlin run
import kotlin.math.*

val price = 3.7489

println(round(price))    // 4.0  — round to nearest
println(floor(price))    // 3.0  — round down
println(ceil(price))     // 4.0  — round up
println(abs(-42))        // 42   — remove negative sign
```

**Power and roots:**

```kotlin run
import kotlin.math.*

println(2.0.pow(8))     // 256.0  — 2 to the power of 8
println(sqrt(144.0))    // 12.0   — square root
```

**Min, max, and clamping:**

```kotlin run
import kotlin.math.*

println(min(10, 25))          // 10    — smaller of two values
println(max(10, 25))          // 25    — larger of two values
println(10.0.coerceIn(0.0, 1.0))  // 1.0  — clamp to a range
```

**Random numbers:**

```kotlin run
import kotlin.random.Random

println(Random.nextInt(1, 7))       // random int: 1..6 (dice roll)
println(Random.nextDouble(0.0, 1.0))  // random double between 0 and 1
```

?> `Random.nextInt(from, until)` — note that `until` is **exclusive**, so `nextInt(1, 7)` gives values 1–6.


## Useful Maths Functions Summary

| Function | What it does |
|----------|-------------|
| `abs(n)` | Absolute value (removes negative sign) |
| `round(n)` | Round to nearest (returns `Double`) |
| `floor(n)` | Round down |
| `ceil(n)` | Round up |
| `n.pow(exp)` | `n` to the power of `exp` |
| `sqrt(n)` | Square root |
| `min(a, b)` | Smaller of two values |
| `max(a, b)` | Larger of two values |
| `n.coerceIn(min, max)` | Clamp `n` between `min` and `max` |
| `Random.nextInt(from, until)` | Random integer in range |
| `Random.nextDouble(from, until)` | Random decimal in range |

