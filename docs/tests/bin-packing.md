# Bin Packing Solver

> Interactive 1D bin packing solver with brute force, next-fit, best-fit, and comparison modes

## What is the Bin Packing problem?

In the **1D bin packing problem**, you have:

- **N items**, each with a size
- **Bins** with a fixed capacity

You must pack all items into the **minimum number of bins** so that:

- no bin exceeds its capacity
- the total number of bins used is minimized

This is a classic optimization problem with many real-world applications like loading trucks, memory allocation, and task scheduling.

## Visual representation

Each bin is shown as a vertical container with capacity. Items are stacked from bottom to top, with each item's height proportional to its size. The remaining space is shown with diagonal stripes.

## Default (Brute Force, Normal Speed)

Brute force guarantees the optimal solution by checking all possible packings. Extremely slow for large problems due to O(n<sup>n</sup>) complexity.

<bin-packing></bin-packing>

## Brute Force - Slow

<bin-packing speed="slow"></bin-packing>

## Next Fit - Normal Speed

Next fit packs items sequentially. If an item doesn't fit in the current bin, open a new bin. Simple but not optimal.

<bin-packing method="next-fit"></bin-packing>

## Next Fit - Slow

<bin-packing method="next-fit" speed="slow"></bin-packing>

## Best Fit - Normal Speed

Best fit places each item in the bin with the least remaining space that can still fit it. Better results than next fit, but still not guaranteed optimal.

<bin-packing method="best-fit"></bin-packing>

## Best Fit - Fast

<bin-packing method="best-fit" speed="fast"></bin-packing>

## Custom Capacity

<bin-packing capacity="15"></bin-packing>

## Fixed Items

Pack specific items: 3, 5, 8, 3, 5, 9 into bins of capacity 10.

<bin-packing capacity="10" items="3 5 8 3 5 9"></bin-packing>

## Larger Problem

<bin-packing capacity="20" items="4 8 1 4 2 1 5 10 6 9 4 8 2 3"></bin-packing>

## Compare: Next Fit vs. Brute Force

See how the fast next-fit heuristic compares to the optimal brute-force solution. Brute force guarantees the minimum number of bins but is exponentially slower.

<bin-packing method="compare-next-fit" capacity="10" items="3 5 2 7 4 1 6"></bin-packing>

## Compare: Best Fit vs. Brute Force

Best fit often produces near-optimal results. See how close it gets to the perfect solution.

<bin-packing method="compare-best-fit" capacity="12" items="4 8 1 4 2 1 5 3"></bin-packing>

## Instant Speed

For large problems, use instant mode to skip animations and see results immediately.

<bin-packing method="best-fit" speed="instant" capacity="15"></bin-packing>

## Algorithms Overview

### Brute Force - O(n<sup>n</sup>)

Tries all possible packings to find the absolute minimum number of bins. Guarantees optimal solution but extremely slow for large n. At each step, can place an item in any existing bin or create a new bin, leading to exponential branching.

### Next Fit - O(n)

- Process items in order
- If item fits in current bin, place it there
- Otherwise, open a new bin
- **Fast** but can use up to **twice** the optimal number of bins

### Best Fit - O(n<sup>2</sup>)

- For each item, check all existing bins
- Place item in the bin with least remaining space that fits
- If no bin fits, open a new bin
- **Better results** than next fit, but still not guaranteed optimal

## Real-World Applications

- **Shipping & Logistics**: Loading items into trucks, containers
- **Memory Management**: Allocating variable-sized blocks in computer memory
- **Task Scheduling**: Assigning tasks to time slots or processors
- **Cutting Stock**: Minimizing waste when cutting materials
