# Algorithm Design & Optimisation

## Different Strategies, Different Results

There's often more than one way to design an algorithm for the same problem. The **strategy** you choose can make the difference between **O(N log N)** and **O(N!)**.

## Divide and Conquer

**Split** the problem into smaller pieces, **solve** each piece, then **combine** the results.

**Example**: Merge sort splits a list in half, sorts each half, then merges them back together - **O(N log N)**.

<algo-race type="sort" size="100"></algo-race>

**Works well when**: subproblems don't depend on each other (e.g. binary search, merge sort).

## Greedy Algorithms

Make the **best choice available right now**, without looking ahead, and never go back on a decision.

**Example**: Given a knapsack, always pack the item with the best value-to-weight ratio first.

<knapsack solve="greedy" capacity="25" items="2|3 3|4 4|5 5|8 7|9 9|10"></knapsack>

**Works well when**: the locally best choice always leads to the globally best result (e.g. picking the earliest-finishing activity). **Fails** when it doesn't - greedy can lock in a choice that blocks a better overall solution.

## Dynamic Programming

Break a problem into **overlapping** subproblems, and **remember** each answer so you never solve the same subproblem twice.

**Example**: Solving the Knapsack problem by building up a table of "best value so far" for every weight limit, instead of checking every subset from scratch.

<knapsack solve="dynamic" capacity="25" items="2|3 3|4 4|5 5|8 7|9 9|10"></knapsack>

**Works well when**: the same smaller calculation would otherwise be repeated many times.

## Choosing a Strategy

| Strategy               | Subproblems  | Example                | Typical result           |
| ----------------------- | ------------- | ------------------------ | --------------------------- |
| **Divide & Conquer**    | Independent   | Merge sort, binary search | **O(N log N)**              |
| **Greedy**              | None (no backtracking) | Activity selection | Fast, but not always optimal |
| **Dynamic Programming** | Overlapping   | Knapsack (0/1)            | Optimal, but slower than greedy |

## Optimising an Algorithm

"Optimising" doesn't just mean writing faster code - it usually means **choosing a better strategy** so the complexity class itself improves:

- Swap nested loops (**O(N<sup>2</sup>)**) for a smarter approach (**O(N log N)**)
- Sort data once so it can be searched with binary search instead of linear search
- Cache/remember repeated sub-calculations (dynamic programming) instead of recalculating them

> [!TIP]
> A small change in strategy usually matters far more than "cleaning up the code" - going from **O(N<sup>2</sup>)** to **O(N log N)** beats any speed boost from a faster computer.

## Key Terms

<flashcards>

- # Divide and conquer

    ---

    Split a problem into smaller independent pieces, solve each, then combine the results.

- # Greedy algorithm

    ---

    Always makes the **best choice right now**, without reconsidering - fast, but not always optimal.

- # Dynamic programming

    ---

    Solves **overlapping** subproblems once each, remembering results to avoid repeating work.

- # Optimising an algorithm

    ---

    Usually means choosing a **better strategy** to improve its complexity class, not just writing faster code.

</flashcards>
