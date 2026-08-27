# Approximation Algorithms & Heuristics

## When "Perfect" Isn't Possible

Some problems are **intractable** - no algorithm can find the *best* solution in a reasonable time for large N. But we usually still need *an* answer!

Instead of the perfect solution, we settle for a **good enough** one, found quickly.

## Two Approaches

| Approach                  | Meaning                                              | Guarantee?                          |
| --------------------------- | ------------------------------------------------------ | -------------------------------------- |
| **Approximation algorithm** | An algorithm proven to get **close** to the best answer | Yes - e.g. "never more than 25% worse" |
| **Heuristic**              | A practical "rule of thumb" that usually works well      | No formal guarantee                    |

## Example: Travelling Salesperson

Finding the **shortest possible route** through every city is **O(N!)** - impossible for more than ~12 cities.

Instead, use the **nearest neighbour heuristic**: always travel to the closest unvisited city.

<tsp cities="10"></tsp>

- **Time**: **O(N<sup>2</sup>)** - fast!
- **Quality**: typically about 25% longer than the optimal route

## Example: Knapsack

Checking every possible combination of items is **O(2<sup>N</sup>)**.

Instead, use a **greedy heuristic**: pack items with the best value-to-weight ratio first.

<knapsack solve="compare-greedy" capacity="25" items="2|3 3|4 4|5 5|8 7|9 9|10"></knapsack>

- **Time**: **O(N log N)** - fast!
- **Quality**: usually good, but can sometimes miss the best combination

## Why This Trade-Off Is Worth It

| Approach       | Time                | Result                     |
| --------------- | ---------------------- | ---------------------------- |
| Optimal (brute force) | **O(N!)** / **O(2<sup>N</sup>)** | Best possible - but only for tiny N |
| Heuristic       | **O(N log N)** / **O(N<sup>2</sup>)** | Good enough - works for any N  |

> [!TIP]
> For real-world intractable problems (delivery routes, packing trucks, scheduling staff), a "pretty good" answer in seconds beats a "perfect" answer that takes years.

## Key Terms

<flashcards>

- # Approximation algorithm

    ---

    An algorithm with a **proven guarantee** of how close it gets to the optimal answer.

- # Heuristic

    ---

    A practical shortcut that usually gives a good answer quickly, with **no formal guarantee**.

- # Nearest neighbour (TSP heuristic)

    ---

    Always travel to the **closest unvisited city** - fast, but typically ~25% worse than optimal.

- # Greedy heuristic (Knapsack)

    ---

    Pack items with the best **value-to-weight ratio** first - fast, but can miss the best combination.

</flashcards>
