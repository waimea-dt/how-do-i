# Output to the Console in Kotlin

Printing to the console is the simplest way to see what your program is doing - useful for displaying results and checking values while you develop.

## println

`println` prints a value and then moves to the **next line**:

```kotlin run
println("Hello, world!")
println("This is on a new line.")
```

## print

`print` prints a value but **stays on the same line** - the next `print` or `println` continues from where it left off:

```kotlin run
print("Hello, ")
print("world!")
println()         // move to next line
println("Done.")
```

?> `println()` with no argument just prints a **blank line** - useful for spacing output.


## Printing Variables

Pass a variable directly to `println` to print its value:

```kotlin run
val name = "Steve"
val score = 4200

println(name)
println(score)
```

## String Templates

The easiest way to mix variables and text is with **string templates** - see the [Working with Text](programming/kotlin/basics/text.md) page.

Prefix a variable name with `$` inside a string, and wrap expressions in `${...}`:

```kotlin run
val name = "Steve"
val score = 4200
val bonus = 1000

println("$name has scored ${score + bonus}")
```

## Escape Characters

Some special characters inside strings need an **escape sequence** - a backslash `\` followed by a letter:

| Escape | Output |
|--------|--------|
| `\n`   | New line |
| `\t`   | Tab |
| `\"`   | Double quote |
| `\\`   | Backslash |
| `\$`   | Dollar sign (literal `$` even in string template) |

```kotlin run
println("Name:\tSteve")
println("Line one\nLine two")
println("She said \"hello\".")
```


## Printing Multiple Values

Print several values on one line using string templates or concatenation with `+`:

```kotlin run
val firstName = "Steve"
val lastName  = "Rogers"
val age       = 25

println("$firstName $lastName, age $age")
```

?> Prefer **string templates** over `+` concatenation - they are easier to read and less error-prone.


## Formatting Numbers

For controlling how numbers are displayed, use `String.format()`:

```kotlin run
val pi   = 3.14159265
val cost = 1234.5

println("Pi to 2dp: %.2f".format(pi))
println("Cost: ${"%.2f".format(cost)}")
```

`%.2f` means format as a floating-point number with **2 decimal places**. You can use `%d` for integers and `%s` for strings.

Use `%,d` to format an integer with **comma separators** for large numbers:

```kotlin run
val population = 8200000

println("Population: ${"%,d".format(population)}")
```

This would show `8,200,000`
