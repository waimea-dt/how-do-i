# Branching / Decisions in Python

Branching lets your program **make decisions** - running different blocks of code depending on whether a condition is `True` or `False`.

> [!NOTE]
> Conditions are built using **comparison** and **logical operators** - see the [Conditional Logic](programming/python/basics/logic.md) page for a full reference.

> [!NOTE]
> In Python, **indentation matters** - the block of code inside an `if`(python) statement must be indented (usually 4 spaces). There are no `{}`(python) braces like in other languages.


## If Statement

Only run a block of code if a condition is `True`:

```python
if condition:
    # code runs if condition is true
```

For example:

```python
score = 85

if score >= 50:
    print("You passed!")
```


## If...Else Statement

Run one block if a condition is `True`, or a different block if it is `False`:

```python
if condition:
    # runs if true
else:
    # runs if false
```

For example:

```python
lives = 0

if lives > 0:
    print("Keep playing!")
else:
    print("Game over!")
```


## If...Elif...Else Statement

Check multiple conditions in sequence - the first one that is `True` wins. Python uses `elif` (short for *else if*):

```python
if condition1:
    # runs if condition1 is true
elif condition2:
    # runs if condition2 is true
else:
    # runs if no condition matched
```

For example:

```python
score = 72

if score >= 90:
    print("Excellence")
elif score >= 75:
    print("Merit")
elif score >= 60:
    print("Achieved")
else:
    print("Not Achieved")
```


## Match Statement

Python 3.10 introduced `match`(python) - similar to a `when` in Kotlin or a `switch` in other languages. It compares a value against multiple options:

```python
match variable:
    case value1:
        # runs if variable == value1
    case value2:
        # runs if variable == value2
    case _:
        # runs if nothing matched (the default)
```

For example:

```python
day = 3

match day:
    case 1:
        print("Monday")
    case 2:
        print("Tuesday")
    case 3:
        print("Wednesday")
    case 4:
        print("Thursday")
    case 5:
        print("Friday")
    case 6 | 7:
        print("Weekend")
    case _:
        print("Invalid day")
```

> [!TIP]
> Use `|`(python) to match multiple values in one case: `case 6 | 7:`(python). Use `case _:`(python) as the default (catches everything else).

`match`(python) can also match **ranges** using a `guard` condition with `if`(python):

```python
score = 82

match score:
    case s if s >= 90:
        print("Excellence")
    case s if s >= 75:
        print("Merit")
    case s if s >= 60:
        print("Achieved")
    case _:
        print("Not Achieved")
```

> [!TIP]
> For simple grade-style checks like the above, `if/elif/else`(python) is often clearer. Use `match`(python) when you're comparing one variable against many exact values.
