# Common Time Complexities

## The Complexity Hierarchy

Here's a practical guide to the time complexities you'll encounter most often, with real-world examples.

## **O(1)** - Constant Time

**The best possible complexity** - the algorithm takes the same time regardless of input size.

### Examples:
- Accessing an array element by index: `arr[5]`
- Checking if a number is even or odd
- Pushing/popping from a stack
- Looking up a value in a hash table (average case)

```python
def is_first_zero(numbers):
    return numbers[0] == 0  # Always 1 check
```

> [!NOTE]
> Constant doesn't mean "fast" - it means the time doesn't grow with N. **O(1)** could be 1 nanosecond or 1 hour, but it's the same for all input sizes.

---

## **O(log N)** - Logarithmic Time

**Very efficient** - grows extremely slowly. Doubling N adds only one step.

### Examples:
- Binary search in sorted array
- Finding an element in a balanced binary search tree
- Operations on heaps (insert, extract-min)

```python
def binary_search(sorted_arr, target):
    low, high = 0, len(sorted_arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if sorted_arr[mid] == target:
            return mid
        elif sorted_arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1
```

**Growth pattern**: N=1000 needs ~10 steps, N=1,000,000 needs ~20 steps

---

## **O(N)** - Linear Time

**Proportional to input** - if you double the input, you double the time.

### Examples:
- Finding the maximum value in an unsorted array
- Summing all elements
- Linear search
- Traversing a linked list

```python
def find_max(numbers):
    max_val = numbers[0]
    for num in numbers:  # Visit each element once
        if num > max_val:
            max_val = num
    return max_val
```

**Growth pattern**: 100 items = 100 ops, 1000 items = 1000 ops

---

## **O(N log N)** - Linearithmic Time

**The "sweet spot" for sorting** - much better than **O(N<sup>2</sup>)** but not as good as **O(N)**.

### Examples:
- Merge sort
- Quick sort (average case)
- Heap sort
- Efficient sorting algorithms

```python
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])    # log n divisions
    right = merge_sort(arr[mid:])
    return merge(left, right)        # n work at each level
```

**Growth pattern**: N=1000 needs ~10,000 ops, N=1,000,000 needs ~20,000,000 ops

<algo-race type="sort" size="100"></algo-race>

Compare **O(N log N)** merge sort with **O(N<sup>2</sup>)** bubble sort!

---

## **O(N<sup>2</sup>)** - Quadratic Time

**Gets slow quickly** - doubling input quadruples the time. Tolerable for small N, impractical for large N.

### Examples:
- Bubble sort
- Selection sort
- Insertion sort
- Checking all pairs in a list (nested loops)

```python
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):           # n iterations
        for j in range(n-1):     # n iterations each
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
```

**Growth pattern**: 100 items = 10,000 ops, 1000 items = 1,000,000 ops

> [!WARNING]
> Be very careful with nested loops! Each additional nesting level adds another power of N.

---

## **O(N<sup>3</sup>)** - Cubic Time

**Very slow** - three nested loops. Only practical for small datasets.

### Examples:
- Matrix multiplication (naive approach)
- Triple nested loops
- Some graph algorithms

```python
def matrix_multiply(A, B):
    n = len(A)
    result = [[0]*n for _ in range(n)]
    for i in range(n):           # n
        for j in range(n):       # × n
            for k in range(n):   # × n = n³
                result[i][j] += A[i][k] * B[k][j]
    return result
```

**Growth pattern**: 100 items = 1,000,000 ops, 1000 items = 1,000,000,000 ops

---

## **O(2<sup>N</sup>)** - Exponential Time

**Impractical for all but tiny inputs** - adding one item doubles the time!

### Examples:
- Generating all subsets of a set
- Naive recursive Fibonacci
- Brute-force traveling salesman

```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)  # Branching recursion
```

**Growth pattern**: N=20 → ~1 million ops, N=30 → ~1 billion ops, N=40 → ~1 trillion ops

> [!DANGER]
> Exponential algorithms are **only usable for tiny inputs** (usually N < 25). Beyond that, they take longer than the age of the universe!

---

## **O(N!)** - Factorial Time

**The worst practical complexity** - used when checking all permutations. Becomes impossible almost immediately.

### Examples:
- Brute-force traveling salesman (checking all routes)
- Generating all permutations
- Some scheduling problems

```python
def all_permutations(items):
    if len(items) <= 1:
        return [items]
    result = []
    for i in range(len(items)):
        rest = items[:i] + items[i+1:]
        for p in all_permutations(rest):
            result.append([items[i]] + p)
    return result
```

**Growth pattern**:
- 10! = 3,628,800
- 15! = 1,307,674,368,000
- 20! = 2,432,902,008,176,640,000

<big-o algos="tsp" max="15"></big-o>

Try exploring how factorial complexity explodes!

---

## Quick Reference

| Complexity | Name | Small N (100) | Large N (10,000) | Practical? |
|------------|------|-----------------|-------------------|-----------|
| **O(1)** | Constant | 1 | 1 | ✅ Always |
| **O(log N)** | Logarithmic | ~7 | ~13 | ✅ Always |
| **O(N)** | Linear | 100 | 10,000 | ✅ Always |
| **O(N log N)** | Linearithmic | ~700 | ~130,000 | ✅ Usually |
| **O(N<sup>2</sup>)** | Quadratic | 10,000 | 100,000,000 | ⚠️ Small N only |
| **O(N<sup>3</sup>)** | Cubic | 1,000,000 | 1,000,000,000,000 | ⚠️ Tiny N only |
| **O(2<sup>N</sup>)** | Exponential | ~10<sup>30</sup> | ~10<sup>3000</sup> | ❌ Almost never |
| **O(N!)** | Factorial | ~10<sup>157</sup> | ~10<sup>35659</sup> | ❌ Never |

> [!TIP]
> Aim for **O(N log N)** or better for any algorithm you expect to run on large datasets!
