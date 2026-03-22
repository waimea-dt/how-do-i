# Data Collections in Python

Collections store **multiple values in a single variable**. Python has three main types covered here:

| Type | Ordered? | Duplicates? | Changeable? |
|------|----------|-------------|-------------|
| `list`(python) | ✓ Yes | ✓ Yes | ✓ Yes |
| `tuple`(python) | ✓ Yes | ✓ Yes | ✗ Read-only |
| `dict`(python) | - | Keys unique | ✓ Yes |

> [!TIP]
> Use a `list`(python) for an ordered collection you'll modify. Use a `tuple`(python) for data that shouldn't change. Use a `dict`(python) when each value has a unique key (like a dictionary or lookup table).


## List

A `list`(python) uses square brackets `[]`(python):

```python
colours = ["Red", "Green", "Blue"]
```

Access items by **index** (starting from `0`). Negative indices count from the end:

```python
colours = ["Red", "Green", "Blue"]

print(colours[0])     # Red   - first item
print(colours[-1])    # Blue  - last item
print(len(colours))   # 3     - number of items
```

Check whether a value is **in** the list:

```python
colours = ["Red", "Green", "Blue"]

print("Green" in colours)       # True
print("Pink" in colours)        # False
print("Pink" not in colours)    # True
```


### Looping Over Lists

Loop over every item with a `for`(python) loop:

```python
fruits = ["Apple", "Banana", "Cherry"]

for fruit in fruits:
    print(fruit)
```

Loop over every item **with its index** using `enumerate()`:

```python
fruits = ["Apple", "Banana", "Cherry"]

for i, fruit in enumerate(fruits):
    print(f"{i}: {fruit}")
```


### Modifying a List

**Adding** items:

```python
names = ["Alice", "Bob"]
print(names)

names.append("Charlie")      # add at the end
print(names)

names.insert(0, "Zara")      # insert at index 0
print(names)
```

**Removing** items:

```python
names = ["Alice", "Bob", "Charlie", "Dave"]
print(names)

names.remove("Bob")          # remove by value
print(names)

names.pop(0)                 # remove by index
print(names)
```

**Updating** an item:

```python
names = ["Alice", "Bob", "Charlie"]
print(names)

names[1] = "Barbara"         # replace item at index 1
print(names)
```


## Sorting

```python
scores = [42, 7, 88, 15, 34]
print("Original:  ", scores)

scores.sort()
print("Sorted:    ", scores)      # low → high (modifies original)

scores.sort(reverse=True)
print("Descending:", scores)      # high → low
```

To get a **sorted copy** without changing the original, use `sorted()`:

```python
scores = [42, 7, 88, 15, 34]
sorted_scores = sorted(scores)

print("Original:", scores)        # unchanged
print("Sorted:  ", sorted_scores) # sorted copy
```


## Filtering with List Comprehensions

A **list comprehension** is a concise way to build a new list from an existing one:

```python
scores = [88, 7, 42, 15, 34, 91, 23]
high_scores = [s for s in scores if s >= 40]

print("Original:   ", scores)
print("High scores:", high_scores)
```

```python
names = ["Alice", "Bob", "Anna", "Charlie", "Amy"]
a_names = [name for name in names if name.startswith("A")]

print("A names:", a_names)
```

> [!TIP]
> A list comprehension `[expression for item in list if condition]`(python) replaces a `filter()`(python) call. It's the idiomatic Python way.


## Transforming with List Comprehensions

List comprehensions can also **transform** every item:

```python
names = ["alice", "bob", "charlie"]
upper = [name.upper() for name in names]

print("Original:", names)
print("Upper:   ", upper)
```

```python
prices  = [10.65, 25.05, 8.75]
with_tax = [round(p * 1.15, 2) for p in prices]

print("Prices:  ", prices)
print("With tax:", with_tax)
```


## Useful List Methods

```python
numbers = [3, 7, 2, 9, 1, 6, 4]

print("Size:       ", len(numbers))
print("Sum:        ", sum(numbers))
print("Min:        ", min(numbers))
print("Max:        ", max(numbers))
print("Average:    ", sum(numbers) / len(numbers))
print("Count >= 5: ", sum(1 for n in numbers if n >= 5))
print("Any >= 8:   ", any(n >= 8 for n in numbers))
print("All > 0:    ", all(n > 0 for n in numbers))
```


## Tuple

A `tuple`(python) uses parentheses `(...)`(python) and is **read-only** - its contents cannot be changed after creation:

```python
point    = (3, 7)
rgb      = (255, 128, 0)
weekdays = ("Mon", "Tue", "Wed", "Thu", "Fri")
```

Access items the same way as a list:

```python
print(point[0])     # 3
print(rgb[-1])      # 0
print(len(weekdays))  # 5
```

?> Use a tuple when the data is fixed and shouldn't change - coordinates, RGB colours, days of the week. It signals to any reader of the code that these values are constants.


## Dictionary (dict)

A `dict`(python) stores values as **key–value pairs** - like a real-world dictionary. Each key is unique:

```python
capitals = {
    "France":  "Paris",
    "Germany": "Berlin",
    "Japan":   "Tokyo"
}
```

Access a value by its **key**:

```python
capitals = {
    "France":  "Paris",
    "Germany": "Berlin",
    "Japan":   "Tokyo"
}

print(capitals["France"])    # Paris
print(capitals["Japan"])     # Tokyo
```

Use `.get()`(python) to avoid a `KeyError`(python) if the key may not exist - returns `None`(python) (or a default) instead of crashing:

```python
print(capitals.get("Spain"))           # None
print(capitals.get("Spain", "Unknown")) # Unknown
```

Check whether a key or value exists:

```python
print("France" in capitals)                 # True - checks keys
print("Paris" in capitals.values())         # True - checks values
```

Loop over a dictionary:

```python
capitals = {"France": "Paris", "Germany": "Berlin", "Japan": "Tokyo"}

for country, capital in capitals.items():
    print(f"{country} → {capital}")
```

### Modifying a Dictionary

```python
scores = {"Alice": 100, "Bob": 85}
print(scores)

scores["Charlie"] = 92     # add new entry
print(scores)

scores["Bob"] = 90         # update existing value
print(scores)

del scores["Alice"]        # remove an entry
print(scores)
```

### Useful Dict Methods

```python
scores = {"Alice": 100, "Bob": 85, "Charlie": 92}

print("Keys:  ", list(scores.keys()))
print("Values:", list(scores.values()))
print("Size:  ", len(scores))
```
