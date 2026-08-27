# Divide and Conquer

## The Strategy

**Divide and Conquer** is a powerful algorithmic paradigm that breaks problems into smaller subproblems, solves them independently, and combines the results.

### The Three Steps

1. **Divide**: Break the problem into smaller subproblems
2. **Conquer**: Solve the subproblems recursively (or directly if small enough)
3. **Combine**: Merge the solutions to solve the original problem

## Why It Works

Many problems have a recursive structure where:
- Solving a large problem is expensive
- Solving small problems is easy
- Combining solutions is relatively cheap

Divide and conquer exploits this to achieve better complexity!

## Classic Examples

### Binary Search - **O(log N)**

Divide the sorted array in half repeatedly until you find the target.

```python
def binary_search(arr, target, low, high):
    if low > high:
        return -1  # Not found

    mid = (low + high) // 2

    # Base case
    if arr[mid] == target:
        return mid

    # Divide: search in appropriate half
    if arr[mid] > target:
        return binary_search(arr, target, low, mid - 1)
    else:
        return binary_search(arr, target, mid + 1, high)
```

**How it divides**: Each recursion halves the search space
**Why it's fast**: log<sub>2</sub> N levels of recursion

<algo-race type="search" size="200"></algo-race>

Binary search's dramatic efficiency comes from the divide-and-conquer approach!

---

### Merge Sort - **O(N log N)**

Divide array in half, sort each half, merge them.

```python
def merge_sort(arr):
    # Base case: arrays of size ≤ 1 are sorted
    if len(arr) <= 1:
        return arr

    # Divide
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])

    # Combine
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0

    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1

    result.extend(left[i:])
    result.extend(right[j:])
    return result
```

**How it divides**: Splits array into halves (log N levels)
**Why it's fast**: Each level does **O(N)** work, log N levels total

<algo-race type="sort" size="100"></algo-race>

See how merge sort dominates bubble sort!

---

### Quick Sort - **O(N log N)** average

Choose a pivot, partition around it, recursively sort partitions.

```python
def quick_sort(arr):
    if len(arr) <= 1:
        return arr

    # Divide around pivot
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]

    # Conquer
    return quick_sort(left) + middle + quick_sort(right)
```

**How it divides**: Partitions around a pivot element
**Why it's fast**: Good pivots lead to balanced partitions

---

## The Master Theorem

For divide-and-conquer recurrences of the form:

**T(N) = a · T(N/b) + f(N)**

Where:
- a = number of subproblems
- N/b = size of each subproblem
- f(N) = cost of divide and combine steps

### Three Cases

| Case | Condition | Solution | Example |
|------|-----------|----------|---------|
| 1 | f(N) = **O(N<sup>c</sup>)** where c < log<sub>b</sub> a | T(N) = Θ(N<sup>log<sub>b</sub> a</sup>) | T(N) = 8T(N/2) + N<sup>2</sup> → **O(N<sup>3</sup>)** |
| 2 | f(N) = Θ(N<sup>c</sup>) where c = log<sub>b</sub> a | T(N) = Θ(N<sup>c</sup> log N) | T(N) = 2T(N/2) + N → **O(N log N)** |
| 3 | f(N) = Ω(N<sup>c</sup>) where c > log<sub>b</sub> a | T(N) = Θ(f(N)) | T(N) = 2T(N/2) + N<sup>2</sup> → **O(N<sup>2</sup>)** |

### Applying to Merge Sort

**T(N) = 2 · T(N/2) + O(N)**

- a = 2 (two subproblems)
- b = 2 (each half the size)
- f(N) = N (merging)
- log<sub>b</sub> a = log<sub>2</sub> 2 = 1

Since f(N) = N = N<sup>1</sup> and c = log<sub>b</sub> a, we're in **Case 2**:

**T(N) = O(N log N)**

---

## More Examples

### Maximum Subarray Sum - **O(N log N)**

Find the contiguous subarray with the largest sum.

```python
def max_subarray(arr, low, high):
    if low == high:
        return arr[low]

    mid = (low + high) // 2

    # Conquer: max in left or right half
    left_max = max_subarray(arr, low, mid)
    right_max = max_subarray(arr, mid + 1, high)

    # Combine: max crossing the middle
    cross_max = max_crossing_sum(arr, low, mid, high)

    return max(left_max, right_max, cross_max)
```

**Note**: There's a better **O(N)** algorithm (Kadane's), but this shows divide-and-conquer!

---

### Closest Pair of Points - **O(N log N)**

Find the two closest points in 2D space.

**Naive**: Check all pairs → **O(N<sup>2</sup>)**
**Divide & Conquer**: Split by x-coordinate, solve recursively → **O(N log N)**

---

### Strassen's Matrix Multiplication - **O(N<sup>2.807</sup>)**

Multiply two matrices faster than the naive **O(N<sup>3</sup>)** approach.

**Key insight**: Use 7 recursive multiplications instead of 8!

**T(N) = 7T(N/2) + O(N<sup>2</sup>)**

By Master Theorem: log<sub>2</sub> 7 ≈ 2.807, so **T(N) = O(N<sup>2.807</sup>)**

---

## When to Use Divide and Conquer

### ✅ Works Well When:
- Problem has **recursive substructure**
- Subproblems are **independent**
- Combining solutions is **efficient**
- Problem size can be **reduced** by a constant factor

### ❌ Doesn't Work When:
- Subproblems **overlap** (use dynamic programming instead!)
- Can't efficiently **combine** solutions
- Problem doesn't naturally divide
- Recursive overhead is too high

## Visualization

<big-o algos="search sort" max="100"></big-o>

Compare divide-and-conquer algorithms (binary search, merge sort) with simpler approaches!

## Divide and Conquer vs Others

| Strategy | When to Use | Examples |
|----------|-------------|----------|
| **Divide & Conquer** | Independent subproblems | Merge Sort, Binary Search |
| **Dynamic Programming** | Overlapping subproblems | Knapsack, Fibonacci |
| **Greedy** | Local optimum = global optimum | Huffman coding, Activity selection |
| **Backtracking** | Need to explore all possibilities | N-Queens, Sudoku |

## Common Patterns

### Pattern 1: Binary Division
Divide into two equal halves.

**Examples**: Binary Search, Merge Sort, Quick Sort
**Complexity**: Usually **O(log N)** or **O(N log N)**

### Pattern 2: Multiple Subproblems
Divide into more than two parts.

**Examples**: Karatsuba multiplication, Strassen
**Complexity**: Depends on number of subproblems

### Pattern 3: Decrease and Conquer
Reduce by a constant, not divide in half.

**Examples**: Insertion sort (reduce by 1), Interpolation search
**Complexity**: Often **O(N)** or worse

## Recursion Tree Analysis

For Merge Sort **T(N) = 2T(N/2) + N**:

```
Level 0:          N              work: N
                 / \
Level 1:       N/2  N/2          work: N/2 + N/2 = N
              /  \  /  \
Level 2:    N/4 N/4 N/4 N/4      work: 4 × N/4 = N
...
Level log N: 1 1 1 ... 1         work: N × 1 = N

Total: N × log N levels = O(N log N)
```

## Key Takeaways

1. **Divide and Conquer** breaks problems into independent subproblems
2. Achieves efficient complexity by reducing problem size recursively
3. **Master Theorem** helps analyze recurrence relations
4. **Binary Search** and **Merge Sort** are classic examples
5. Works best when subproblems are independent
6. If subproblems overlap, use Dynamic Programming instead

> [!TIP]
> When you see a problem that can be split into smaller versions of itself, think divide and conquer! Ask: "If I could solve this for half the data, could I solve it for all the data?"

## Interactive Comparison

<algo-race type="sort" size="150"></algo-race>

Merge Sort (divide and conquer) vs Bubble Sort (simple iteration) - see the dramatic difference!
