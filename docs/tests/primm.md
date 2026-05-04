# PRIMM Widget

## What is PRIMM?

PRIMM is a five-step code learning pedagogy:
1. **Predict** - Students predict what code will do
2. **Run** - Execute the code to verify predictions
3. **Investigate** - Explore and understand the code
4. **Modify** - Make changes to understand behavior
5. **Make** - Create new code from scratch

This plugin implements the **Predict & Run** steps, making it easy for students to form hypotheses about code behavior before running it.

```python
numbers = [1, 2, 3, 4, 5]
total = sum(numbers)
average = total / len(numbers)
print(f"Sum: {total}")
print(f"Average: {average}")
```

```python run
numbers = [1, 2, 3, 4, 5]
total = sum(numbers)
average = total / len(numbers)
print(f"Sum: {total}")
print(f"Average: {average}")
```

<primm>

```python
numbers = [1, 2, 3, 4, 5]
total = sum(numbers)
average = total / len(numbers)
print(f"Sum: {total}")
print(f"Average: {average}")
```

</primm>


## Python Example

Try predicting what this code will do before running it:

<primm>

```python
a = 10
b = 5
c = a + b
print(c)
```

</primm>

## Multiple Operations

Here's a more complex example:

<primm>

```python
numbers = [1, 2, 3, 4, 5]
total = sum(numbers)
average = total / len(numbers)
print(f"Sum: {total}")
print(f"Average: {average}")
```

</primm>

## String Manipulation

Predict the output of this string operation:

<primm>

```python
text = "Hello, World!"
reversed_text = text[::-1]
print(reversed_text)
print(text.upper())
print(text.lower())
```

</primm>

## Loop Example

What will this loop print?

<primm>

```python
for i in range(5):
    print(i * 2)
```

</primm>

## Conditional Example

Predict the output:

<primm>

```python
age = 16

if age < 13:
    print("Child")
elif age < 18:
    print("Teen")
else:
    print("Adult")
```

</primm>

## Kotlin Example

<primm>

```kotlin
val numbers = listOf(1, 2, 3, 4, 5)
numbers.forEach { num ->
    println(num * 2)
}
```

</primm>


### No Header

<primm header="false">

```kotlin
val numbers = listOf(1, 2, 3, 4, 5)
numbers.forEach { num ->
    println(num * 2)
}
```

</primm>
