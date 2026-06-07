# Time vs Space Complexity

## Two ways to measure efficiency

When we analyze algorithms, we can measure:

1. **Time complexity**: How many operations does it perform?
2. **Space complexity**: How much memory does it use?

Both are important, but they often involve a **trade-off**.

## Time Complexity (Speed)

This measures how long an algorithm takes to run as the input size grows.

- **Fast algorithms**: Few operations, completes quickly
- **Slow algorithms**: Many operations, takes longer

Example: Searching through a list of N items linearly takes N operations in the worst case.

## Space Complexity (Memory)

This measures how much additional memory an algorithm needs beyond the input itself.

- **Memory-efficient**: Uses little extra space
- **Memory-hungry**: Requires lots of extra storage

Example: Merge sort needs extra space to hold temporary arrays while sorting.

## The Trade-off

Often, making an algorithm **faster** requires using **more memory**, and saving memory might make it **slower**.

### Example 1: Fibonacci Numbers

Calculate the 10th Fibonacci number (1, 1, 2, 3, 5, 8, 13, 21, 34, 55...)

| Approach | Time Complexity | Space Complexity | Description |
|----------|----------------|------------------|-------------|
| Recursive (naive) | **O(2<sup>N</sup>)** | **O(N)** | Very slow, recalculates same values repeatedly |
| Dynamic Programming | **O(N)** | **O(N)** | Store all previous values in an array |
| Iterative | **O(N)** | **O(1)** | Only remember the last two values |

The iterative approach is the best of both worlds - fast AND memory-efficient!

### Example 2: Searching

| Algorithm | Time | Space | Note |
|-----------|------|-------|------|
| Linear Search | **O(N)** | **O(1)** | No extra memory needed |
| Binary Search | **O(log N)** | **O(1)** | Requires sorted data |
| Hash Table | **O(1)** | **O(N)** | Fast lookup but uses extra memory |

Binary search is much faster but only works on sorted data. Hash tables are even faster but require storing the entire dataset in a special structure.

## When does it matter?

### Time matters when:
- Processing large datasets
- Running real-time systems (games, audio processing)
- Serving many users simultaneously

### Space matters when:
- Working on devices with limited memory (embedded systems, mobile)
- Processing data larger than available RAM
- Running many processes simultaneously

## Modern Context

On modern computers:
- **Memory is relatively cheap** - most computers have gigabytes of RAM
- **Time is precious** - users expect instant responses

So we often choose faster algorithms that use more memory, unless we're working with constrained devices or truly massive datasets.

> [!NOTE]
> **Space-time trade-off**: You can almost always make an algorithm faster by using more memory (caching results, preprocessing data), or save memory by doing more calculations on-the-fly.

## Quick Decision Guide

| Situation | Priority | Strategy |
|-----------|----------|----------|
| Embedded system (Arduino, sensor) | **Space** | Use iterative algorithms, avoid recursion |
| Web server | **Time** | Cache aggressively, use fast lookups |
| Mobile app | **Balance** | Optimize hot paths, lazy-load data |
| Big data processing | **Both** | Use external storage, stream processing |
| Real-time system | **Time** | Pre-compute, allocate memory upfront |

## Key Insight

The best algorithm depends on your constraints. Sometimes a "slower" algorithm is better if it uses less memory, or vice versa. **Always consider your actual requirements** rather than optimizing blindly!

> [!TIP]
> If you have plenty of memory, trade space for speed. If memory is tight, trade speed for space. Know your bottleneck!
