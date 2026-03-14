# Data Collections in Kotlin

Collections store **multiple values in a single variable**. Kotlin has three main types:

| Type | Ordered? | Duplicates Ok? | Changeable? |
|------|----------|-------------|-------------|
| `List` | ✓ Yes | ✓ Yes | ✗ Read-only |
| `MutableList` | ✓ Yes | ✓ Yes | ✓ Yes |
| `Map` | - | Keys unique | ✗ Read-only |
| `MutableMap` | - | Keys unique | ✓ Yes |

?> Use a **`List`** when the data won't change. Use a **`MutableList`** when you need to add, remove, or update items. Use a **`Map`** when each value has a unique key (like a dictionary).


## List

A `List` is **read-only** - once created, its contents cannot be changed:

```kotlin
val colours = listOf("Red", "Green", "Blue")
```

Access items by **index** (starting from `0`):

```kotlin run
val colours = listOf("Red", "Green", "Blue")

println(colours[0])       // first item, Red
println(colours.last())   // last item, Blue
println(colours.size)     // number of items, 3
```

Check whether a value is **in** the list:

```kotlin run
val colours = listOf("Red", "Green", "Blue")

println("Green" in colours)    // true
println("Pink"  in colours)    // false
println("Pink" !in colours)    // true
```

### Looping Over Lists

When using lists, it is very common that you need to **process each item** in turn, and the best way to do this is to use a **loop**...


Loop over every item with a `for` loop:

```kotlin run
val fruits = listOf("Apple", "Banana", "Cherry")

for (fruit in fruits) {
    println(fruit)
}
```

Loop over every item via an **index** with a `for` loop:

```kotlin run
val fruits = listOf("Apple", "Banana", "Cherry")

for (i in 0..<fruits.size) {
    println(fruits[i])
}
```

Loop over every item and its **index** using `forEachIndexed`:

```kotlin run
val fruits = listOf("Apple", "Banana", "Cherry")
fruits.forEachIndexed { i, fruit ->
    println("${i + 1}: $fruit")
}
```


## MutableList

A `MutableList` works like a `List` but can be **changed after creation** - items can be added, removed, or updated:

```kotlin
val scores = mutableListOf(10, 25, 8, 42, 17)
```

**Adding** items:

```kotlin run
val names = mutableListOf("Alice", "Bob")
println(names)

names.add("Charlie")     // add at the end
println(names)

names.add(0, "Zara")     // insert at index 0
println(names)
```

**Removing** items:

```kotlin run
val names = mutableListOf("Alice", "Bob", "Charlie", "Dave")
println(names)

names.remove("Bob")       // remove by value
println(names)

names.removeAt(0)         // remove by index
println(names)
```

**Updating** an item:

```kotlin run
val names = mutableListOf("Alice", "Bob", "Charlie")
println(names)

names[1] = "Barbara"      // replace item at index 1
println(names)
```

?> Start with `mutableListOf()` while building/editing a list, then consider switching to `listOf()` once the data is finalised - this makes your intent clear and prevents accidental changes.


## Sorting and Reversing

```kotlin run
val scores = mutableListOf(42, 7, 88, 15, 34)
println("Original:   $scores")

scores.sort()
println("Sorted:     $scores")     // Sorted low -> high

scores.sortDescending()
println("Descending: $scores")     // Sorted high -> low

scores.shuffle()
println("Shuffled:   $scores")     // Randomised
```

To get a sorted copy without changing the original, use `sorted()` on a regular list:

```kotlin run
val scores = listOf(42, 7, 88, 15, 34)
val sorted = scores.sorted()

println("Original: $scores")     // Unchanged
println("Sorted:   $sorted")     // Sorted copy
```


## Filtering

`filter` returns a new list containing only items that match a condition:

```kotlin run
val scores = listOf(88, 7, 42, 15, 34, 91, 23)
val highScores = scores.filter { it >= 40 }

println("Original:    $scores")        // Unchanged
println("High Scores: $highScores")    // Only high scores
```

```kotlin run
val names = listOf("Alice", "Bob", "Anna", "Charlie", "Amy")
val aNames = names.filter { it.startsWith("A") }

println("Original: $names")     // Unchanged
println("A names:  $aNames")    // Only 'A' names
```

?> `it` refers to the current item being tested - shorthand for a single-parameter lambda.


## Transforming with Map

`map` transforms every item in a list and returns a new list of the results:

```kotlin run
val names = listOf("alice", "bob", "charlie")
val upper = names.map { it.uppercase() }

println("Original: $names")    // Unchanged
println("Mapped:   $upper")    // Uppercase copy
```

```kotlin run
val prices = listOf(10.65, 25.05, 8.75)
val withTax = prices.map { "%.2f".format(it * 1.15) }

println("Prices:   $prices")     // Unchanged
println("With tax: $withTax")    // Transformed copy
```


## Useful List Methods

```kotlin run
val numbers = listOf(3, 7, 2, 9, 1, 6, 4)

println("Size:       ${numbers.size}")
println("Sum:        ${numbers.sum()}")
println("Min:        ${numbers.min()}")
println("Max:        ${numbers.max()}")
println("Average:    ${numbers.average()}")
println("Count >= 5: ${numbers.count { it >= 5 }}")
println("Any >= 8:   ${numbers.any { it >= 8 }}")
println("All > 0:    ${numbers.all { it > 0 }}")
```


## Map (Key-Value Pairs)

A `Map` stores values as **key-value pairs** - like a dictionary. Each key is unique:

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

?> Accessing a key that doesn't exist returns `null` rather than crashing. Use the Elvis operator to provide a fallback: `capitals["Spain"] ?: "Unknown"`.

Check whether a key or value exists:

```kotlin run
val capitals = mapOf(
    "France"  to "Paris",
    "Germany" to "Berlin",
    "Japan"   to "Tokyo"
)

println("France" in capitals)             // true - checks keys
println(capitals.containsValue("Paris"))  // true - checks values
```

Loop over a map using `for`:

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

## MutableMap

Use `mutableMapOf()` to create a map that can be changed:

```kotlin run
val scores = mutableMapOf(
    "Alice" to 100,
    "Bob" to 85
)
println(scores)

scores["Charlie"] = 92     // add new entry
println(scores)

scores["Bob"] = 90         // update existing value
println(scores)

scores.remove("Alice")     // remove an entry
println(scores)
```

## Useful Map Methods

```kotlin run
val scores = mutableMapOf(
    "Alice" to 100,
    "Bob" to 85,
    "Charlie" to 92
)

println("Keys:   ${scores.keys}")
println("Values: ${scores.values}")
println("Size:   ${scores.size}")
```

?> You can also use `.filter {...}` and `.map {...}` with maps
