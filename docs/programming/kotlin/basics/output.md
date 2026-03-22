# Output to the Console in Kotlin

Printing to the console is the simplest way to see what your program is doing - useful for displaying results and checking values while you develop.

## println

`println()`(kotlin) prints a value and then moves to the **next line**:

```kotlin run
println("Hello, world!")
println("This is on a new line.")
```

## print

`print()`(kotlin) prints a value but **stays on the same line** - the next `print()`(kotlin) or `println()`(kotlin) continues from where it left off:

```kotlin run
print("Hello, ")
print("world!")
println()         // move to next line
println("Done.")
```

> [!NOTE]
> `println()`(kotlin) with no argument just prints a **blank line** - useful for spacing output.


## Printing Variables

Pass a variable directly to `println()`(kotlin) to print its value:

```kotlin run
val name = "Steve"
val score = 4200

println(name)
println(score)
```

## String Templates

The easiest way to mix variables and text is with **string templates** - see the [Working with Text](programming/kotlin/basics/text.md) page.

Prefix a variable name with `$`(kotlin) inside a string, and wrap expressions in `${...}`(kotlin):

```kotlin run
val name = "Steve"
val score = 4200
val bonus = 1000

println("$name has scored ${score + bonus}")
```

## Escape Characters

Some special characters inside strings need an **escape sequence** - a backslash `\`(kotlin) followed by a letter:

| Escape | Output |
|--------|--------|
| `\n`(kotlin)   | New line |
| `\t`(kotlin)   | Tab |
| `\"`(kotlin)   | Double quote |
| `\\`(kotlin)   | Backslash |
| `\$`(kotlin)   | Dollar sign (literal `$` even in string template) |

```kotlin run
println("Name:\tSteve")
println("Line one\nLine two")
println("She said \"hello\".")
```


## Printing Multiple Values

Print several values on one line using string templates or concatenation with `+`(kotlin):

```kotlin run
val firstName = "Steve"
val lastName  = "Rogers"
val age       = 25

println("$firstName $lastName, age $age")
```

> [!TIP]
> Prefer **string templates** over `+`(kotlin) concatenation - they are easier to read and less error-prone.


## Formatting Numbers

For controlling how numbers are displayed, use `String.format()`(kotlin):

```kotlin run
val pi   = 3.14159265
val cost = 1234.5

println("Pi to 2dp: %.2f".format(pi))
println("Cost: ${"%.2f".format(cost)}")
```

`%.2f`(kotlin) means format as a floating-point number with **2 decimal places**. You can use `%d`(kotlin) for integers and `%s`(kotlin) for strings.

Use `%,d`(kotlin) to format an integer with **comma separators** for large numbers:

```kotlin run
val population = 8200000

println("Population: ${"%,d".format(population)}")
```

This would show `8,200,000`(kotlin)
