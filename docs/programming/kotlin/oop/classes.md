# Creating Classes in Kotlin

## Defining a Class

Use the `class` keyword followed by the class name:

```kotlin
class Wizard {
    // ...
}
```

Class names should:
- Start with an **uppercase letter**
- Use **PascalCase** for multiple words (each word capitalised)

✓ Well-named classes...

```kotlin
class Wizard
class BankAccount
class PlayerCharacter
```

✗ Badly-named classes...

```kotlin
class wizard          // Lowercase start
class bankAccount     // camelCase (that's for variables)
class bank_account    // Underscores
```


## Properties

Properties are the **variables** that belong to a class - they store the object's **state**.

The easiest way to define them is in the **primary constructor** - the `()` after the class name:

```kotlin
class Wizard(val name: String, var mana: Int)
```

These are passed in when you create an object:

```kotlin run
class Wizard(val name: String, var mana: Int)


fun main() {
    val myWizard = Wizard("Gandalf", 100)

    println(myWizard.name)     // Gandalf
    println(myWizard.mana)     // 100
}
```

### Internal Properties

Properties can also be defined **inside the class body**. These aren't passed in - they have a default value:

```kotlin run
class Wizard(val name: String, var mana: Int) {

    var level = 1           // All wizards start at level 1
}


fun main() {
    val myWizard = Wizard("Gandalf", 100)

    myWizard.level = 5      // Updating the internal property

    println("${myWizard.name} is level ${myWizard.level}!")
}
```


## The `init` Block

The `init` block runs automatically when an object is created. Use it for setup code:

```kotlin run
class Wizard(val name: String, var mana: Int) {

    init {
        println("$name the Wizard has entered the realm!")
    }
}


fun main() {
    val wizard1 = Wizard("Gandalf", 100)
    val wizard2 = Wizard("Merlin",   80)
}
```

?> `init` is useful for **validating data** too - for example, checking that mana isn't negative when the object is created.


## Methods

Methods are **functions** that belong to a class - they define what an object can **do**.

```kotlin run
class Wizard(val name: String, var mana: Int) {

    var spellsCast = 0

    fun castSpell(spell: String) {
        spellsCast++
        mana -= 10
        println("$name casts $spell! (mana left: $mana)")
    }

    fun describe() {
        println("$name has cast $spellsCast spell(s) and has $mana mana remaining")
    }
}


fun main() {
    val myWizard = Wizard("Gandalf", 100)

    myWizard.castSpell("Fireball")
    myWizard.castSpell("Ice Storm")

    myWizard.describe()
}
```

Methods can accept parameters and return values, exactly like regular functions:

```kotlin run
class Rectangle(val width: Double, val height: Double) {

    fun area(): Double {
        return width * height
    }

    fun perimeter(): Double {
        return 2 * (width + height)
    }
}


fun main() {
    val room = Rectangle(4.5, 6.0)

    println("Area:      ${room.area()} m²")
    println("Perimeter: ${room.perimeter()} m")
}
```


## `private` Properties and Methods

By default, properties and methods can be accessed from **anywhere**. Mark them `private` to restrict access to **inside the class only**:

```kotlin run
class Account(val owner: String) {

    private var balance = 0    // hidden - can't be accessed from outside

    fun deposit(amount: Int) {
        println("$owner depositing $amount...")
        balance += amount
        println("Balance: $balance")
    }

    fun withdraw(amount: Int) {
        println("$owner withdrawing $amount...")

        if (amount > balance) {
            println("Insufficient funds!")
            return
        }

        balance -= amount
        println("Balance: $balance")
    }
}


fun main() {
    val account = Account("Alice")  // Create new account

    account.deposit(500)            // Now have $500
    account.withdraw(120)           // Now have $380

    account.balance = 99999         // Error as private
}
```

?> Making `balance` private means the only way to change it is through `deposit()` and `withdraw()`. No code outside the class can set it to an arbitrary value - this is **encapsulation** in action.


## Data Classes

A **data class** is a special class designed purely to hold data. Add the `data` keyword before `class`:

```kotlin
data class Point(val x: Int, val y: Int)
```

Data classes automatically get some useful extras:
- **Readable printing** - `println()` shows the actual values, not a memory address
- **Equality** - two objects with identical values are considered equal with `==`
- **Copying** - use `.copy()` to make a modified copy

```kotlin run
data class Point(val x: Int, val y: Int)

fun main() {
    val p1 = Point(3, 7)
    val p2 = Point(3, 7)
    val p3 = p1.copy(y = 10)    // Same x, new y

    println(p1)             // Point(x=3, y=7)
    println(p1 == p2)       // true - same values
    println(p3)             // Point(x=3, y=10)
}
```

?> Use a **data class** when the object is just a container for data (coordinates, records, settings). Use a regular **class** when the object manages behaviour (like a `BankAccount` or `Wizard`).

