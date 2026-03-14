# Output to the Console in Python

Printing to the console is the simplest way to see what your program is doing.

## print()

`print()` displays a value and then moves to the **next line**:

```python
print("Hello, world!")
print("This is on a new line.")
```

## Printing Variables

Pass a variable directly to `print()` to display its value:

```python
name  = "Steve"
score = 4200

print(name)
print(score)
```

## Printing Multiple Values

Pass multiple values separated by commas - `print()` adds a space between them:

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

By default, `print()` adds a newline at the end. Use `end=""` to change this:

```python
print("Hello, ", end="")
print("world!")               # prints on the same line
```

Or use `end=" "` to separate with a space instead of a newline:

```python
for i in range(1, 6):
    print(i, end=" ")         # prints: 1 2 3 4 5
```


## Blank Lines

Call `print()` with no arguments to print a **blank line**:

```python
print("Section 1")
print()
print("Section 2")
```


## Escape Characters

Some special characters inside strings need an **escape sequence** - a backslash `\` followed by a letter:

| Escape | Output |
|--------|--------|
| `\n` | New line |
| `\t` | Tab |
| `\'` | Single quote |
| `\"` | Double quote |
| `\\` | Backslash |

```python
print("Name:\tSteve")
print("Line one\nLine two")
print("She said \"hello\".")
```


## Formatting Numbers

Use f-strings with a **format spec** to control how numbers are displayed:

```python
pi   = 3.14159265
cost = 1234.5

print(f"Pi to 2dp: {pi:.2f}")
print(f"Cost: £{cost:.2f}")
```

?> `:.2f` means: format as a floating-point number with **2 decimal places**. Use `:d` for integers and `:s` for strings.
