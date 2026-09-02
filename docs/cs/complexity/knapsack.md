# The Knapsack Problem

## The Problem

You have a **knapsack** (backpack) with a maximum weight capacity, and a collection of items, each with a **weight** and a **value**. Which items should you pack to **maximise total value** without going over the weight limit?

### Real-World Examples

- **Resource allocation**: which projects to fund with a limited budget?
- **Cargo loading**: what to load on a truck for maximum profit?
- **Memory management**: which processes to load into limited RAM?

## The 0/1 Constraint

In the **0/1 Knapsack Problem**, each item can be used **once or not at all** - no taking half an item. This makes it **NP-complete**.

## Try It Yourself

<knapsack capacity="25" items="2|3 3|4 4|5 5|8 7|9 9|10"></knapsack>

Watch the brute force approach test every subset of items to find the optimal combination!

## Why It's Hard

For N items, there are **2<sup>N</sup>** possible subsets to check - each item is either "in" or "out":

| Items | Subsets to Check |
| ----- | ---------------- |
| 10    | 1,024            |
| 20    | 1,048,576        |
| 30    | 1,073,741,824    |

<big-o algos="knap-brute" max="80" step="10"></big-o>

<knapsack speed="slow" capacity="25" items="2|3 3|4 4|5 5|8 7|9"></knapsack>

## A Faster (But Imperfect) Approach

Instead of checking every subset, a **greedy heuristic** sorts items by **value-to-weight ratio** and takes the best ones first:

<knapsack solve="greedy" capacity="25" items="2|3 3|4 4|5 5|8 7|9 9|10"></knapsack>

- **Time**: **O(N log N)** - fast!
- **Quality**: usually good, but can be wrong

### When Greedy Fails

| Item | Weight | Value | Ratio |
| ---- | ------ | ----- | ----- |
| A    | 6      | 6     | 1.0   |
| B    | 5      | 5     | 1.0   |
| C    | 5      | 5     | 1.0   |

Capacity = 10. Greedy takes A first (value 6) and can't fit anything else. The **optimal** answer is B + C (value 10)!

<knapsack solve="compare-greedy" capacity="25" items="2|3 3|4 4|5 5|8 7|9 9|10 5|7 9|2"></knapsack>

> [!NOTE]
> There's also a smarter exact method, **dynamic programming**, that avoids checking every subset - see [Algorithm Design & Optimisation](optimisation.md).

## Key Terms

<flashcards>

- # 0/1 Knapsack Problem

    ---

    Choose items (each used **once or not at all**) to maximise value without exceeding a weight limit.

- # Why Knapsack is intractable

    ---

    Checking a subset is fast, but brute-force checking **every** subset is **O(2<sup>N</sup>)**.

- # Greedy heuristic (Knapsack)

    ---

    Pack items by best **value-to-weight ratio** first - fast, but can miss the optimal combination.

- # Dynamic programming (Knapsack)

    ---

    Builds a table of **best value so far** for every weight limit - finds the exact optimal answer, faster than checking every subset.

</flashcards>

## Complexity Comparison

<big-o algos="knap-brute knap-dynamic knap-greedy" max="25"></big-o>

