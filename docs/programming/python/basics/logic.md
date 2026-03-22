# Conditional Logic

## Comparison Operators

When comparing two values, use:

| Operator | Meaning |
|----------|----------|
| `==`(python) | equal to |
| `!=`(python) | not equal to |
| `>`(python) | greater than |
| `>=`(python) | greater than or equal to |
| `<`(python) | less than |
| `<=`(python) | less than or equal to |
| `in`(python) | contained in a sequence |
| `not in`(python) | not contained in a sequence |

For example:

```python
score = 35000

if score >= 20000:
    print("High score!")
```

```python
answer = "Banana"

while answer != "Apple":
    print(f"{answer} is wrong, try again...")
    answer = "Apple"    # simulate a correct guess

print("Correct!")
```

```python
grade = "C"

if grade not in "ABCDEF":
    print("Invalid grade")
else:
    print(f"Grade: {grade}")
```


## Boolean Operators

For logical operations on boolean values, Python uses plain English words:

| Operator | Meaning |
|----------|----------|
| `and`(python) | **both** values must be true |
| `or`(python) | **at least one** value must be true |
| `not`(python) | **reverses** the value |

`and`(python) example:

```python
logged_in = True
is_admin  = True

if logged_in and is_admin:
    print("Welcome, admin!")
```

`or`(python) example:

```python
lives     = 0
cheats_on = True

if lives > 0 or cheats_on:
    print("Keep playing!")
else:
    print("Game over!")
```

`not`(python) example:

```python
is_blocked = False

if not is_blocked:
    print("Access granted.")
```

> [!NOTE]
> Python uses `and`(python), `or`(python), `not`(python) instead of `&&`(kotlin), `||`(kotlin), `!`(kotlin) like some other languages. They do the same job but read more naturally.
