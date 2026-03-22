# Looping / Iteration in Python

Loops allow you to **repeat a block of code** multiple times, either a set number of times or until a condition is no longer true.

## For Loop

A `for` loop repeats once **for each item in a sequence**:

```python
for variable in sequence:
    # code to repeat
```

Looping a **fixed number of times** with `range()`:

```python
for i in range(1, 6):
    print(f"Count: {i}")    # 1, 2, 3, 4, 5
```

> [!NOTE]
> `range(start, stop)`(python) generates numbers from `start`(python) up to (but **not including**) `stop`(python). `range(5)`(python) gives `0, 1, 2, 3, 4`(python).


Looping over a **list**:

```python
fruits = ["Apple", "Banana", "Cherry"]

for fruit in fruits:
    print(fruit)
```


## range() Options

`range()` has three forms:

```python
range(stop)              # 0 up to stop-1
range(start, stop)       # start up to stop-1
range(start, stop, step) # start up to stop-1, counting by step
```

Examples:

```python
for i in range(5):          # 0 1 2 3 4
    print(i, end=" ")

for i in range(2, 8):       # 2 3 4 5 6 7
    print(i, end=" ")

for i in range(0, 11, 2):   # 0 2 4 6 8 10 (count by 2)
    print(i, end=" ")

for i in range(10, 0, -1):  # 10 9 8 7 6 5 4 3 2 1 (countdown)
    print(i, end=" ")
```


## While Loop

A `while` loop repeats **as long as a condition is true**. The condition is checked **before** each iteration:

```python
while condition:
    # code to repeat
```

For example:

```python
lives = 3

while lives > 0:
    print(f"Lives remaining: {lives}")
    lives -= 1

print("Game over!")
```

> [!IMPORTANT]
> Make sure the loop has a way to eventually make the condition `False`(python) - otherwise you'll create an **infinite loop**.


## Break and Continue

Two keywords let you control the flow inside a loop:

- `break`(python) - **exits** the loop immediately
- `continue`(python) - **skips** the rest of the current iteration and jumps to the next one

`break` example - stop as soon as a target is found:

```python
numbers = [4, 7, 2, 9, 1, 6]

for n in numbers:
    if n == 9:
        print("Found 9, stopping!")
        break
    print(f"Checked: {n}")
```

`continue` example - skip odd numbers:

```python
for i in range(1, 11):
    if i % 2 != 0:
        continue
    print(f"Even: {i}")
```


## Looping with an Index

If you need both the index and the value, use `enumerate()`:

```python
fruits = ["Apple", "Banana", "Cherry"]

for i, fruit in enumerate(fruits):
    print(f"{i}: {fruit}")
```

> [!TIP]
> `enumerate()`(python) is the idiomatic Python way to get an index - it's cleaner than using `range(len(list))`(python).
