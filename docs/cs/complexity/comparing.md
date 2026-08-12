# Comparing Algorithms

## How to compare fairly

When comparing algorithms, we need to be careful about what we measure and how we measure it. Big-O notation gives us a fair way to compare algorithms independent of hardware or implementation details.

## The Three-Step Comparison Process

### 1. Identify the Complexity

First, figure out the Big-O notation for each algorithm:

| Algorithm | Complexity |
|-----------|------------|
| Linear Search | **O(N)** |
| Binary Search | **O(log N)** |
| Bubble Sort | **O(N<sup>2</sup>)** |
| Merge Sort | **O(N log N)** |

### 2. Compare Growth Rates

Use the hierarchy: lower complexity is generally better.

**O(1) < O(log N) < O(N) < O(N log N) < O(N<sup>2</sup>) < O(N<sup>3</sup>) < O(2<sup>N</sup>) < O(N!)**

So: Binary Search beats Linear Search because **O(log N) < O(N)**

### 3. Consider Constants and Hidden Factors

For algorithms with the **same** Big-O:
- Implementation details matter
- Constants matter
- Cache behavior matters
- Average vs worst-case matters

## Visual Comparison: Searching

Compare how linear search scales vs binary search:

<algo-race type="search" size="200"></algo-race>

Adjust the size slider - notice how binary search stays fast even with huge arrays!

## Visual Comparison: Sorting

Compare quadratic vs log-linear sorting:

<algo-race type="sort" size="100"></algo-race>

The gap widens dramatically as N increases!

## When Lower Complexity Loses (Small N)

Sometimes a higher complexity algorithm is faster for small inputs!

**Example**: Insertion Sort vs Merge Sort

| Input Size | Insertion Sort **O(N<sup>2</sup>)** | Merge Sort **O(N log N)** | Winner |
|------------|------------------------|-------------------------|---------|
| 10 items | ~50 operations | ~33 operations | Merge Sort |
| 50 items | ~1,250 operations | ~282 operations | Merge Sort |
| 100 items | ~5,000 operations | ~664 operations | Merge Sort |

Wait, Insertion Sort should be worse! But:

- Insertion Sort has **very low overhead** (simple swaps)
- Merge Sort needs **extra memory allocation** and **array copying**

For tiny arrays (~5-10 items), Insertion Sort is often faster in practice!

> [!NOTE]
> Many optimized libraries use **hybrid** approaches: Merge Sort switches to Insertion Sort for small subarrays.

## Interactive Algorithm Explorer

Compare different algorithm categories side-by-side:

<big-o algos="search" max="1024" step="x2"></big-o>

Toggle linear vs binary search to see their operation counts diverge.

<big-o algos="sort" max="1024" step="x2"></big-o>

Compare different sorting approaches.

## Real-World Considerations

Big-O is essential, but not the whole story:

### ✅ Use Big-O for:
- **Scalability**: Will this work with 1 million items?
- **Comparison**: Which algorithm class is better?
- **Theoretical limits**: Is this approach fundamentally flawed?

### ⚠️ Also consider:
- **Space complexity**: Does it use too much memory?
- **Cache locality**: Does it access memory efficiently?
- **Implementation complexity**: Is it worth the extra code?
- **Average vs worst case**: What's the typical performance?
- **Practical constraints**: How large is n really?

## Example Comparison: Finding Duplicates

### Approach 1: Nested Loops
```python
def has_duplicates_v1(items):
    for i in range(len(items)):
        for j in range(i+1, len(items)):
            if items[i] == items[j]:
                return True
    return False
```
- **Time**: **O(N<sup>2</sup>)** - checks every pair
- **Space**: **O(1)** - no extra memory
- **Simple**: Easy to understand

### Approach 2: Sorting First
```python
def has_duplicates_v2(items):
    sorted_items = sorted(items)  # O(n log n)
    for i in range(len(sorted_items)-1):  # O(n)
        if sorted_items[i] == sorted_items[i+1]:
            return True
    return False
```
- **Time**: **O(N log N)** - sorting dominates
- **Space**: **O(N)** - new sorted array
- **Faster**: Much better for large N

### Approach 3: Hash Set
```python
def has_duplicates_v3(items):
    seen = set()
    for item in items:
        if item in seen:
            return True
        seen.add(item)
    return False
```
- **Time**: **O(N)** - single pass
- **Space**: **O(N)** - stores all items
- **Fastest**: Best asymptotic complexity

### Which to use?

| Scenario | Best Choice | Why |
|----------|-------------|-----|
| Small lists (N < 100) | Any works | All are fast enough |
| Large lists (N > 10,000) | Hash Set | **O(N)** beats everything |
| Memory constrained | Nested Loops | Uses no extra space |
| Already sorted data | Skip sorting | Check neighbors only |

## Best, Average, and Worst Case

Some algorithms have different complexities depending on the input:

### Quick Sort Example

| Case | Complexity | When |
|------|------------|------|
| **Best** | **O(N log N)** | Pivot always splits evenly |
| **Average** | **O(N log N)** | Random pivots |
| **Worst** | **O(N<sup>2</sup>)** | Already sorted + poor pivot choice |

In practice, Quick Sort is often faster than Merge Sort (despite both being **O(N log N)**) because:
- Better cache locality
- In-place (less memory)
- Good average performance with random pivots

## Apples-to-Apples Comparison

Make sure you're comparing fairly:

### ✅ Fair:
- Both algorithms solve the **same problem**
- Measured on the **same inputs**
- Focus on **large n** for asymptotic behaviour

### ❌ Unfair:
- Comparing different problems (sorting vs searching)
- One is optimized, other is naive implementation
- Only testing tiny inputs (constants dominate)

## Interactive Full Comparison

Explore algorithms across categories:

<big-o algos="" max="1024" step="x2"></big-o>

Notice how:
- Search algorithms (**O(N)** and **O(log N)**) stay manageable
- Sorting algorithms (**O(N<sup>2</sup>)** and **O(N log N)**) grow faster
- NP-complete problems (TSP, Knapsack) explode exponentially

## Key Takeaways

1. **Big-O is for large N** - constants matter for small inputs
2. **Lower complexity usually wins** - but not always for small N
3. **Consider trade-offs** - time vs space, simplicity vs performance
4. **Test your assumptions** - profile real performance when it matters
5. **Know the problem size** - if n is always small, don't over-optimize

> [!TIP]
> Start with the simplest algorithm that meets your performance requirements. Only optimize if profiling shows it's a bottleneck!
