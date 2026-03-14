# Working with Numbers

Python has two main numeric types:

| Type | Description | Example |
|------|-------------|---------|
| `int` | whole numbers | `42`, `-7`, `1000000` |
| `float` | decimal numbers | `3.14`, `-0.5`, `1.0` |

Python automatically picks the right type based on the value.


## Writing Numeric Values

```python
score     = 2000       # int - plain whole number
distance  = 4500000000 # int - Python ints can be any size
cost      = 123.45     # float - decimal point makes it a float
```

?> Unlike some other languages, Python's `int` has **no size limit** - it can hold numbers as large as your computer's memory allows.


## Arithmetic Operators

For mathematical operations:

- `+` for **addition**
- `-` for **subtraction**
- `*` for **multiplication**
- `/` for **division** (always returns a float)
- `//` for **integer division** (whole number result)
- `%` for **modulus** (remainder)
- `**` for **exponentiation** (to the power of)

```python
# Pay calculations
pay       = 3200
bonus     = 675
hours     = 160
total     = pay + bonus
pay_rate  = total / hours      # float division
tax       = total * 0.35
take_home = total - tax

print("Total pay:  ", total)
print("Pay rate:   ", pay_rate)
print("Tax to pay: ", tax)
print("Take home:  ", take_home)
```

?> In Python, `/` **always** returns a `float` - even `10 / 2` gives `5.0`. Use `//` if you want a whole number result.

Modulus example - odd or even:

```python
for number in range(1, 11):
    if number % 2 == 0:
        print(number, "Even")
    else:
        print(number, "Odd")
```

Exponentiation example:

```python
print(2 ** 10)   # 1024
print(3 ** 3)    # 27
```


## Combining with Assignment

If you're modifying a variable, there are short forms:

```python
score  = score + 100    # long form
score += 100            # short form - same thing
```

All the operators have a short form: `+=`, `-=`, `*=`, `/=`, `//=`, `**=`, `%=`

```python
score   += 100
lives   -= 1
cost    *= 2
value   /= 10
```

!> Python does **not** have `++` or `--`. Use `+= 1` and `-= 1` instead.


## Converting Between Types

Use `int()` and `float()` to convert between numeric types:

```python
x = int(3.9)      # 3  - truncates, does not round
y = float(5)      # 5.0

print(x, y)
```

Converting between numbers and strings:

```python
number = 42
text   = "100"

number_as_string = str(number)     # "42"
string_as_int    = int(text)       # 100
string_as_float  = float("3.14")  # 3.14

print(number_as_string)
print(string_as_int + 1)
print(string_as_float)
```

?> `int()` on a `float` **truncates** — it drops the decimal part without rounding. Use `round()` to round to the nearest integer instead.


## Maths Functions

Python's built-in `math` module provides common mathematical functions. Import it at the top of your file:

```python
import math
```

**Rounding and absolute value:**

```python
import math

price = 3.7489

print(round(price))        # 4     — round to nearest integer (built-in, no import needed)
print(round(price, 2))     # 3.75  — round to 2 decimal places
print(math.floor(price))   # 3     — round down
print(math.ceil(price))    # 4     — round up
print(abs(-42))            # 42    — remove negative sign (built-in)
```

?> `round()` and `abs()` are built into Python — you don't need to import `math` to use them.

**Power and roots:**

```python
import math

print(2 ** 8)           # 256    — power (no import needed)
print(math.sqrt(144))   # 12.0   — square root
```

**Min, max, and clamping:**

```python
print(min(10, 25))              # 10  — smaller of two values
print(max(10, 25))              # 25  — larger of two values
print(max(0, min(100, 150)))    # 100 — clamp to range 0–100
```

**Random numbers:**

```python
import random

print(random.randint(1, 6))          # random int: 1–6 (dice roll)
print(random.uniform(0.0, 1.0))      # random float between 0 and 1
```

?> `random.randint(a, b)` — both `a` and `b` are **inclusive**, so `randint(1, 6)` can return 1, 2, 3, 4, 5, or 6.


## Useful Maths Functions Summary

| Function | What it does |
|----------|-------------|
| `abs(n)` | Absolute value (removes negative sign) |
| `round(n)` | Round to nearest integer |
| `round(n, dp)` | Round to `dp` decimal places |
| `math.floor(n)` | Round down |
| `math.ceil(n)` | Round up |
| `math.sqrt(n)` | Square root |
| `n ** exp` | `n` to the power of `exp` |
| `min(a, b)` | Smaller of two values |
| `max(a, b)` | Larger of two values |
| `random.randint(a, b)` | Random integer between `a` and `b` (inclusive) |
| `random.uniform(a, b)` | Random float between `a` and `b` |
