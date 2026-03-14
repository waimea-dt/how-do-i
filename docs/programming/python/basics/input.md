# User Input from the Console in Python

`input()` waits for the user to type something and press Enter, then returns it as a `str`.

## Reading Text

```python
name = input()
```

Pass a prompt string directly to `input()` - it displays the prompt and waits on the same line:

```python
name = input("Enter your name: ")

print(f"Hello, {name}!")
```

?> Using `input("prompt: ")` is the idiomatic Python way - no need for a separate `print()` call first.


## Reading Numbers

`input()` always returns a `str`. To use the input as a number, wrap it in `int()` or `float()`:

```python
age = int(input("Enter your age: "))
```

```python
price = float(input("Enter the price: "))
```

For example:

```python
age = int(input("Enter your age: "))

print(f"In 10 years you will be {age + 10}.")
```

```python
price    = float(input("Enter the price: "))

with_tax = price * 1.15
print(f"With tax: £{with_tax:.2f}")
```

!> If the user types something that isn't a valid number, `int()` and `float()` will crash. See the [Error Handling](programming/python/advanced/errors.md) page for how to handle this safely.


## Reading Multiple Values

Call `input()` once for each value you want to read:

```python
first_name = input("First name: ")
last_name  = input("Last name: ")
age        = int(input("Age: "))

print(f"Hello, {first_name} {last_name}! You are {age} years old.")
```
