# Lists in Kotlin

A `List`(kotlin) stores multiple values in a single variable, keeping items in a fixed order. Both types allow duplicate values.

| Type | Changeable? | Description |
|------|-------------|-------------|
| `List`(kotlin) | ✗ Read-only | Contents cannot be changed after creation |
| `MutableList`(kotlin) | ✓ Yes | Items can be added, removed, and updated |

> [!TIP]
> Use a **`List`(kotlin)** when the data won't change. Use a **`MutableList`(kotlin)** when you need to add, remove, or update items.


## List - Read-Only

A `List`(kotlin) is **read-only** - once created, its contents cannot be changed:

```kotlin
val colours = listOf("Red", "Green", "Blue")
```

The **size** of a list:

```kotlin run
val colours = listOf("Red", "Green", "Blue")

println(colours.size)     // number of items, 3
```

**Access** items by **index** (starting from `0`):

```kotlin run
val colours = listOf("Red", "Green", "Blue")

println(colours[0])       // first item, Red
println(colours[2])       // last item, Blue
```

**Access** items via list methods:

```kotlin run
val colours = listOf("Red", "Green", "Blue")

println(colours.first())  // first item, Red
println(colours.last())   // last item, Blue
```

Check whether a value is **in** the list:

```kotlin run
val colours = listOf("Red", "Green", "Blue")

println("Green" in colours)    // true
println("Pink"  in colours)    // false
println("Pink" !in colours)    // true
```

Check whether a list is **empty** using `isEmpty()`(kotlin):

```kotlin run
val colours = listOf("Red", "Green", "Blue")
val empty   = listOf<String>()

println(colours.isEmpty())    // false
println(empty.isEmpty())      // true
```


## MutableList

A `MutableList`(kotlin) works like a `List`(kotlin) but can be **changed after creation** - items can be added, removed, or updated:

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

> [!TIP]
> Start with `mutableListOf()`(kotlin) while building/editing a list, then consider switching to `listOf()`(kotlin) once the data is finalised - this makes your intent clear and prevents accidental changes.


## Looping Over Lists

Loop over every item with a `for`(kotlin) loop:

```kotlin run
val fruits = listOf("Apple", "Banana", "Cherry")

for (fruit in fruits) {
    println(fruit)
}
```

Loop over every item via an **index**:

```kotlin run
val fruits = listOf("Apple", "Banana", "Cherry")

for (i in 0..<fruits.size) {
    println(fruits[i])
}
```

Loop over every item and its **index** using `forEachIndexed`(kotlin):

```kotlin run
val fruits = listOf("Apple", "Banana", "Cherry")

fruits.forEachIndexed { i, fruit ->
    println("${i + 1}: $fruit")
}
```


## Sorting, Reversing and Randomising

Use `sort()`(kotlin), `sortDescending()`(kotlin), and `shuffle()`(kotlin) to change a `MutableList`(kotlin) **in place**:

```kotlin run
val scores = mutableListOf(42, 7, 88, 15, 34)
println("Original:    $scores")

scores.sort()
println("Sorted:      $scores")   // Sorted low → high

scores.sortDescending()
println("Descending:  $scores")   // Sorted high → low

scores.shuffle()
println("Shuffled:    $scores")   // Randomised

val pick = scores.random()
println("Random Pick: $pick")     // Randomised
```

To get a sorted or shuffled copy **without changing the original**, use `sorted()`(kotlin) and `shuffled()`(kotlin):

```kotlin run
val scores = listOf(42, 7, 88, 15, 34)
val sorted   = scores.sorted()    // sorted copy, low → high
val shuffled = scores.shuffled()  // randomised copy

println("Original: $scores")      // Unchanged
println("Sorted:   $sorted")
println("Shuffled: $shuffled")
```


## Mathematical Operations on Lists

These methods work on lists of numbers (`Int`(kotlin), `Double`(kotlin), etc.):

**`sum()`(kotlin)** - adds all items together:

```kotlin run
val prices = listOf(4.99, 12.50, 7.25)
println(prices.sum())        // 24.74
```

**`average()`(kotlin)** - returns the mean value as a `Double`(kotlin):

```kotlin run
val scores = listOf(60, 75, 90, 45)
println(scores.average())    // 67.5
```

**`min()`(kotlin) and `max()`(kotlin)** - return the smallest or largest item. They throw an exception if the list is empty:

```kotlin run
val scores = listOf(60, 75, 90, 45)
println(scores.min())        // 45
println(scores.max())        // 90
```

**`minOrNull()`(kotlin) and `maxOrNull()`(kotlin)** - same as above but return `null`(kotlin) instead of throwing if the list is empty - safer when the list might be empty:

```kotlin run
val scores = listOf(60, 75, 90, 45)
val empty  = listOf<Int>()

println(scores.minOrNull())  // 45
println(empty.minOrNull())   // null
```


## Filtering

`filter`(kotlin) returns a **new list** containing only items that match a condition:

```kotlin run
val scores = listOf(88, 7, 42, 15, 34, 91, 23)
val highScores = scores.filter { it >= 40 }

println("Original:    $scores")        // Unchanged
println("High Scores: $highScores")    // Only high scores
```

```kotlin run
val names = listOf("Alice", "Bob", "Anna", "Charlie", "Amy")
val aNames = names.filter { it.startsWith("A") }

println("Original: $names")            // Unchanged
println("A names:  $aNames")           // Only 'A' names
```

> [!NOTE]
> `it`(kotlin) refers to the current item being tested - shorthand for a single-parameter lambda.


## Checking Items with any, all, and count

These three methods test items against a condition. They use the same `{ condition }`(kotlin) syntax as `filter`(kotlin), but return a single value rather than a new list.

**`any`(kotlin)** - returns `true`(kotlin) if **at least one** item matches:

```kotlin run
val scores = listOf(45, 12, 78, 33, 91)

println(scores.any { it >= 90 })    // true  - 91 matches
println(scores.any { it > 100 })    // false - nothing matches
```

**`all`(kotlin)** - returns `true`(kotlin) only if **every** item matches:

```kotlin run
val scores = listOf(45, 12, 78, 33, 91)

println(scores.all { it > 0 })      // true  - all are positive
println(scores.all { it >= 50 })    // false - 45, 12, 33 don't match
```

**`count`(kotlin)** - returns the **number of items** that match:

```kotlin run
val scores = listOf(45, 12, 78, 33, 91)

println(scores.count { it >= 50 })     // 2  (78 and 91)
println(scores.count { it % 2 == 0 })  // 1  (only 12 is even)
```


## Transforming with map()

`map()`(kotlin) transforms every item in a list and returns a new list of the results:

```kotlin run
val names = listOf("alice", "bob", "charlie")
val upper = names.map { it.uppercase() }

println("Original: $names")     // Unchanged
println("Mapped:   $upper")     // Uppercase copy
```

```kotlin run
val prices = listOf(10.65, 25.05, 8.75)
val withTax = prices.map { "%.2f".format(it * 1.15) }

println("Prices:   $prices")    // Unchanged
println("With tax: $withTax")   // Transformed copy
```

> [!TIP]
> `map()`(kotlin) is named after the mathematical idea of mapping one set of values to another - each item is passed through the transformation and the results are collected into a new list.
