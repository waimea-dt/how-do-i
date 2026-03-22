# Instantiating Objects from Classes in Kotlin

**Instantiation** is just the process of creating an object from a class. The class is the blueprint - the object is the real thing.

## Creating an Object

To create an object, write the class name followed by `()`(kotlin), and store it in a variable:

```kotlin
val gandalf = Wizard("Gandalf", 100)
```

The values in `()`(kotlin) are passed into the class constructor as properties.

```kotlin run
class Wizard(val name: String, var mana: Int)


fun main() {
    val gandalf = Wizard("Gandalf", 100)
    val merlin  = Wizard("Merlin",   80)

    println(gandalf.name)   // Gandalf
    println(merlin.mana)    // 80
}
```

Each object you create is **completely independent** - changing the properties of one doesn't affect the other.


## Updating Properties

Properties declared with `var`(kotlin) can be updated after creation using `.`(kotlin):

```kotlin run
class Wizard(val name: String, var mana: Int)


fun main() {
    val gandalf = Wizard("Gandalf", 100)

    println("Mana before: ${gandalf.mana}")
    gandalf.mana -= 30
    println("Mana after:  ${gandalf.mana}")
}
```

> [!NOTE]
> Properties declared with `val`(kotlin) are fixed and cannot be changed after the object is created.


## Creating Multiple Objects

You can create as many objects as you like from the same class - for example, a whole party of adventurers:

```kotlin run
class Hero(val name: String, val role: String, var health: Int)


fun main() {
    val party = listOf(
        Hero("Aria",    "Ranger",  90),
        Hero("Borin",   "Warrior", 120),
        Hero("Sylvara", "Wizard",  70)
    )

    for (hero in party) {
        println("${hero.name} (${hero.role}) - HP: ${hero.health}")
    }
}
```


## Objects as Properties

An object's properties don't have to be simple values like `Int`(kotlin) or `String`(kotlin) - they can hold references to **other objects** too.

This is how you model real relationships: a `Hero`(kotlin) carries a `Weapon`(kotlin), a `Dungeon`(kotlin) contains a `Monster`(kotlin), and so on.

```kotlin run
class Weapon(val name: String, val damage: Int)


class Hero(val name: String, val weapon: Weapon) {

    fun attack(target: String) {
        println("${name} attacks ${target} with ${weapon.name} for ${weapon.damage} damage!")
    }
}


fun main() {
    val sword  = Weapon("Excalibur", 45)
    val hero   = Hero("Arthur", sword)

    hero.attack("Dragon")
}
```

Notice that `weapon`(kotlin) is a property of `Hero`(kotlin), and it holds a reference to a full `Weapon`(kotlin) object - so `hero.weapon.name`(kotlin) and `hero.weapon.damage`(kotlin) both work.


## Building Up a Scene

Objects referencing other objects lets you build up a whole scene naturally:

```kotlin run
class Spell(val name: String, val manaCost: Int, val damage: Int)


class Wizard(val name: String, var mana: Int) {

    fun cast(spell: Spell, target: String) {
        if (mana < spell.manaCost) {
            println("${name} doesn't have enough mana to cast ${spell.name}!")
        }
        else {
            mana -= spell.manaCost
            println("${name} casts ${spell.name} on ${target} for ${spell.damage} damage! (mana left: ${mana})")
        }
    }
}


fun main() {
    val fireball  = Spell("Fireball",  20, 50)
    val iceStorm  = Spell("Ice Storm", 35, 80)

    val gandalf = Wizard("Gandalf", 60)

    gandalf.cast(fireball, "Orc")
    gandalf.cast(iceStorm, "Dragon")
    gandalf.cast(iceStorm, "Troll")    // not enough mana
}
```

> [!NOTE]
> The `Wizard`(kotlin) doesn't store the spell data itself - it just receives a `Spell`(kotlin) object and uses it. This keeps each class small and focused on its own job.

