# Code Blocks

A **code block** is a section of code wrapped in curly braces `{ }`. Blocks are used throughout Kotlin to group statements together.

```kotlin
{
    // everything in here is one block
}
```

You'll see blocks used with `if`, `else`, `for`, `while`, functions, and classes - anywhere Kotlin needs to know where a section of code begins and ends.


## Blocks in Practice

Here are some common places you'll encounter blocks:

**`if` / `else`** - runs the block when the condition is met:

```kotlin run
val score = 72

if (score >= 50) {
    println("Passed!")     // this block runs
}
else {
    println("Failed.")     // this block doesn't run
}
```

**`for` loop** - runs the block once for each item:

```kotlin run
for (i in 1..3) {
    println("Count: $i")   // this block runs 3 times
}
```

**Function** - the block is the body of the function and runs when it's called:

```kotlin run
fun greet(name: String) {
    println("Hello, $name!")
}

greet("Alice")
greet("Bob")
```


## Indentation

Code inside a block is **indented** (typically 4 spaces or 1 tab). Kotlin doesn't enforce this - your code will still run without it - but it's an important convention that makes code much easier to read:

```kotlin
// ✓ Indented - easy to read
if (score >= 50) {
    println("Passed!")
    println("Well done.")
}

// ✗ Not indented - works, but hard to read
if (score >= 50) {
println("Passed!")
println("Well done.")
}
```

?> Most editors (including IntelliJ IDEA) will indent your code automatically as you type.


## Blocks and Scope

A variable declared inside a block only exists within that block - it cannot be accessed once the block ends. This is called **scope**:

```kotlin run
if (true) {
    val bonus = 500
    println("Bonus: $bonus")   // ✓ works fine inside the block
}

// println(bonus)   // ✗ Error - 'bonus' doesn't exist out here
```

?> See the [Variables & Types](programming/kotlin/basics/variables.md) page for a full explanation of scope.
