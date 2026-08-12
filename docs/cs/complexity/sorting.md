# Sorting Complexity

## Why Sorting Matters

Sorting is one of the most fundamental operations in computer science. Almost every program sorts data at some point, and the efficiency of sorting algorithms has been studied extensively.

## Complexity Classes for Sorting

### Slow Sorts: **O(N<sup>2</sup>)** - Quadratic
Simple but inefficient for large datasets.

**Examples**: Bubble Sort, Selection Sort, Insertion Sort

### Fast Sorts: **O(N log N)** - Log-Linear
Optimal for comparison-based sorting.

**Examples**: Merge Sort, Quick Sort, Heap Sort

### Special Sorts: **O(N)** - Linear
Only work under specific conditions (not comparison-based).

**Examples**: Counting Sort, Radix Sort, Bucket Sort

## Visual Comparison

Watch how quadratic sorts struggle compared to efficient sorts:

<algo-race type="sort" size="100"></algo-race>

Try increasing the size to see the gap widen dramatically!

## Common Sorting Algorithms

### Bubble Sort - **O(N<sup>2</sup>)**

The simplest sort: repeatedly swap adjacent elements if they're in wrong order.

```python
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(n - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
```

| Property | Value |
|----------|-------|
| **Best Case** | **O(N)** (already sorted, with optimization) |
| **Average Case** | **O(N<sup>2</sup>)** |
| **Worst Case** | **O(N<sup>2</sup>)** (reversed) |
| **Space** | **O(1)** (in-place) |
| **Stable?** | ✅ Yes |

**When to use**: Never (except for teaching)! Too slow.

---

### Selection Sort - **O(N<sup>2</sup>)**

Find the minimum element and swap it to the front, repeat.

```python
def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
```

| Property | Value |
|----------|-------|
| **Best Case** | **O(N<sup>2</sup>)** |
| **Average Case** | **O(N<sup>2</sup>)** |
| **Worst Case** | **O(N<sup>2</sup>)** |
| **Space** | **O(1)** (in-place) |
| **Stable?** | ❌ No (can be made stable) |

**When to use**: When memory writes are expensive (fewest swaps).

---

### Insertion Sort - **O(N<sup>2</sup>)**

Build sorted array one element at a time by inserting into correct position.

```python
def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
```

| Property | Value |
|----------|-------|
| **Best Case** | **O(N)** (already sorted) |
| **Average Case** | **O(N<sup>2</sup>)** |
| **Worst Case** | **O(N<sup>2</sup>)** (reversed) |
| **Space** | **O(1)** (in-place) |
| **Stable?** | ✅ Yes |

**When to use**: Small arrays, nearly sorted data, online sorting.

---

### Merge Sort - **O(N log N)**

Divide array in half, sort each half, merge them together.

```python
def merge_sort(arr):
    if len(arr) <= 1:
        return arr

    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])

    return merge(left, right)
```

| Property | Value |
|----------|-------|
| **Best Case** | **O(N log N)** |
| **Average Case** | **O(N log N)** |
| **Worst Case** | **O(N log N)** |
| **Space** | **O(N)** (needs extra arrays) |
| **Stable?** | ✅ Yes |

**When to use**: Guaranteed **O(N log N)** performance, stable sort needed, linked lists.

---

### Quick Sort - **O(N log N)** average

Choose a pivot, partition around it, recursively sort partitions.

```python
def quick_sort(arr):
    if len(arr) <= 1:
        return arr

    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]

    return quick_sort(left) + middle + quick_sort(right)
```

| Property | Value |
|----------|-------|
| **Best Case** | **O(N log N)** (balanced partitions) |
| **Average Case** | **O(N log N)** |
| **Worst Case** | **O(N<sup>2</sup>)** (bad pivot choices) |
| **Space** | **O(log N)** (recursion stack) |
| **Stable?** | ❌ No (can be made stable) |

**When to use**: General-purpose sorting (most programming languages use this internally).

---

### Heap Sort - **O(N log N)**

Build a heap structure, repeatedly extract the maximum.

| Property | Value |
|----------|-------|
| **Best Case** | **O(N log N)** |
| **Average Case** | **O(N log N)** |
| **Worst Case** | **O(N log N)** |
| **Space** | **O(1)** (in-place) |
| **Stable?** | ❌ No |

**When to use**: When you need **O(N log N)** worst-case AND in-place sorting.

---

## Interactive Comparison

Compare different sorting algorithms:

<big-o algos="sort" max="100"></big-o>

Toggle algorithms on/off to see:
- Bubble, Selection, Insertion all grow as **O(N<sup>2</sup>)**
- Merge, Quick, Heap all grow as **O(N log N)**

## The Theoretical Lower Bound

**Fact**: You cannot sort using comparisons faster than **O(N log N)** in the worst case!

**Why?** There are N! possible orderings. To distinguish between them, you need at least log<sub>2</sub>(N!) comparisons, which is Θ(N log N).

So **Merge Sort is optimal** for comparison-based sorting!

## Non-Comparison Sorts

These sorts don't compare elements directly, so they can beat **O(n log n)**:

### Counting Sort - **O(n + k)**
When elements are integers in range [0, k].

**Example**: Sorting ages (0-120)
- Count occurrences of each age
- Reconstruct sorted array from counts
- Time: **O(n + 120) = O(n)**

### Radix Sort - **O(d · n)**
Sort by each digit, where d is number of digits.

**Example**: Sorting 32-bit integers
- Sort by least significant digit, then next, etc.
- 32 bits = 4 bytes = 4 passes
- Time: **O(4n) = O(n)**

### When to use non-comparison sorts:
- Data is integers in limited range
- Strings with limited character sets
- You need linear time performance

> [!NOTE]
> Non-comparison sorts trade time for space or have input restrictions. They're not "better" than **O(n log n)** sorts - just different!

## Choosing a Sorting Algorithm

| Situation | Best Choice | Why |
|-----------|-------------|-----|
| **General purpose** | Quick Sort | Fast average case, in-place |
| **Guaranteed O(n log n)** | Merge Sort or Heap Sort | No worst-case degradation |
| **Small data** | Insertion Sort | Low overhead, simple |
| **Nearly sorted** | Insertion Sort | **O(n)** best case |
| **Stable sort needed** | Merge Sort | Preserves relative order |
| **Limited memory** | Heap Sort | In-place, **O(n log n)** |
| **Integers in range** | Counting Sort | Linear time |
| **Teaching/understanding** | Bubble Sort | Very simple concept |

## Algorithm Race With Different Sizes

Small dataset (60 items):

<algo-race type="sort" size="60"></algo-race>

Large dataset (200 items):

<algo-race type="sort" size="200"></algo-race>

Notice how the gap widens as n increases!

## Practical Sorting in Libraries

Real-world sorting libraries use **hybrid approaches**:

### Python's Timsort
- Combines Merge Sort and Insertion Sort
- Uses Insertion Sort for small subarrays
- Optimized for real-world data patterns
- **O(n log n)** worst case, often better in practice

### Java's Dual-Pivot Quick Sort
- Uses Quick Sort with two pivots
- Switches to Insertion Sort for small partitions
- **O(n log n)** average, **O(n<sup>2</sup>)** worst (rare)

### C++ std::sort
- Uses Introsort (hybrid of Quick Sort, Heap Sort, Insertion Sort)
- Starts with Quick Sort
- Switches to Heap Sort if recursion too deep
- Uses Insertion Sort for small partitions
- Guaranteed **O(n log n)**

## Key Takeaways

1. **O(n<sup>2</sup>) sorts** are simple but too slow for large data
2. **O(n log n) sorts** are optimal for comparison-based sorting
3. **Merge Sort** guarantees **O(n log n)** and is stable
4. **Quick Sort** is fastest on average but can degrade to **O(n<sup>2</sup>)**
5. **Insertion Sort** is best for small or nearly-sorted data
6. **Non-comparison sorts** can achieve **O(n)** with restrictions
7. Real libraries use **hybrid** approaches for best real-world performance

> [!TIP]
> For most programming tasks, use your language's built-in sort - it's highly optimized! Only implement custom sorting if you have specific requirements or constraints.
