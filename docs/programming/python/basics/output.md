# Output to the Console in Python

Printing to the console is the simplest way to see what your program is doing.

## print()

`print()`(python) displays a value and then moves to the **next line**:

```python
print("Hello, world!")
print("This is on a new line.")
```

## Printing Variables

Pass a variable directly to `print()`(python) to display its value:

```python
name  = "Steve"
score = 4200

print(name)
print(score)
```

## Printing Multiple Values

Pass multiple values separated by commas - `print()`(python) adds a space between them:

```python
first_name = "Steve"
last_name  = "Rogers"
age        = 25

print(first_name, last_name, "is", age, "years old")
```


## f-Strings

The cleanest way to mix variables and text - see the [Working with Text](programming/python/basics/text.md) page for full details:

```python
name  = "Steve"
score = 4200
bonus = 1000

print(f"{name} has scored {score + bonus}")
```


## Staying on the Same Line

By default, `print()`(python) adds a newline at the end. Use `end=""`(python) to change this:

```python
print("Hello, ", end="")
print("world!")               # prints on the same line
```

Or use `end=" "`(python) to separate with a space instead of a newline:

```python
for i in range(1, 6):
    print(i, end=" ")         # prints: 1 2 3 4 5
```


## Blank Lines

Call `print()`(python) with no arguments to print a **blank line**:

```python
print("Section 1")
print()
print("Section 2")
```


## Escape Characters

Some special characters inside strings need an **escape sequence** - a backslash `\`(python) followed by a letter:

| Escape | Output |
|--------|--------|
| `\n`(python) | New line |
| `\t`(python) | Tab |
| `\'`(python) | Single quote |
| `\"`(python) | Double quote |
| `\\`(python) | Backslash |

```python
print("Name:\tSteve")
print("Line one\nLine two")
print("She said \"hello\".")
```


## Formatting Numbers

Use f-strings with a **format spec** after a colon inside `{ }`(python) to control how numbers are displayed:

```python
pi   = 3.14159265
cost = 1234.5

print(f"Pi to 2dp: {pi:.2f}")          # 3.14
print(f"Cost: £{cost:.2f}")            # 1234.50
print(f"Large: {1234567:,}")           # 1,234,567  (comma separator)
print(f"Padded: {42:>10}")             # right-align in 10 characters
print(f"Percent: {0.753:.1%}")         # 75.3%
```

> [!TIP]
> `:.2f`(python) means: format as a floating-point number with **2 decimal places**. The general pattern is `:{width}.{precision}{type}`(python) where type is `f`(python) for float, `d`(python) for integer, `s`(python) for string.

Format specifier reference:

| Specifier | Meaning | Example | Output |
|-----------|---------|---------|--------|
| `:.2f`(python) | Float, 2 decimal places | `{3.14159:.2f}`(python) | `3.14`(python) |
| `:,`(python) | Integer with comma separator | `{1234567:,}`(python) | `1,234,567`(python) |
| `:>10`(python) | Right-align in 10 chars | `{42:>10}`(python) | `        42`(python) |
| `:<10`(python) | Left-align in 10 chars | `{"hi":<10}`(python) | `hi        `(python) |
| `:010`(python) | Zero-pad to width 10 | `{42:010}`(python) | `0000000042`(python) |
| `:.1%`(python) | Percentage, 1 decimal place | `{0.753:.1%}`(python) | `75.3%`(python) |
