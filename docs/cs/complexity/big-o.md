# Understanding Big-O Notation

## What is Big-O?

**Big-O notation** is a mathematical way to describe how an algorithm's performance changes as the input size grows. It tells us the **worst-case** growth rate.

The "O" stands for "**order of**" and we write it as `O(...)` where the `...` is a function of N (the input size).

## Why use Big-O?

Instead of saying "this algorithm takes 5,234 operations for 100 items", we say it's **O(N<sup>2</sup>)**. This tells us:

- How it **scales** (what happens when N gets large?)
- How it **compares** to other algorithms
- Whether it's **practical** for large datasets

Big-O ignores:
- ❌ Constants (we don't care if it's 2N or 1000N)
- ❌ Lower-order terms (we don't care about N<sup>2</sup> + 5N + 3, just N<sup>2</sup>)
- ❌ Hardware differences

It focuses on:
- ✅ The **dominant term** that matters at scale
- ✅ The **growth pattern**

## Common Complexities

Here are the most common Big-O complexities you'll encounter, from fastest to slowest:

| Notation             | Name        | Example                               | What happens when N doubles? |
| -------------------- | ----------- | ------------------------------------- | ---------------------------- |
| **O(1)**             | Constant    | Array access by index                 | No change                    |
| **O(log N)**         | Logarithmic | Binary search                         | Adds just 1 step             |
| **O(N)**             | Linear      | Linear search                         | Doubles                      |
| **O(N log N)**       | Log-Linear  | Merge sort, Quick sort                | Slightly more than doubles   |
| **O(N<sup>2</sup>)** | Quadratic   | Bubble sort, 2 nested loops           | Quadruples                   |
| **O(N<sup>3</sup>)** | Cubic       | Matrix multiplication, 3 nested loops | 8× slower                    |
| **O(2<sup>N</sup>)** | Exponential | Subset generation                     | Squares                      |
| **O(N!)**            | Factorial   | Permutation generation                | Massively worse              |

> [!NOTE]
> **O(N<sup>k</sup>)**, or **Polynomial** complexity is the generalised version of complexities such as O(N<sup>2</sup>), O(N<sup>3</sup>), etc.


## Visualizing Growth

See how these complexities grow as n increases:

<big-o-chart></big-o-chart>

Drag the slider to see how quickly exponential and factorial complexities explode!


## Reading Big-O

When you see **O(N<sup>2</sup>)**, read it as:
> "As N gets large, the algorithm takes **at most** proportional to N<sup>2</sup> operations"

Key points:
- It's an **upper bound** (worst case)
- It describes **growth rate**, not exact count
- Constants are hidden (both 5N<sup>2</sup> and 0.001N<sup>2</sup> are **O(N<sup>2</sup>)**)


## Why Ignore Constants?

You might wonder: "If Algorithm A takes 2N steps and Algorithm B takes 1000N steps, aren't they different?"

Yes, for small N! But Big-O focuses on **asymptotic** behavior (what happens as N → ∞):

- For small N: Constants matter
- For large N: Growth rate dominates

An **O(N)** algorithm will **always** eventually beat an **O(N<sup>2</sup>)** algorithm as N grows, no matter what the constants are.

