# Variables and Data Types in Python

## Variable Declaration

In Python, you create a variable simply by assigning a value to a name - no keywords needed:

```python
name  = "Jimmy"
age   = 25
happy = True
score = 1000
```

> [!TIP]
> Python figures out the type automatically from the value you assign. This is called **dynamic typing** - you don't need to declare a type up front.


## Variable Types

The most common types you will use:

| Type | Description | Example |
|------|-------------|----------|
| `str`(python) | text (short for *string*) | `"Hello"`(python) |
| `int`(python) | whole numbers | `42`(python), `-7`(python) |
| `float`(python) | decimal numbers | `3.14`(python), `-0.5`(python) |
| `bool`(python) | true/false values | `True`(python), `False`(python) |

```python
name     = "Steve"       # str
year     = 2026          # int
cost     = 123.45        # float
is_alive = True          # bool
```

You can check a variable's type with `type()`(python):

```python
print(type(name))    # <class 'str'>
print(type(year))    # <class 'int'>
```


## Naming Variables

Variable names in Python should:

- Start with a **lowercase letter**
- Use **snake_case** for multiple words - words separated by underscores

✓ Well-named variables...

```python
first_name = "Steve"
years_old  = 10
birth_place = "London"
likes_cats  = True
```

✗ Badly-named variables...

```python
firstname = "Steve"      # Hard to read multiple words
YearsOld = 10            # Capital letter at start
birthPlace = "London"    # camelCase (that's for other languages)
likes cats = True        # Can't have spaces
```

> [!NOTE]
> Python variables can hold `None`(python) - Python's equivalent of "no value". Unlike some other languages, Python doesn't stop you accidentally using `None`(python) where a real value was expected, so it's worth checking for it when a function might not return a result.


## Reassigning Variables

You can change a variable's value at any time - Python even lets you change its type:

```python
score = 0
score = 100          # now 100

score = "winner"     # now a str - Python allows this, but it's usually a bad idea!
```

> [!TIP]
> Avoid changing a variable's type mid-program. It's technically valid, but makes code confusing and prone to bugs.


## Variable Scope

**Scope** determines where in your code a variable can be accessed. In Python, scope is closely tied to **functions** - a variable created inside a function is local to it and cannot be accessed outside.

### Local Variables

A variable created inside a function is **local** - it only exists while that function is running:

```python
def greet():
    message = "Hello!"   # local to greet()
    print(message)

greet()
# print(message)   # ✗ NameError - 'message' doesn't exist here
```

### Global Variables

A variable created **outside all functions** is a **global** variable - it can be read from anywhere in the file:

```python
max_score = 100     # global - visible everywhere

def show_score(score):
    print(f"Score: {score} / {max_score}")   # ✓ can read max_score

show_score(72)
```

### Blocks Don't Create Scope

Unlike many other languages, `if`(python) blocks, `for`(python) loops, and `while`(python) loops do **not** create their own scope. A variable created inside one of these blocks is accessible in the surrounding code - but only if that block actually ran:

```python
score = 85

if score >= 50:
    result = "Passed"    # created inside the if block

print(result)            # ✓ works - result was set when the if ran
```

> [!IMPORTANT]
> If the block never runs, the variable is never created and accessing it will cause a `NameError`:

```python
score = 30

if score >= 50:
    result = "Passed"    # this block never runs

print(result)            # ✗ NameError - result was never assigned
```

To avoid this, assign a default value **before** the block:

```python
result = "Failed"        # default value

if score >= 50:
    result = "Passed"    # overwritten if condition is met

print(result)            # ✓ always safe
```

> [!TIP]
> See the [Code Blocks](programming/python/basics/blocks.md) page for more on how indentation defines blocks in Python.
