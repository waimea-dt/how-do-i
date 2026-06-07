# Search Complexity

## The Fundamental Problem

Searching is one of the most common operations in computing: finding a specific element in a collection. The efficiency of search algorithms depends heavily on the data structure and whether the data is sorted.

## Complexity Classes for Searching

### Linear Search: **O(N)**
Check every element until you find the target (or reach the end).

### Binary Search: **O(log N)**
Repeatedly divide a sorted array in half to narrow down the location.

### Hash Table: **O(1)** average
Use a hash function to compute the location directly.

## Visual Comparison

Watch how binary search dramatically outperforms linear search:

<algo-race type="search" size="100"></algo-race>

Try increasing the size to see the gap widen!

## Linear Search - **O(N)**

The simplest search: check each element one by one.

```python
def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1  # Not found
```

### Complexity Analysis

| Case | Comparisons | Description |
|------|-------------|-------------|
| **Best** | **O(1)** | Target is the first element |
| **Average** | **O(N/2) = O(N)** | Target is in the middle on average |
| **Worst** | **O(N)** | Target is last element or not present |

### Properties
- ✅ Works on **unsorted** data
- ✅ Works on any data structure (arrays, linked lists)
- ✅ Very simple to implement
- ❌ Slow for large datasets

### When to use:
- Small datasets (< 100 items)
- Unsorted data
- Linked lists (can't do binary search)
- Data that changes frequently

---

## Binary Search - **O(log N)**

Divide and conquer on **sorted** arrays: compare middle element, eliminate half the search space.

```python
def binary_search(sorted_arr, target):
    low, high = 0, len(sorted_arr) - 1

    while low <= high:
        mid = (low + high) // 2

        if sorted_arr[mid] == target:
            return mid
        elif sorted_arr[mid] < target:
            low = mid + 1  # Search right half
        else:
            high = mid - 1  # Search left half

    return -1  # Not found
```

### How It Works

For an array of size 16:
1. Check element 8 → wrong half? (down to 8 elements)
2. Check element 4 or 12 → wrong half? (down to 4 elements)
3. Check element 2, 6, 10, or 14 → wrong half? (down to 2 elements)
4. Check remaining element → found or not found!

Maximum steps: log<sub>2</sub>(16) = 4 comparisons

### Complexity Analysis

| Case | Comparisons | Description |
|------|-------------|-------------|
| **Best** | **O(1)** | Target is the middle element first try |
| **Average** | **O(log N)** | Target requires typical binary splits |
| **Worst** | **O(log N)** | Target is at leaf of search tree or not present |

### Properties
- ⚠️ Requires **sorted** data
- ✅ Extremely fast for large datasets
- ✅ Predictable performance
- ❌ Doesn't work on linked lists efficiently

### When to use:
- Large sorted datasets
- Data doesn't change frequently (or sort once, search many times)
- Random access data structure (arrays)

---

## Interactive Exploration

Compare search performance across different sizes:

### Small dataset (20 items):
<algo-race type="search" size="20"></algo-race>

### Medium dataset (100 items):
<algo-race type="search" size="100"></algo-race>

### Large dataset (200 items):
<algo-race type="search" size="200"></algo-race>

Notice how the gap widens as N increases!

## Growth Rate Comparison

<big-o algos="search" max="200"></big-o>

Toggle the algorithms to see how linear search grows steadily while binary search barely increases!

### Concrete Numbers

| Array Size | Linear (worst) | Binary (worst) | Speedup |
|------------|----------------|----------------|---------|
| 10 | 10 | 4 | 2.5× |
| 100 | 100 | 7 | 14× |
| 1,000 | 1,000 | 10 | 100× |
| 10,000 | 10,000 | 14 | 714× |
| 1,000,000 | 1,000,000 | 20 | 50,000× |
| 1,000,000,000 | 1,000,000,000 | 30 | 33,000,000× |

For a billion items, binary search needs only **30 comparisons**!

## Hash Tables - **O(1)** Average

Use a hash function to compute where to look directly.

```python
def hash_search(hash_table, target):
    index = hash(target) % len(hash_table)
    return hash_table[index]
```

### How It Works

1. Compute `hash(target)` to get an integer
2. Use modulo to map to table index: `index = hash(target) % table_size`
3. Look up that index directly

### Properties

| Property | Value |
|----------|-------|
| **Average Case** | **O(1)** |
| **Worst Case** | **O(n)** (all elements collide) |
| **Space** | **O(n)** (store all elements) |
| **Sorted?** | No requirement |

- ✅ **Fastest** average case
- ✅ Works on unsorted data
- ✅ Insertions and deletions also **O(1)**
- ❌ Uses extra memory
- ❌ No order information (can't find "next" or "previous")
- ❌ Worst case can degrade with collisions

### When to use:
- Need fastest possible lookups
- Frequent insertions/deletions
- Have enough memory
- Don't need ordering

---

## Search in Different Data Structures

| Data Structure | Search Time | Notes |
|----------------|-------------|-------|
| **Unsorted Array** | **O(N)** | Linear search only |
| **Sorted Array** | **O(log N)** | Binary search |
| **Linked List** | **O(N)** | Must traverse, even if sorted |
| **Hash Table** | **O(1)** avg | Fast but uses memory |
| **Binary Search Tree** | **O(log N)** avg, **O(N)** worst | Depends on balance |
| **Balanced BST** | **O(log N)** | AVL, Red-Black trees |
| **B-Tree** | **O(log N)** | Used in databases |
| **Trie** | **O(m)** | Where m is key length, for strings |

## When Sorting Pays Off

Sometimes it's worth sorting first to enable binary search:

**Example**: Search 1000 times in an array of 10,000 elements

### Without sorting:
- Searches: 1000 × 10,000 = 10,000,000 operations

### With sorting:
- Sort once: 10,000 × log<sub>2</sub>(10,000) ≈ 133,000 operations
- Searches: 1000 × 14 = 14,000 operations
- **Total**: 147,000 operations

**Speedup**: 68× faster!

> [!NOTE]
> If you search **many times** in the same data, it's worth sorting first!

## String Searching

Searching for substrings is a specialized problem:

| Algorithm | Time Complexity | Use Case |
|-----------|----------------|----------|
| **Naive** | **O(n · m)** | Simple, no preprocessing |
| **Rabin-Karp** | **O(n + m)** avg | Multiple pattern searches |
| **KMP** | **O(n + m)** | Single pattern, guaranteed |
| **Boyer-Moore** | **O(n)** avg, **O(n · m)** worst | Often fastest in practice |

Where n is text length and m is pattern length.

## Choosing a Search Algorithm

| Situation | Best Choice | Why |
|-----------|-------------|-----|
| **Unsorted, few searches** | Linear Search | Not worth sorting |
| **Sorted array** | Binary Search | Fast **O(log n)** |
| **Many searches, can sort** | Sort + Binary Search | Amortize sort cost |
| **Frequent updates** | Hash Table | **O(1)** insert/search/delete |
| **Need ordering** | Balanced BST | **O(log n)** + sorted iteration |
| **Database** | B-Tree or Hash Index | Optimized for disk access |
| **In-memory cache** | Hash Table | Fastest lookups |

## Search with Doubling Size

See how binary search barely grows even when we double the input exponentially:

<big-o algos="search" step="x2" max="1024"></big-o>

Even with 1024 elements, binary search needs only about 10 comparisons!

## Key Takeaways

1. **Linear search** **O(n)**: Simple, works on unsorted data, slow for large n
2. **Binary search** **O(log n)**: Very fast, requires sorted data
3. **Hash tables** **O(1)** average: Fastest, uses extra memory
4. Sorting once to enable many binary searches is often worthwhile
5. The right choice depends on: data size, how often you search, whether data is sorted/changes

> [!TIP]
> For most problems: Use hash tables if you just need to check existence. Use binary search if data is sorted and you need ordering. Use linear search only for small or unsorted data that won't be searched often.

## Interactive Playground

Explore different scenarios:

<algo-race type="search" size="150" target="75"></algo-race>

Try adjusting parameters to see how search performance changes!
