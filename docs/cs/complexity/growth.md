# Growth Rates

## Why growth rate matters most

When analyzing algorithms, the **rate at which complexity grows** matters far more than the actual number of operations for small inputs.

Two algorithms might take similar time for N=10, but have wildly different performance for N=10,000.

## Visualizing Growth

Drag the slider to see how different complexity classes diverge as N increases:

<big-o-chart></big-o-chart>

Notice how:
- **Constant** **O(1)** stays flat (doesn't grow at all)
- **Logarithmic** **O(log N)** grows slowly, barely visible
- **Linear** **O(N)** grows steadily at 45°
- **Quadratic** **O(N<sup>2</sup>)** curves upward
- **Exponential** **O(2<sup>N</sup>)** shoots off the chart
- **Factorial** **O(N!)** is already astronomical for small N

## Comparing Growth Patterns

Let's compare specific complexity classes:

### Slow vs Fast Growth

<big-o-chart enabled="o1 ologn on"></big-o-chart>

These three grow so slowly that they remain practical even for huge datasets.

### The Polynomial Family

<big-o-chart enabled="on on2 on3"></big-o-chart>

See how **O(N<sup>2</sup>)** and **O(N<sup>3</sup>)** pull away from linear? This is why we avoid nested loops when possible!

### The Impossible Zone

<big-o-chart enabled="on on2 o2n ofact"></big-o-chart>

Exponential and factorial complexities become impractical almost immediately. They're only viable for tiny inputs.

## Crossover Points

An important concept: **algorithms can have different performance for small vs large N**!

For example:
- Algorithm A: 1000N operations
- Algorithm B: N<sup>2</sup> operations

Which is faster? **It depends on N**!

- For N=10: A takes 10,000 ops, B takes 100 ops → **B wins**
- For N=100: A takes 100,000 ops, B takes 10,000 ops → **B wins**
- For N=1000: A takes 1,000,000 ops, B takes 1,000,000 ops → **Tie**
- For N=10,000: A takes 10,000,000 ops, B takes 100,000,000 ops → **A wins**

The **crossover point** is where the lower-complexity algorithm becomes faster (here, around N=1000).

> [!NOTE]
> This is why algorithm analysis focuses on **large N** - that's where the growth rate dominates and constants become irrelevant.

## Real Operation Counts

Let's make it concrete. Here's how many operations different complexities require:

| N         | **O(log N)** | **O(N)**  | **O(N log N)** | **O(N<sup>2</sup>)** | **O(2<sup>N</sup>)**   | **O(N!)**              |
| --------- | ------------ | --------- | -------------- | -------------------- | ---------------------- | ---------------------- |
| 10        | 3            | 10        | 33             | 100                  | 1,024                  | 3,628,800              |
| 100       | 7            | 100       | 664            | 10,000               | ⚠️ 1.3 × 10<sup>30</sup>  | ⚠️ 9.3 × 10<sup>157</sup> |
| 1,000     | 10           | 1,000     | 9,966          | 1,000,000            | ⚠️ 1.1 × 10<sup>301</sup> | ❌ ~impossible            |
| 10,000    | 13           | 10,000    | 132,877        | 100,000,000          | ❌ ~impossible            | ❌ ~impossible            |
| 1,000,000 | 20           | 1,000,000 | 19,931,569     | 1 × 10<sup>12</sup>  | ❌ ~impossible            | ❌ ~impossible            |


## Doubling Experiment

A useful technique: **see what happens when you double the input size** from 100 to 200.

| Complexity           | When N Doubles...          | Example                       |
| -------------------- | -------------------------- | ----------------------------- |
| **O(1)**             | No change                  | 100 ops → 100 ops             |
| **O(log N)**         | Adds 1 step                | 10 ops → 11 ops               |
| **O(N)**             | Doubles                    | 100 ops → 200 ops             |
| **O(N log N)**       | Slightly more than doubles | 664 ops → 1,396 ops           |
| **O(N<sup>2</sup>)** | Quadruples                 | 10,000 ops → 40,000 ops       |
| **O(N<sup>3</sup>)** | 8× increase                | 1,000,000 ops → 8,000,000 ops |
| **O(2<sup>N</sup>)** | Squares                    | 1,024 ops → 1,048,576 ops     |
| **O(N!)**            | Astronomically worse       | ❌ Already impossible            |

You can use this to identify complexity experimentally! Time your algorithm with inputs of size N and 2N, and see how the time changes.

## The Dominance Hierarchy

When you have multiple terms, **only the fastest-growing term matters** for large N:

**O(N<sup>3</sup> + 10N<sup>2</sup> + 500N + 1000) = O(N<sup>3</sup>)**

Why? As N gets large, the N<sup>3</sup> term completely dominates:

| N     | N<sup>3</sup> | 10N<sup>2</sup> | 500N    | 1000  | Total         |
| ----- | ------------- | --------------- | ------- | ----- | ------------- |
| 10    | 1,000         | 1,000           | 5,000   | 1,000 | 8,000         |
| 100   | 1,000,000     | 100,000         | 50,000  | 1,000 | 1,151,000     |
| 1,000 | 1,000,000,000 | 10,000,000      | 500,000 | 1,000 | 1,010,501,000 |

See how the N<sup>3</sup> term becomes 99%+ of the total? That's why we ignore the rest!

## Practical Implications

### ✅ Always Practical (any N):
- **O(1)** - Instant
- **O(log N)** - Nearly instant
- **O(N)** - Linear scaling

### ⚠️ Usually Practical:
- **O(N log N)** - Good for sorting (up to millions of items)

### ⚠️ Sometimes Practical (depends on N):
- **O(N<sup>2</sup>)** - OK for small datasets (up to ~10,000 items)
- **O(N<sup>3</sup>)** - Only for tiny datasets (up to ~1,000 items)

### ❌ Rarely Practical:
- **O(2<sup>N</sup>)** - Only for very small N (up to ~25)
- **O(N!)** - Only for trivial N (up to ~12)

## Interactive Exploration

<big-o algos="array search sort tsp knap" step="x2" max="1024"></big-o>

Try doubling steps (`x2`) to see exponential exploration of the space!

> [!TIP]
> When you see nested loops in code, think about how the work multiplies: 1 loop = **O(N)**, 2 nested = **O(N<sup>2</sup>)**, 3 nested = **O(N<sup>3</sup>)**. Each level makes it exponentially worse!
