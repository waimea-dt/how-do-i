# Comparing Algorithms

## How to compare fairly

When comparing algorithms, we need to be careful about what we measure and how we measure it. Big-O notation gives us a fair way to compare algorithms independent of hardware or implementation details.

## The Three-Step Comparison Process

### 1. Identify the Complexity

First, figure out the Big-O notation for each algorithm:

| Algorithm     | Complexity           |
| ------------- | -------------------- |
| Linear Search | **O(N)**             |
| Binary Search | **O(log N)**         |
| Bubble Sort   | **O(N<sup>2</sup>)** |
| Merge Sort    | **O(N log N)**       |

### 2. Compare Growth Rates

Use the hierarchy: lower complexity is generally better.

| Complexity   | Big-O                |
| ------------ | -------------------- |
| Low (better) | **O(1)**             |
|              | **O(log N)**         |
|              | **O(N)**             |
|              | **O(N log N)**       |
|              | **O(N<sup>2</sup>)** |
|              | **O(N<sup>3</sup>)** |
|              | **O(2<sup>N</sup>)** |
| High (worse) | **O(N!)**            |

So: Binary Search beats Linear Search because **O(log N) has lower complexity than O(N)**

### 3. Consider Constants and Hidden Factors

For algorithms with the **same** Big-O:
- Implementation details matter
- Constants matter
- Average vs worst-case matters


## Comparison: Searching

Compare how linear search scales vs binary search:

<algo-race type="search" size="100"></algo-race>

Adjust the size slider - notice how binary search stays fast even with huge arrays!

<big-o algos="search" max="1024" step="x2"></big-o>

Toggle linear vs binary search to see their operation counts diverge.


## Comparison: Sorting

Compare quadratic vs log-linear sorting:

<algo-race type="sort" size="100"></algo-race>

The gap widens dramatically as N increases!

<big-o algos="sort-bubble sort-merge" max="1024" step="x2"></big-o>

Compare different sorting approaches - the Bubble Sort is so much worse that the Merge Sort!


## Real-World Considerations

Big-O is essential, but not the whole story:

### ✅ Use Big-O for:
- **Scalability**: Will this work with 1 million items?
- **Comparison**: Which algorithm class is better?
- **Theoretical limits**: Is this approach fundamentally flawed?

### ⚠️ Also consider:
- **Space complexity**: Does it use too much memory?
- **Implementation complexity**: Is it worth the extra code?
- **Average vs worst case**: What's the typical performance?
- **Practical constraints**: How large is N really?


## Best, Average, and Worst Case

Some algorithms have different complexities depending on the input:

### Linear Search Example

| Case        | Complexity | When                                    |
| ----------- | ---------- | --------------------------------------- |
| **Best**    | **O(1)**   | Find item in first position             |
| **Average** | **O(N/2)** | Need to search half the list on average |
| **Worst**   | **O(N)**   | Item is last in the list                |

Focussing on the **worst case** allows us to select algorithms that should work, even with the worst possible input data.


## Apples-to-Apples Comparison

Make sure you're comparing fairly:

### ✅ Fair:
- Both algorithms solve the **same problem**
- Measured on the **same inputs**
- Focus on **large N** for asymptotic behaviour

### ❌ Unfair:
- Comparing different problems (sorting vs searching)
- One is optimized, other is a naive implementation
- Only testing tiny inputs (constants dominate)


## Key Takeaways

1. **Big-O categories are for large N** - constants only matter for small inputs
2. **Consider the worst case** - might never happen, but just in case
3. **Lower complexity usually wins** - but not always for small N
4. **Know the problem size** - if N is always small, don't over-optimize

> [!TIP]
> Start with the simplest algorithm that meets your performance requirements. Only optimize if profiling shows it's a bottleneck!
