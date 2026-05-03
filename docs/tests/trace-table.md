# Trace Table Test

## Simple Loop

```python trace
x = 0
for i in range(3):
    x = x + i
```

## Conditional Assignment

```python trace
score = 7

if score >= 90:
    grade = 'A'
elif score >= 70:
    grade = 'B'
elif score >= 50:
    grade = 'C'
else:
    grade = 'F'
```

## Example

```python trace hide
go = False
name = input("Name: ")    # INPUT: Bob
print(f"Hello, {name}!")
go = True
go = None
go = 67
a = 6
b = 7
print(f"Answer: {a * b}")
```

## Breaking

```python trace
total = 0
while True:
    total += 1
    if total > 10:
        break
```

## Lists - Append and Index Update

```python trace
a = [0, 0, 0]
a.append(3)
a[2] = 1
```

```python trace
a = [False, True]
a.append(True)
a[0] = True
```

```python trace
a = ["One", "Two"]
a.append("Three")
```

## Lists - Loop and Continue

```python trace
nums = [1, 2, 3, 4, 5]
sum_even = 0
for i in range(5):
    n = nums[i]
    if n % 2 != 0:
        continue
    sum_even += n
```

## Lists - len(list)

```python trace
names = ["Ada", "Linus", "Sam"]
name_count = len(names)
```

```python trace
scores = [5, 7, 9, 10]
last_index = len(scores) - 1
last_score = scores[last_index]
```

## Lists - for i in list

```python trace
nums = [2, 4, 6]
total = 0
for i in nums:
    total += i
```

```python trace
words = ["a", "bb", "ccc"]
letters = ""
for w in words:
    letters += w
```

## Blank Worksheet Mode

```python trace blank
x = 0
y = 2
for i in range(3):
    x += i
print(x + y)
```

<details>
<summary>Compare...</summary>

```python trace hide
x = 0
y = 2
for i in range(3):
    x += i
print(x + y)
```
</details>


### Another

```python trace blank
nums = [1, 2, 3]
total = 0
for n in nums:
    total += n
```

## Nested Loop

```python trace
total = 0
for i in range(1, 3):
    for j in range(1, 3):
        total = total + (i * j)
```

## Multiple Variables

```python trace
x = 5
y = 10
z = x + y
if z > 10:
    result = z * 2
else:
    result = z
```

## While Loop

```python trace
count = 0
value = 1
while count < 4:
    value = value * 2
    count = count + 1
```

## Python - int

```python trace
raw = "42"
n = int(raw)
total = n + 8
```


## Kotlin - Core Subset

```kotlin trace
var x = 0
val y: Int = 2
for (i in 1..3) {
    x += i
}
println("Answer: ${x + y}")
```

```kotlin trace
val name = readln() // INPUT: Dave
var count = 0
while (count < 2) {
    println("Hi $name")
    count++
}
```

## Kotlin - Lists

```kotlin trace
val nums = mutableListOf<Int>()
nums.add(4)
nums.add(7)
nums[1] = 9
var total = 0
for (item in nums) {
    total += item
}
println(total)
```

```kotlin trace
val nums = mutableListOf<Int>()
nums.add(1)
nums.add(2)
var i = 0
while (i < nums.size) {
    if (i == 0) {
        i++
        continue
    }
    break
}
```

## Kotlin - When

```kotlin trace
var grade = ""
val score = 72
when {
    score >= 90 -> grade = "A"
    score >= 70 -> grade = "B"
    else -> grade = "F"
}
println("Grade $grade")
```

```kotlin trace
val n = 2
var text = "?"
when (n) {
    1 -> text = "one"
    2 -> text = "two"
    else -> text = "other"
}
println(text)
```

```kotlin trace
val n = 2
val text = when (n) {
    1 -> "one"
    2 -> "two"
    else -> "other"
}
println(text)
```

```kotlin trace
val score = 85
var band = when {
    score >= 90 -> "A"
    score >= 80 -> "B"
    else -> "C"
}
println(band)
```

## Kotlin null

```kotlin trace
var name: String? = null

print("Your name: ")
name = readln()         // INPUT: Dave

if (name != null) {
    println("Hello, $name")
}
```

```kotlin trace
var nick: String? = null

print("Nick: ")
nick = readlnOrNull()   // INPUT: Dee
println(nick)
```

## Kotlin - toInt

```kotlin trace
var raw = readln() // INPUT: 12
var n = raw.toInt()
println(n + 3)
```

```kotlin trace
var maybeNum = readlnOrNull() // INPUT: 21
var parsed = maybeNum?.toIntOrNull()
println(parsed)
```

```kotlin trace
var num = readlnOrNull()?.toIntOrNull() // INPUT: 34
println(num)
```

```kotlin trace
var num: Int?
while (true) {
    var num = readlnOrNull()?.toIntOrNull() // INPUT: 21, 50, 67
    if (num != null && num > 50) {
        break
    }
}
println(num!!)
```

