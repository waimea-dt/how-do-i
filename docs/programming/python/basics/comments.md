# Commenting Your Python Code

Python has two ways to add comments:

- **Inline comments** - a short note on a single line with `#`
- **Docstrings** - a longer description using `""" """`


## Inline Comments `#`

Start a comment with `#`. Python ignores everything after `#` until the end of the line.

```python
# This is an inline comment

name = "Steve"  # This is also an inline comment
# school = "Waimea College"
```

?> The final line shows **commenting out** code - useful for temporarily disabling a line without deleting it. In VS Code, <kbd>Ctrl</kbd> + <kbd>/</kbd> toggles a comment on/off for the current line.


## Multi-Line Comments

Python doesn't have a block comment syntax like `/* ... */`. The convention is to use multiple `#` lines:

```python
# This is a longer comment
# that spans multiple lines.
# All of these lines are ignored.
```

Alternatively, a triple-quoted string with `"""` is sometimes used for multi-line notes, though strictly these are **string literals** (not true comments):

```python
"""
This is sometimes used as a multi-line comment.
It works, but the # style above is more conventional.
"""
```


## What to Comment - and What Not To

Good comments explain the **why**, not the **what**. If the code clearly shows *what* it does, a comment restating it adds nothing.

**Aim for self-documenting code** - choose clear names so the code speaks for itself:

✗ Comments explaining *what* (unnecessary - the code already says this):

```python
# Add 1 to score
score += 1

# Loop through players
for player in players:
    # Print the player
    print(player.name)
```

✓ Comments explaining *why* (useful - context the code can't provide):

```python
score += bonus_points * 2    # Double points during fever mode

# Show the current player ranking
for player in players:
    print(player.name)
```


## Docstrings

**Docstrings** are triple-quoted strings placed directly after a function or class definition. They describe what the function does:

```python
def calculate_tax(income):
    """Return the tax owed on the given income."""
    return income * 0.33
```

For longer descriptions:

```python
def greet(name, formal=False):
    """
    Return a greeting for the given name.

    If formal is True, uses a formal greeting.
    """
    if formal:
        return f"Good day, {name}."
    return f"Hey, {name}!"
```

?> Docstrings are readable by tools and IDEs - hover over a function call in VS Code and you'll see the docstring as a tooltip.
