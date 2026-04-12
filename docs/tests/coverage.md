# Python Test Coverage

Test-Driven Development (TDD) visualization with interactive code coverage analysis.

<!-- Hidden execution engine for coverage tests -->
<div style="display: none;">

```python run
# This hidden block provides a Python execution engine for coverage tests
print("Coverage engine ready")
```

</div>

## Basic Coverage Example

Use the simple `input -> expected` syntax to write tests:

```python test
def calculate_grade(score):
    print("Let's go!")
    print("Testing...")
    
    if score >= 90:
        return "A"
    elif score >= 80:
        return "B"
    elif score >= 70:
        return "C"
    elif score >= 60:
        return "D"
    else:
        return "F"

# Tests
95 -> "A"
85 -> "B"
50 -> "F"
```

Notice that lines 7-9 (grade C and D) are not covered by the tests! Try adding:
- `75 -> "C"` (valid case)
- `65 -> "D"` (valid case)
- `60 -> "D"` (boundary case)
- `59 -> "F"` (boundary case)

---

## Conditional Logic Coverage

```python test
def is_valid_password(password):
    if len(password) < 8:
        return False
    if not any(c.isdigit() for c in password):
        return False
    if not any(c.isupper() for c in password):
        return False
    return True

# Tests
"Short1" -> False
"nouppercase123" -> False
"ValidPass123" -> True
```

Full coverage! Every condition is tested.

---

## Loop Coverage

```python test
def find_maximum(numbers):
    if not numbers:
        return None

    max_val = numbers[0]
    for num in numbers:
        if num > max_val:
            max_val = num
    return max_val

# Tests
[3, 7, 2, 9, 1] -> 9
[5]             -> 5
[]              -> None
```

---

## Edge Cases Challenge

Can you improve the coverage of this function?

```python test
def categorize_age(age):
    if age < 0:
        return "Invalid"
    elif age < 13:
        return "Child"
    elif age < 20:
        return "Teenager"
    elif age < 65:
        return "Adult"
    else:
        return "Senior"

# Tests
10 -> "Child"
25 -> "Adult"
```

**Challenge**: Add tests to achieve 100% coverage!

---

## Complex Logic

```python test
def discount_price(price, customer_type, is_member):
    discount = 0

    if customer_type == "student":
        discount = 0.10
    elif customer_type == "senior":
        discount = 0.15

    if is_member:
        discount += 0.05

    return price * (1 - discount)

# Tests
100, "student", False -> 90
100, "senior",  True  -> 80
100, "regular", False -> 100
```

---

## Understanding Coverage

### What is Code Coverage?

Code coverage measures which lines of your code are executed when your tests run:

- 🟢 **Green lines**: Executed by at least one test
- 🔴 **Red lines**: Never executed (not tested!)
- ⚪ **White lines**: Not executable (comments, blank lines)

### Coverage Metrics

- **Line Coverage**: Percentage of executable lines that were run
- **Branch Coverage**: Whether all conditional paths were tested
- **100% Coverage**: Every line executed, but doesn't guarantee bug-free code!

### Best Practices

1. **Aim for high coverage** (80%+), but don't obsess over 100%
2. **Test edge cases**: Empty lists, negative numbers, boundary conditions
3. **Quality over quantity**: Meaningful tests that verify behavior
4. **Red lines = Missing tests**: Each uncovered line is a potential bug
