# Code Blocks

A **code block** is a group of statements that belong together. In Python, blocks are defined entirely by **indentation** - there are no curly braces `{ }`.

```python
if condition:
    # everything indented here is one block
    # this line is also in the block
# back to normal - the block has ended
```

The block begins after a colon `:` and ends when the indentation returns to the previous level.


## Blocks in Practice

Here are some common places you'll encounter blocks:

**`if` / `else`** - runs the block when the condition is met:

```python
score = 72

if score >= 50:
    print("Passed!")      # this block runs
else:
    print("Failed.")      # this block doesn't run
```

**`for` loop** - runs the block once for each item:

```python
for i in range(1, 4):
    print(f"Count: {i}")  # this block runs 3 times
```

**Function** - the block is the body of the function and runs when it's called:

```python
def greet(name):
    print(f"Hello, {name}!")

greet("Alice")
greet("Bob")
```


## Indentation Rules

Python uses **4 spaces** per indent level by convention (most editors insert 4 spaces when you press Tab).

!> Indentation is **not optional** in Python - it defines the structure of your code. Getting it wrong will cause an `IndentationError` and your program won't run at all.

```python
# ✓ Correct - 4 spaces
if score >= 50:
    print("Passed!")
    print("Well done.")

# ✗ Wrong - inconsistent indentation causes an error
if score >= 50:
    print("Passed!")
  print("Well done.")    # IndentationError!
```

?> Most editors (including VS Code) handle indentation automatically as you type. They also convert Tab presses to 4 spaces.


## Nested Blocks

Blocks can be **nested** inside each other - each level gets another 4 spaces of indentation:

```python
for i in range(1, 4):
    if i % 2 == 0:
        print(f"{i} is even")
    else:
        print(f"{i} is odd")
```


## Blocks and Scope

Unlike many other languages, `if` blocks and loops in Python do **not** create their own scope - a variable created inside one is accessible in the surrounding code. However, it only exists once that line has actually run.

?> For a full explanation of scope - including local vs global variables - see the [Variables & Types](programming/python/basics/variables.md) page.
