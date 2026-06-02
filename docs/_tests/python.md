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

## Hidden Setup Code

The Python runner supports hidden setup code that runs before visible code but isn't shown to students.

```python id=imports
import math
import random
```

```python id=student_data
students = [
    {"name": "Alice", "score": 92},
    {"name": "Bob", "score": 78},
    {"name": "Charlie", "score": 85},
]
```

### Example: Using Hidden Imports

The `math` module is imported in hidden setup code above:

```python run depends=imports
radius = 5
area = math.pi * radius ** 2
circumference = 2 * math.pi * radius

print(f"Circle with radius {radius}:")
print(f"  Area: {area:.2f}")
print(f"  Circumference: {circumference:.2f}")
```

### Example: Pre-loaded Data

The `students` list is defined in hidden setup code:

```python run depends=student_data
total_score = sum(s["score"] for s in students)
average = total_score / len(students)

print(f"Class Average: {average:.1f}")
print("\nGrades:")
for student in students:
    grade = "A" if student["score"] >= 90 else "B" if student["score"] >= 80 else "C"
    print(f"  {student['name']}: {student['score']} ({grade})")
```

### Example: Multiple Setups Combined

You can reference multiple setup blocks by chaining them:

```python id=helpers
def is_prime(n):
    if n < 2:
        return False
    for i in range(2, int(n ** 0.5) + 1):
        if n % i == 0:
            return False
    return True
```

```python run depends=helpers
primes = [n for n in range(2, 30) if is_prime(n)]
print(f"Primes less than 30: {primes}")
print(f"Count: {len(primes)}")
```
