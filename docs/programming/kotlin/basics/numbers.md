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

