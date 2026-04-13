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
    """ Return grade (NA/A/M/E) for given score (0-100) """
    if score > 100 or score < 0:
        return "Invalid"
    elif score >= 90:
        return "E"
    elif score >= 80:
        return "M"
    elif score >= 70:
        return "A"
    else:
        return "NA"

# Tests -------------------------------------

# Invalid Values
-5  -> "Invalid"
105 -> "Invalid"

# Valid Values
95 -> "E"
85 -> "M"
50 -> "NA"

# Boundary Values
100 -> "E"
90  -> "E"
89  -> "M"


```

Notice that line 7 (grade A) is not covered by the tests! Try adding:
- `75 -> "A"` (valid case)
- `70 -> "A"` (boundary case)
- `69 -> "NA"` (boundary case)

---

## Conditional Logic Coverage

```python test
def is_valid_password(password):
    """ Check if password meets security requirements """
    if len(password) < 8:
        return False
    if not any(c.isdigit() for c in password):
        return False
    if not any(c.isupper() for c in password):
        return False
    return True

# Tests

# Invalid Values
"Short1" -> False
"nouppercase123" -> False
"nodigits" -> False

# Valid Values
"ValidPass123" -> True

# Boundary Values
"Short12" -> False
"Valid123" -> True
```

Full coverage! Every condition is tested.

---

## Loop Coverage

```python test
def find_maximum(numbers):
    """ Find the largest number in a list """
    if not numbers:
        return None

    max_val = numbers[0]
    for num in numbers:
        if num > max_val:
            max_val = num
    return max_val

# Tests

# Invalid Values
[]  -> None

# Valid Values
[3, 7, 2, 9, 1] -> 9
[5]             -> 5
[-10, -5, -20]  -> -5
```

---

## Edge Cases Challenge

Can you improve the coverage of this function?

```python test
def categorize_age(age):
    """ Categorize a person by age group """
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

# Tests - try to improve coverage!

# Valid Values
10 -> "Child"
25 -> "Adult"

# Invalid Values


# Boundary Values


```

**Challenge**: Add Invalid and Boundary tests to achieve 100% coverage!

---

## Complex Logic

```python test
def discount_price(price, customer_type, is_member):
    """ Calculate discounted price based on customer type and membership """
    discount = 0

    if customer_type == "student":
        discount = 0.10
    elif customer_type == "senior":
        discount = 0.15

    if is_member:
        discount += 0.05

    return price * (1 - discount)

# Tests

# Valid Values
100, "student", False -> 90.0
100, "senior",  True  -> 80.0
100, "regular", False -> 100.0
100, "regular", True  -> 95.0
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
