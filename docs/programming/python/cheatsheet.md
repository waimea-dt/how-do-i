# Python Cheatsheet

## Variables

```python
name  = "Gandalf"    # no keyword needed - just assign
score = 0
```

**Types:** `str`(python), `int`(python), `float`(python), `bool`(python)

```python
name     = "Steve"       # str
year     = 2026          # int
cost     = 9.99          # float
is_alive = True          # bool
```

> [!TIP]
> Boolean names should read as questions: `is_alive`(python), `has_key`(python), `can_fly`(python)

```python
# type() checks the type of a value
print(type(name))    # <class 'str'>

# None - Python's "no value"
result = None
```


## Output

```python
print("Hello, world!")           # print + newline
print()                          # blank line
print("Hello", "world")          # multiple values, space-separated

name = "Steve"
score = 1200
print(f"{name} scored {score}")          # f-string (preferred)
print(f"Double: {score * 2}")            # expression in f-string
print(f"Pi: {3.14159:.2f}")             # 2 decimal places
print(f"Cost: £{cost:,.2f}")            # comma separator + 2dp

print("Loading...", end="")      # no newline at end
print("A", "B", "C", sep=", ")  # custom separator
```


## Input

```python
name  = input("Enter name: ")        # always returns str
age   = int(input("Enter age: "))    # convert to int
price = float(input("Price: "))      # convert to float
```


## Numbers

```python
a = 10 + 3    # 13    addition
b = 10 - 3    # 7     subtraction
c = 10 * 3    # 30    multiplication
d = 10 / 3    # 3.33  always float
e = 10 // 3   # 3     integer division (truncates)
f = 10 % 3    # 1     remainder (modulus)
g = 2 ** 8    # 256   exponentiation

score += 100  # shorthand - score = score + 100
# also: -=  *=  /=  //=  **=  %=
# Note: Python has no ++ or --
```

**Type conversion:**

```python
int(3.9)        # 3     (truncates, not rounds)
float(5)        # 5.0
str(42)         # "42"
int("100")      # 100
float("3.14")   # 3.14
```

**Maths (`math` module):**

```python
import math
import random

round(3.7)           # 4      (built-in, no import needed)
round(3.7489, 2)     # 3.75
abs(-5)              # 5      (built-in)
math.floor(3.7)      # 3
math.ceil(3.2)       # 4
math.sqrt(144)       # 12.0
min(4, 9)            # 4      (built-in)
max(4, 9)            # 9      (built-in)
max(0, min(100, n))  # clamp n to 0–100

random.randint(1, 6)          # random int: 1–6 (both inclusive)
random.uniform(0.0, 1.0)      # random float: 0.0–1.0
```


## Text (Strings)

```python
s = "Python"

len(s)                # 6
s[0]                  # 'P'   (first char)
s[-1]                 # 'n'   (last char)
s[0:3]                # 'Pyt' (slice: start to end-1)
s[:3]                 # 'Pyt' (from start)
s[3:]                 # 'hon' (to end)

s.upper()             # "PYTHON"
s.lower()             # "python"
s.strip()             # remove surrounding whitespace
s.lstrip()            # remove leading whitespace only
s.rstrip()            # remove trailing whitespace only
s.replace("P", "J")  # "Jython"
s.split(",")          # split into list on separator
s.startswith("Py")    # True
s.endswith("on")      # True
s.find("th")          # 2    (index of first match, or -1)
"th" in s             # True
"th" not in s         # False
```


## Branching

```python
if score >= 50:
    print("Passed")
elif score >= 40:
    print("Nearly")
else:
    print("Failed")
```

**`match`(python) - cleaner for multiple exact values (Python 3.10+):**

```python
match day:
    case 1:
        print("Monday")
    case 2:
        print("Tuesday")
    case 6 | 7:             # multiple values
        print("Weekend")
    case _:                 # default
        print("Weekday")

# match with conditions (guards)
match score:
    case s if s >= 90:
        print("Excellence")
    case s if s >= 75:
        print("Merit")
    case _:
        print("Achieved")
```


## Logic

```python
# Comparison operators
==   !=   >   >=   <   <=

# Boolean operators (plain English in Python)
and  # both must be true
or   # at least one must be true
not  # reverses the value

# Membership
score in range(1, 101)    # True if 1 ≤ score ≤ 100
item not in my_list       # True if not in list
```


## Loops

```python
# for over a range
for i in range(5):          # 0 1 2 3 4
for i in range(1, 6):       # 1 2 3 4 5
for i in range(0, 11, 2):   # 0 2 4 6 8 10
for i in range(10, 0, -1):  # 10 9 8 7 6 5 4 3 2 1

# for over a list (by value)
for item in items:
    print(item)

# for over a list (by index and value)
for i, item in enumerate(items):
    print(f"{i}: {item}")

# repeat a fixed number of times
for _ in range(3):
    print("Loading...")

# while
while lives > 0:
    lives -= 1

# break and continue
for n in numbers:
    if n == 0: continue    # skip this item
    if n < 0:  break       # exit loop
```


## Functions

```python
def greet(name):
    print(f"Hello, {name}!")

# with return value
def add(a, b):
    return a + b

# with type hints (recommended)
def greet(name: str) -> None:
    print(f"Hello, {name}!")

def add(a: int, b: int) -> int:
    return a + b

# default parameter values
def greet(name: str, greeting: str = "Hello") -> None:
    print(f"{greeting}, {name}!")

# lambda - single-expression shorthand
double = lambda n: n * 2
```


## Collections

```python
# list - ordered, mutable
colours = ["Red", "Green", "Blue"]
colours[0]              # "Red"
colours[-1]             # "Blue"
len(colours)            # 3
"Green" in colours      # True

colours.append("Pink")       # add at end
colours.insert(0, "Black")   # insert at index
colours.remove("Green")      # remove by value
colours.pop(0)               # remove by index
colours[1] = "Yellow"        # update

colours.sort()                      # sort ascending (in place)
colours.sort(reverse=True)         # sort descending (in place)
sorted_copy = sorted(colours)      # sorted copy, original unchanged

# tuple - ordered, immutable
point = (3, 7)
point[0]                # 3   (read-only, no add/remove)

# dict - key/value pairs
player = {"name": "Steve", "score": 0}
player["score"] = 100        # update
player["level"] = 5          # add new key
del player["level"]          # remove key
"name" in player             # True
```

**Useful list functions:**

```python
numbers = [3, 7, 2, 9, 1]

len(numbers)                          # 5
sum(numbers)                          # 22
min(numbers)                          # 1
max(numbers)                          # 9
any(n > 8 for n in numbers)           # True
all(n > 0 for n in numbers)           # True
sum(1 for n in numbers if n > 5)      # 2  (count matching)
```

**List comprehensions:**

```python
# filter
high = [s for s in scores if s >= 40]

# transform
upper = [name.upper() for name in names]

# filter + transform
big_upper = [name.upper() for name in names if len(name) > 3]
```


## Error Handling

```python
try:
    value = int(input("Enter a number: "))
    print(f"Got: {value}")
except ValueError:
    print("That's not a valid number!")
else:
    print("Success!")     # runs only if no exception
finally:
    print("Done.")        # always runs
```

**Common exceptions:** `ValueError`(python), `ZeroDivisionError`(python), `IndexError`(python), `KeyError`(python), `FileNotFoundError`(python), `TypeError`(python)

**Input validation patterns:**

```python
# validate text
while True:
    text = input("Enter text: ").strip()
    if text: break
    print("INVALID\n")

# validate number
while True:
    try:
        value = int(input("Enter a number: "))
        break
    except ValueError:
        print("INVALID\n")

# validate range
while True:
    try:
        value = int(input("Enter 1-10: "))
        if 1 <= value <= 10: break
        print("INVALID - must be 1 to 10\n")
    except ValueError:
        print("INVALID\n")

# validate menu choice
while True:
    choice = input("Choice [A/B/C]: ").strip().upper()
    if choice in ("A", "B", "C"): break
    print("INVALID\n")
```


## Classes & OOP

```python
class Wizard:

    def __init__(self, name: str, mana: int) -> None:
        self.name        = name
        self.mana        = mana
        self.spells_cast = 0          # internal attribute

    def cast_spell(self, spell: str) -> None:
        self.mana -= 10
        self.spells_cast += 1
        print(f"{self.name} casts {spell}! (mana: {self.mana})")

    def __str__(self) -> str:
        return f"Wizard({self.name}, mana={self.mana})"


# create objects
gandalf = Wizard("Gandalf", 100)
merlin  = Wizard("Merlin",   80)

gandalf.cast_spell("Fireball")
print(gandalf.name)     # attribute access
print(gandalf)          # calls __str__
```

**`_`(python) prefix signals private (by convention):**

```python
class Account:
    def __init__(self, owner: str) -> None:
        self.owner    = owner
        self._balance = 0       # `_` = don't access directly from outside
```


## Comments

```python
# single-line comment

# multi-line - use multiple # lines
# like this

def greet(name: str) -> str:
    """Return a greeting for the given name."""
    return f"Hello, {name}!"

def calculate_tax(income: float, rate: float = 0.33) -> float:
    """
    Calculate tax owed on the given income.

    Uses a flat rate by default.
    """
    return income * rate
```
