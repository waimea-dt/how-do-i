# User Input from the Console in Kotlin

`readln()` reads a line of text typed by the user and returns it as a `String`.

## Reading Text

```kotlin
val input = readln()
```

Use `print()` (not `println()`) to show a prompt on the same line before the user types:

```kotlin run input="Jimmy"
print("Enter your name: ")
val name = readln()
println("Hello, $name!")
```

?> `print()` keeps the cursor on the same line so the user types immediately after the prompt, rather than on the next line.


## Cleaning Up Input

User input may have unwanted spaces at the start or end. Use `.trim()` to remove them:

```kotlin run input="  hello  "
print("Enter text: ")
val input = readln().trim()
println("You entered: '$input'")
```

?> It's good practice to always `.trim()` text input before using it, since users often accidentally add leading or trailing spaces.


## Reading a Character

To read a single character (for example, a menu choice), use `.first()` to take just the first character from the input:

```kotlin run input="Y"
print("Continue? (Y/N): ")
val choice = readln().first()
println("You chose: $choice")
```

!> `.first()` will crash if the user presses Enter without typing anything. See the [Error Handling](programming/kotlin/advanced/errors.md) page for how to safely handle this with `.firstOrNull()`.


## Reading Numbers

`readln()` always returns a `String`. To use the input as a number, convert it with `.toInt()` or `.toDouble()`:

```kotlin
val age  = readln().toInt()
val cost = readln().toDouble()
```

For example...

```kotlin run input="16"
print("Enter your age: ")
val age = readln().toInt()
println("In 10 years you will be ${age + 10}.")
```

```kotlin run input="49.99"
print("Enter the price: ")
val price = readln().toDouble()
val withTax = price * 1.15
println("With tax: ${"%.2f".format(withTax)}")
```

!> If the user types something that isn't a valid number, `.toInt()` and `.toDouble()` will crash. See the [Error Handling](programming/kotlin/advanced/errors.md) page for how to handle this safely.


## Reading Multiple Values

Call `readln()` once for each value you want to read:

```kotlin run input="Jimmy, Tickles, 10"
print("First name: ")
val firstName = readln()

print("Last name: ")
val lastName = readln()

print("Age: ")
val age = readln().toInt()

println("Hello, $firstName $lastName! You are $age years old.")
```
