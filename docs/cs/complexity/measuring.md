# Measuring Efficiency

## How do we measure 'effort'?

When we talk about algorithmic efficiency, we need a way to measure how much work an algorithm does. We could measure:

- **Time**: How long does it take to run?
- **Instructions**: How many steps does the computer execute?
- **Operations**: How many comparisons, swaps, or calculations happen?

All of these are related - more operations means more instructions, which takes more time.

## Why not just use seconds?

You might think we could just time algorithms with a stopwatch. But this has problems:

- Different computers run at different speeds
- The same algorithm might run faster or slower depending on what else your computer is doing
- Small inputs complete so quickly it's hard to measure accurately

Instead, computer scientists **count operations** as the input size grows.

## Example: Finding a value in a list

Imagine searching for a specific number in a list:

**Linear search**: Check each item one by one until you find it (or reach the end)
- With 10 items: up to 10 checks
- With 100 items: up to 100 checks
- With 1,000 items: up to 1,000 checks

**Binary search**: Divide the sorted list in half repeatedly
- With 10 items: up to 4 checks
- With 100 items: up to 7 checks
- With 1,000 items: up to 10 checks

Notice how binary search barely grows compared to linear search!

## Try it yourself

Watch how these two search algorithms race against each other:

<algo-race type="search" size="100"></algo-race>

Adjust the size to see how the gap widens as N increases.

## Counting what matters

We focus on the **dominant operation** - the one that happens most often:

- For **searching**: counting comparisons
- For **sorting**: counting comparisons or swaps
- For **graph algorithms**: counting edge or node visits

## Best, Average, and Worst Case

Algorithms can perform differently depending on the input:

| Case | Description | Example |
|------|-------------|---------|
| **Best** | The luckiest scenario | The item you're searching for is the first one |
| **Average** | Typical performance across random inputs | On average, you find it halfway through |
| **Worst** | The unluckiest scenario | The item is the very last one (or not there at all) |

We usually focus on **worst case** because it guarantees performance - you know it won't be any slower than that.

## Key Insight

What matters most is **how the effort grows as N increases**, not the exact number of operations. An algorithm that needs 1000N operations is much better than one that needs N<sup>2</sup> operations once N gets large enough!

> [!TIP]
> Think of complexity as **how an algorithm scales** rather than how fast it runs on any particular input.
