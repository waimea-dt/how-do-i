# Error Handling in Python

## Exceptions

When something goes wrong at runtime - dividing by zero, converting invalid input, opening a missing file - Python raises an **exception** and the program crashes unless you handle it.

```python
age = int("banana")    # ValueError: invalid literal for int()
```

Python's tool for handling exceptions is `try/except`.


## try / except

Wrap code that might fail in a `try` block. If an exception occurs, Python jumps to the `except` block instead of crashing:

```python
try:
    age = int(input("Enter your age: "))
    print(f"In 10 years you will be {age + 10}.")
except ValueError:
    print("That's not a valid number!")
```

?> Always catch a **specific** exception type rather than catching everything blindly - it makes bugs much easier to find.

Common exception types:

| Exception | Cause |
|-----------|-------|
| `ValueError` | Wrong value type (e.g. `int("abc")`) |
| `ZeroDivisionError` | Dividing by zero |
| `IndexError` | List index out of range |
| `KeyError` | Dictionary key doesn't exist |
| `FileNotFoundError` | File doesn't exist |
| `TypeError` | Wrong type used in an operation |


## Validating Text Input

A common pattern - keep asking until the user gives a non-empty response:

```python
while True:
    text = input("Enter some text: ").strip()
    if text:
        break
    print("INVALID - please enter something.\n")

print(f"VALID. You entered: {text}")
```

?> An empty string is **falsy** in Python - `if text:` is `True` only when the string is non-empty. This is the idiomatic Python way to check for a non-blank value.


## Validating Numeric Input

Keep asking until the user gives a valid number:

```python
while True:
    try:
        value = int(input("Enter a number: "))
        break
    except ValueError:
        print("INVALID - please enter a whole number.\n")

print(f"VALID. You entered: {value}")
```

You can extend this to also check a **range**:

```python
while True:
    try:
        value = int(input("Enter a number (1-10): "))
        if 1 <= value <= 10:
            break
        print("INVALID - must be between 1 and 10.\n")
    except ValueError:
        print("INVALID - please enter a whole number.\n")

print(f"VALID. You entered: {value}")
```


## Validating a Menu Choice

For a text menu where the user picks from a fixed set of options:

```python
print("Option [A]")
print("Option [B]")
print("Option [C]")
print()

while True:
    choice = input("Choice: ").strip().upper()
    if choice in ("A", "B", "C"):
        break
    print("INVALID - choose A, B or C.\n")

print(f"VALID. You chose: {choice}")
```


## else and finally

`try/except` can also have optional `else` and `finally` blocks:

- `else` - runs if **no exception** occurred
- `finally` - runs **always**, whether or not an exception occurred (useful for clean-up)

```python
try:
    value = int(input("Enter a number: "))
except ValueError:
    print("Not a valid number.")
else:
    print(f"Got it: {value}")
finally:
    print("Done.")    # always runs
```
