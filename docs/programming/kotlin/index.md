# The Kotlin Programming Language

```kotlin
fun main() {
    println("Hello, World!")

    val name = "Dave"
    val age = 21
    val nice = true
    println("Hello, ${name}!")
    println("You are ${if (nice) "nice and " else ""}")
    println("$age years old")

    when (name) {
        "Dave" -> println("Yo!")
        null -> println("???")
        else -> println("Boo!")
    }
}

class Test(val one: String, two: Int) {
    init {
        println("Boom!")
    }

    fun go(three: Int = 5): Char {
        return three.toChar()
    }
}
```
