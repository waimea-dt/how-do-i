# Conditional Logic

## Comparison Operators

When comparing two values, use:

- `==` is **equal** to
- `!=` is **not equal** to
- `>` is **greater** than
- `>=` is **greater or equal** to
- `<` is **less** than
- `<=` is **less or equal** to
- `in` is **contained in**
- `not in` is **not contained in**

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

- `and` - **both** values must be true
- `or` - **at least one** value must be true
- `not` - **reverses** the value

`and` example:

```python
logged_in = True
is_admin  = True

if logged_in and is_admin:
    print("Welcome, admin!")
```

`or` example:

```python
lives     = 0
cheats_on = True

if lives > 0 or cheats_on:
    print("Keep playing!")
else:
    print("Game over!")
```

`not` example:

```python
is_blocked = False

if not is_blocked:
    print("Access granted.")
```

?> Python uses `and`, `or`, `not` - not `&&`, `||`, `!` like some other languages. They do the same job but read more naturally.
