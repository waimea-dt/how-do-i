# Extension Functions

An **extension function** lets you add a new method to an existing type - without touching its source code. The result works just like a built-in method: you call it with dot notation on any value of that type.

This is one of Kotlin's most useful features for keeping code readable.


## Syntax

```kotlin
fun TypeName.functionName(parameters): ReturnType {
    // 'this' refers to the value the function is called on
}
```

For example, adding a `shout()`(kotlin) method to `String`(kotlin):

```kotlin run
fun String.shout(): String = this.uppercase() + "!!!"

println("hello".shout())          // HELLO!!!
println("quiet please".shout())   // QUIET PLEASE!!!
```

Inside the function body, `this`(kotlin) refers to the value being extended - in the example above, the `String`(kotlin) the method was called on.


## Why Use Them?

Without extension functions, you'd write utility code as standalone functions:

```kotlin
fun formatWithCommas(n: Number): String = "%,d".format(n)

println(formatWithCommas(1000000))    // 1,000,000
```

With an extension function, the same thing reads much more naturally:

```kotlin
fun Number.commas(): String = "%,d".format(this)

println(1000000.commas())    // 1,000,000
```

The logic is identical - but the second version makes the intent obvious at the call site.


## Real Examples

### `.commas()`(kotlin) - Formatting numbers with separators

Used to display large numbers readably (e.g. a score or a price). See the [working with numbers](programming/kotlin/basics/numbers.md) page for more on number formatting.

```kotlin run
fun Number.commas(): String = "%,d".format(this)

val score = 9001000
val price = 1234

println(score.commas())    // 9,001,000
println(price.commas())    // 1,234
```

`Number`(kotlin) is the common parent type of `Int`(kotlin), `Long`(kotlin), `Double`(kotlin), etc., so this works on all of them.


### `.scaled()`(kotlin) - Resizing an ImageIcon

Used when displaying images in a GUI. See the [adding images](programming/kotlin/gui/images.md) page.

```kotlin
fun ImageIcon.scaled(width: Int, height: Int): ImageIcon =
    ImageIcon(image.getScaledInstance(width, height, java.awt.Image.SCALE_SMOOTH))

// Usage:
val icon = ImageIcon(ClassLoader.getSystemResource("images/coin.png")).scaled(80, 80)
```

Without this extension, scaling an image requires three separate steps every time. The extension bundles them into a single readable call.


## Where to Put Them

Declare extension functions at the **top of the file**, before `main()`(kotlin) and any class definitions. This keeps them easy to find and available everywhere in the file:

```kotlin
import ...

// Helper extension functions
fun Number.commas(): String = "%,d".format(this)
fun ImageIcon.scaled(width: Int, height: Int): ImageIcon = ...

fun main() {
    // ...
}

class MainWindow {
    // ...
}
```

> [!NOTE]
> Extension functions don't actually modify the class - they're just syntactic sugar. Kotlin compiles them to regular static functions behind the scenes. They can only access the public members of the type they extend.

