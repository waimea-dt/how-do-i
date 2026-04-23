# Knapsack Solver

> Interactive 0/1 knapsack solver with brute force, dynamic programming, greedy, and comparison modes

## What is the Knapsack problem?

In the **0/1 knapsack problem**, each item has:

- a **weight**
- a **value**

You must choose which items to pack so that:

- the **total weight** stays within the bag capacity $W$
- the **total value** is as large as possible

Each item can be used **once or not at all**.

## Visual idea

The bag is drawn as one long capacity block. Each chosen item becomes a slice whose width matches its weight. Higher-value items use a deeper colour, so you can see both **space used** and **value gained** at the same time.

## Brute force

Brute force checks every subset of items. That guarantees the best answer, but it grows as $2^n$.

<knapsack capacity="10" items="2|3 3|4 4|5 5|8 9|10"></knapsack>

For small item sets, the solver view now includes a compact decision tree so students can see branch choices without a huge full tree.

## Dynamic programming

Dynamic programming is still exact, but it fills a table instead of checking every subset. The table view shows how each item changes the best value at each capacity.

<knapsack solve="dynamic" capacity="12" items="2|3 3|4 4|5 5|8 7|9 9|10"></knapsack>

## Greedy by value-to-weight ratio

Greedy sorts items by value per unit of weight. It is fast, but it can miss the best answer.

<knapsack solve="greedy" capacity="10" items="6|30 3|14 4|16 2|9"></knapsack>

## Greedy vs. optimal

This set is useful because greedy makes a tempting early choice, but brute force finds a better combination.

<knapsack solve="compare-greedy" capacity="10" items="6|30 3|14 4|16 2|9"></knapsack>

## Dynamic vs. brute force

Dynamic programming and brute force should end with the same best value. The comparison shows how much work each approach does.

<knapsack solve="compare-dynamic" capacity="16" items="2|3 3|4 4|8 5|8 7|10 8|13 9|14"></knapsack>

## Speed control

You can tune animation speed with a `speed` attribute:

- `slow`
- `normal` (default)
- `fast`
- `instant`

Example:

<knapsack solve="greedy" speed="slow" capacity="12" items="2|3 3|4 4|6 5|8 6|11"></knapsack>

## Inline item editing

Each widget now has an inline item editor table:

- change weights and values directly
- add/remove rows
- click **Apply edits** to rebuild the item cards and rerun

This works well for quick class experiments without rewriting markdown attributes.

## In-widget capacity control

Each widget also has a capacity slider and number box, so students can change $W$ directly while testing item combinations.

## Attributes

- `capacity`: maximum weight allowed in the bag
- `items`: space-separated `weight|value` pairs
- `solve`: algorithm mode
  - `brute`
  - `dynamic`
  - `greedy`
  - `compare-dynamic`
  - `compare-greedy`
- `speed`: animation speed
  - `slow`
  - `normal`
  - `fast`
  - `instant`

## Suggested teaching use

This version uses one main visual language for all solvers:

- **same bag view** for what is currently packed and what is best so far
- **dynamic table** only for dynamic programming, because table structure is the idea students need to notice
- **ranked item list** for greedy, because the ordering rule is the key idea
- **no full brute-force tree** by default, because it becomes noisy fast and stops helping once the item count grows

That means students keep one mental model while each solver gets one extra teaching aid only when it matters.