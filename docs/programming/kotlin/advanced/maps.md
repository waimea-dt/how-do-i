# Maps in Kotlin

A `Map`(kotlin) stores values as **key-value pairs** - like a dictionary. Each key is unique and is used to look up its associated value.

| Type | Changeable? | Description |
|------|-------------|-------------|
| `Map`(kotlin) | ✗ Read-only | Contents cannot be changed after creation |
| `MutableMap`(kotlin) | ✓ Yes | Entries can be added, updated, and removed |

> [!TIP]
> Use a **`Map`(kotlin)** when each value has a unique key (like a dictionary or lookup table).


## Map - Read-Only

Create a read-only map with `mapOf()`(kotlin), using `to`(kotlin) to pair each key with its value:

```kotlin
val capitals = mapOf(
    "France"  to "Paris",
    "Germany" to "Berlin",
    "Japan"   to "Tokyo"
)
```

Access a value by its **key**:

```kotlin run
val capitals = mapOf(
    "France"  to "Paris",
    "Germany" to "Berlin",
    "Japan"   to "Tokyo"
)

println(capitals["France"])    // Paris
println(capitals["Japan"])     // Tokyo
```

> [!TIP]
> Accessing a key that doesn't exist returns `null`(kotlin) rather than crashing. Use the Elvis operator to provide a fallback: `capitals["Spain"] ?: "Unknown"`(kotlin).

Check whether a **key** or **value** exists:

```kotlin run
val capitals = mapOf(
    "France"  to "Paris",
    "Germany" to "Berlin",
    "Japan"   to "Tokyo"
)

println("France" in capitals)             // true - checks keys
println(capitals.containsValue("Paris"))  // true - checks values
```


## MutableMap

Use `mutableMapOf()`(kotlin) to create a map that can be changed after creation:

```kotlin run
val scores = mutableMapOf(
    "Alice" to 100,
    "Bob"   to 85
)
println(scores)

scores["Charlie"] = 92     // add new entry
println(scores)

scores["Bob"] = 90         // update existing value
println(scores)

scores.remove("Alice")     // remove an entry
println(scores)
```

### Keys, Values, and Size

```kotlin run
val scores = mutableMapOf(
    "Alice"   to 100,
    "Bob"     to 85,
    "Charlie" to 92
)

println(scores.keys)      // all keys
println(scores.values)    // all values
println(scores.size)      // number of entries
```

### Looping Over a Map

Loop over every key-value pair using `for`(kotlin):

```kotlin run
val capitals = mapOf(
    "France"  to "Paris",
    "Germany" to "Berlin",
    "Japan"   to "Tokyo"
)

for ((country, capital) in capitals) {
    println("$country → $capital")
}
```
