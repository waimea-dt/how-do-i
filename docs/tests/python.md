# Python Runner

## Output

```python run
print("Hello, world!")
print("This is on a new line.")
print()
print("After a blank line.")
```

## Variables and Types

```python run
name     = "Steve"
age      = 25
cost     = 9.99
is_alive = True

print(name, age, cost, is_alive)
print(type(name), type(age), type(cost), type(is_alive))
```

## f-Strings

```python run
name  = "Steve"
score = 4200
bonus = 800

print(f"{name} scored {score + bonus} points")
print(f"Pi is approximately {3.14159:.2f}")
print(f"Score: {score:,}")
```

## Conditionals

```python run
score = 75

if score >= 90:
    print("A grade")
elif score >= 70:
    print("B grade")
elif score >= 50:
    print("C grade")
else:
    print("Fail")
```

## Loops

### For Loop

```python run
for i in range(1, 6):
    print(f"Count: {i}")
```

### While Loop

```python run
count = 10
while count > 0:
    print(count, end=" ")
    count -= 1
print("\nBlast off!")
```

### Looping Over a List

```python run
fruits = ["apple", "banana", "cherry", "mango"]

for fruit in fruits:
    print(f"  - {fruit}")
```

## Functions

```python run
def greet(name, formal=False):
    if formal:
        return f"Good day, {name}."
    return f"Hey, {name}!"

print(greet("Alice"))
print(greet("Bob", formal=True))
```

```python run
def calculate_grade(score):
    if score >= 90:
        return "A"
    elif score >= 70:
        return "B"
    elif score >= 50:
        return "C"
    else:
        return "Fail"

for s in [95, 78, 52, 30]:
    print(f"{s} → {calculate_grade(s)}")
```

## Lists

```python run
numbers = [4, 7, 2, 19, 5, 1]

largest = numbers[0]
for n in numbers:
    if n > largest:
        largest = n

print(f"Largest: {largest}")
print(f"Sorted:  {sorted(numbers)}")
print(f"Sum:     {sum(numbers)}")
```

## Recursion

```python run
def countdown(n):
    if n == 0:
        print("Blast off!")
        return
    print(n)
    countdown(n - 1)

countdown(5)
```

```python run
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

for i in range(1, 8):
    print(f"{i}! = {factorial(i)}")
```
