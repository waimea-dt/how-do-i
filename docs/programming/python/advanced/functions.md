# Functions in Python

A **function** is a named, reusable block of code that performs a specific task.

Instead of writing the same code in multiple places, you write it once as a function and **call** it whenever you need it.

```python
def greet():
    print("Hello!")
```

To run a function, **call** it by name:

```python
greet()
greet()
greet()
```

?> In Python, functions are defined with the `def` keyword. The body must be indented.


## Why Use Functions?

Functions make your code:

- **Easier to read** - a well-named function says exactly what it does
- **Easier to maintain** - fix a bug once, in one place, rather than in several
- **Reusable** - write once, call many times
- **Easier to test** - small, focused functions are simpler to check

✗ Without functions - repetitive, hard to maintain:

```python
print("=== Receipt ===")
print("Item 1: $4.50")
print("===============")
print()
print("=== Receipt ===")
print("Item 2: $12.00")
print("===============")
print()
print("=== Receipt ===")
print("Item 3: $7.50")
print("===============")
```

✓ With a function - clean, reusable and easy to maintain:

```python
def print_receipt(item, price):
    print("=== Receipt ===")
    print(f"{item}: ${price:.2f}")
    print("===============")
    print()

print_receipt("Item 1", 4.50)
print_receipt("Item 2", 12.00)
print_receipt("Item 3", 7.50)
```


## Function Names

Function names follow the same rules as variable names:

- Start with a **lowercase letter**
- Use **snake_case** for multiple words
- Use a **verb** (action word) to describe what the function does

✓ Well-named functions:

```python
def calculate_tax():
def print_receipt():
def is_valid_age():
def get_user_input():
```

✗ Badly-named functions:

```python
def Tax():           # capital letter at start
def stuff():         # vague - says nothing useful
def calculate():     # too vague - calculate what?
def myFunction():    # wrong convention for Python
```


## Parameters

**Parameters** let you pass values into a function so it can work with different data each time it is called.

```python
def greet(name):
    print(f"Hello, {name}!")
```

Call the function by passing in a value - called an **argument**:

```python
greet("Alice")
greet("Bob")
greet("Charlie")
```

A function can have **multiple parameters**, separated by commas:

```python
def describe(name, age, city):
    print(f"{name} is {age} years old and lives in {city}.")

describe("Alice", 16, "Auckland")
describe("Bob",   14, "Wellington")
```

?> The terms **parameter** and **argument** are often used interchangeably. Strictly, a *parameter* is the variable in the function definition, and an *argument* is the actual value passed when calling it.


## Default Parameter Values

Parameters can have **default values** - used when no argument is provided:

```python
def greet(name, greeting="Hello"):
    print(f"{greeting}, {name}!")

greet("Alice")                  # uses default greeting
greet("Bob", "Good morning")    # uses custom greeting
```


## Return Values

A function can **return** a value back to the caller using the `return` keyword:

```python
def add(a, b):
    return a + b
```

The returned value can be stored in a variable or used directly:

```python
result = add(10, 25)
print(f"10 + 25 = {result}")

print(f"10 + 25 = {add(10, 25)}")    # used directly
```

A more realistic example - calculating total price with tax:

```python
def total_with_tax(price, tax_rate):
    return price + (price * tax_rate)

total = total_with_tax(49.99, 0.15)
print(f"Total: £{total:.2f}")
```

?> If a function doesn't return anything, Python implicitly returns `None`. You can just leave out the `return` statement.


## Single-Expression Functions (Lambda)

For very short, single-expression functions, Python has **lambda functions**:

```python
add    = lambda a, b: a + b
square = lambda n: n * n

print(add(3, 4))      # 7
print(square(5))      # 25
```

?> Lambdas are handy for short throwaway functions, but for anything with a name you'll reuse, a regular `def` is clearer.


## Putting It Together

A simple example combining everything - functions that validate and grade a score:

```python
def is_valid_score(score):
    return 0 <= score <= 100

def grade(score):
    if score >= 90:
        return "Excellence"
    elif score >= 75:
        return "Merit"
    elif score >= 60:
        return "Achieved"
    else:
        return "Not Achieved"

scores = [95, 74, 60, 45, 110, 13, 67]

for score in scores:
    if is_valid_score(score):
        print(f"Score {score} → {grade(score)}")
    else:
        print(f"Score {score} → Invalid")
```
