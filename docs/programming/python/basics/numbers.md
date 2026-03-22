# Working with Numbers

Python has two main numeric types:

| Type | Description | Example |
|------|-------------|----------|
| `int`(python) | whole numbers | `42`(python), `-7`(python), `1000000`(python) |
| `float`(python) | decimal numbers | `3.14`(python), `-0.5`(python), `1.0`(python) |

Python automatically picks the right type based on the value.


## Writing Numeric Values

```python
score     = 2000        # int - plain whole number
distance  = 4_500_000  # int - underscores improve readability (ignored by Python)
cost      = 123.45      # float - decimal point makes it a float
```

> [!TIP]
> Underscores can be placed anywhere in a numeric literal to make large numbers easier to read - they are ignored by Python. `4_500_000`(python) is identical to `4500000`(python).


## Arithmetic Operators

For mathematical operations:

| Operator | Meaning | Example | Result |
|----------|---------|---------|--------|
| `+`(python) | addition | `5 + 3`(python) | `8`(python) |
| `-`(python) | subtraction | `5 - 3`(python) | `2`(python) |
| `*`(python) | multiplication | `5 * 3`(python) | `15`(python) |
| `/`(python) | division (always float) | `10 / 3`(python) | `3.33...`(python) |
| `//`(python) | integer division | `10 // 3`(python) | `3`(python) |
| `%`(python) | modulus (remainder) | `10 % 3`(python) | `1`(python) |
| `**`(python) | exponentiation | `2 ** 8`(python) | `256`(python) |

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

> [!NOTE]
> In Python, `/`(python) **always** returns a `float`(python) - even `10 / 2`(python) gives `5.0`(python). Use `//`(python) if you want a whole number result.

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

> [!IMPORTANT]
> Python does **not** have `++` or `--`. Use `+= 1` and `-= 1` instead.


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

> [!NOTE]
> `int()`(python) on a `float`(python) **truncates** - it drops the decimal part without rounding. Use `round()`(python) to round to the nearest integer instead.


## Maths Functions

Python's built-in `math` module provides common mathematical functions. Import it at the top of your file:

```python
import math
```

**Rounding and absolute value:**

```python
import math

price = 3.7489

print(round(price))        # 4     - round to nearest integer (built-in, no import needed)
print(round(price, 2))     # 3.75  - round to 2 decimal places
print(math.floor(price))   # 3     - round down
print(math.ceil(price))    # 4     - round up
print(abs(-42))            # 42    - remove negative sign (built-in)
```

> [!TIP]
> `round()`(python) and `abs()`(python) are built into Python - you don't need to import `math`(python) to use them.

**Power and roots:**

```python
import math

print(2 ** 8)           # 256    - power (no import needed)
print(math.sqrt(144))   # 12.0   - square root
```

**Min, max, and clamping:**

```python
print(min(10, 25))              # 10  - smaller of two values
print(max(10, 25))              # 25  - larger of two values
print(max(0, min(100, 150)))    # 100 - clamp to range 0–100
```

**Random numbers:**

```python
import random

print(random.randint(1, 6))          # random int: 1–6 (dice roll)
print(random.uniform(0.0, 1.0))      # random float between 0 and 1
```

> [!NOTE]
> `random.randint(a, b)`(python) - both `a`(python) and `b`(python) are **inclusive**, so `randint(1, 6)`(python) can return 1, 2, 3, 4, 5, or 6.


## Useful Maths Functions Summary

| Function | What it does |
|----------|-------------|
| `abs(n)`(python) | Absolute value (removes negative sign) |
| `round(n)`(python) | Round to nearest integer |
| `round(n, dp)`(python) | Round to `dp`(python) decimal places |
| `math.floor(n)`(python) | Round down |
| `math.ceil(n)`(python) | Round up |
| `math.sqrt(n)`(python) | Square root |
| `n ** exp`(python) | `n`(python) to the power of `exp`(python) |
| `min(a, b)`(python) | Smaller of two values |
| `max(a, b)`(python) | Larger of two values |
| `random.randint(a, b)`(python) | Random integer between `a`(python) and `b`(python) (inclusive) |
| `random.uniform(a, b)`(python) | Random float between `a`(python) and `b`(python) |
