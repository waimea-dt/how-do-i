# Laying Out Data in the Console

Plain `print()`(python) output can quickly become hard to read when you have columns of data. Python gives you tools to align text, pad values, and draw borders - turning raw output into something that looks intentional.


## Padding and Alignment with f-strings

Use format specifiers inside f-strings to align values into fixed-width columns:

```python
item1  = "Health Potion"
price1 = 4.99
item2  = "Battle Axe"
price2 = 13.50

print(f"{item1:<15} {price1:>8.2f}")
print(f"{item2:<15} {price2:>8.2f}")
```

- `:<15`(python) means **left-align** in a field 15 characters wide
- `:>8.2f`(python) means **right-align** as a float with 2 decimal places in 8 characters

> [!TIP]
> The general alignment pattern is `{value:{fill}{align}{width}}`(python) where align is `<`(python) (left), `>`(python) (right), or `^`(python) (centre).


## Formatting a Table

Combine headings, separators, and aligned rows to build a clean table:

```python
items = [
    ("Sword",         14900),
    ("Shield",         8950),
    ("Health Potion",   400),
    ("Map",           12500),
]

print(f"{'Item':<20} {'Price':>8}")
print("-" * 29)

for name, price in items:
    print(f"{name:<20} {price:>8,}")
```

Output:
```
Item                    Price
-----------------------------
Sword                  14,900
Shield                  8,950
Health Potion             400
Map                    12,500
```

Format specifier reference:

| Specifier | Meaning | Example | Output |
|-----------|---------|---------|--------|
| `:<10`(python) | Left-align, 10 wide | `{"Hi":<10}`(python) | `Hi        `(python) |
| `:>10`(python) | Right-align, 10 wide | `{42:>10}`(python) | `        42`(python) |
| `:^10`(python) | Centre, 10 wide | `{"Hi":^10}`(python) | `    Hi    `(python) |
| `:.2f`(python) | Float, 2 decimal places | `{3.14159:.2f}`(python) | `3.14`(python) |
| `:,`(python) | Integer with comma separator | `{12345:,}`(python) | `12,345`(python) |
| `:>10.2f`(python) | Float, right-aligned, 10 wide | `{3.14:>10.2f}`(python) | `      3.14`(python) |
| `:010`(python) | Zero-pad to width 10 | `{42:010}`(python) | `0000000042`(python) |


## Repeating Characters for Borders

Use string multiplication to build separator lines that match your column widths:

```python
def print_table(title: str, rows: list) -> None:
    width = 40
    print("=" * width)
    print(f" {title}")
    print("-" * width)
    for label, value in rows:
        print(f" {label:<20} {value:>15,}")
    print("=" * width)

scores = [
    ("Alice",  14900),
    ("Bob",     8950),
    ("Charlie",   400),
]

print_table("High Scores", scores)
```


## Box Drawing Characters

Unicode box-drawing characters let you draw neat borders in any terminal:

| Character | Unicode | Role |
|-----------|---------|------|
| `─` | U+2500 | Horizontal line |
| `│` | U+2502 | Vertical line |
| `┌` | U+250C | Top-left corner |
| `┐` | U+2510 | Top-right corner |
| `└` | U+2514 | Bottom-left corner |
| `┘` | U+2518 | Bottom-right corner |
| `├` | U+251C | Left junction |
| `┤` | U+2524 | Right junction |

> [!TIP]
> You can paste these characters directly into your Python strings - they work in any modern terminal.

A simple function to draw a message inside a box:

```python
def print_in_box(message: str) -> None:
    width = len(message) + 2
    print("┌" + "─" * width + "┐")
    print(f"│ {message} │")
    print("└" + "─" * width + "┘")

print_in_box("Game Over!")
print_in_box("You Win!")
```

Output:
```
┌────────────┐
│ Game Over! │
└────────────┘
┌──────────┐
│ You Win! │
└──────────┘
```


## Leaderboard Example

Putting it all together - a formatted leaderboard:

```python
players = [
    ("Jimmy Tickles",  14900),
    ("xXDragonSlayXx",  8950),
    ("CoolGamer99",      400),
    ("NoobishMcNoob",   12500),
]

players.sort(key=lambda p: p[1], reverse=True)   # sort by score descending

print("┌" + "─" * 32 + "┐")
print(f"│ {'🏆 LEADERBOARD':<30} │")
print("├" + "─" * 32 + "┤")

for i, (name, score) in enumerate(players, start=1):
    print(f"│ {i}. {name:<20} {score:>6,} │")

print("└" + "─" * 32 + "┘")
```
