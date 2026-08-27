# Best, Worst, and Average Case

## Why One Number Isn't Enough

An algorithm's effort can depend on **the exact input**, not just its size (N). We describe this with three cases:

| Case        | Meaning                              | Example (searching a list)                     |
| ----------- | ------------------------------------- | ------------------------------------------------ |
| **Best**    | The luckiest possible input            | The item is the very first one checked           |
| **Average** | Typical performance over many inputs   | On average, you find it about halfway through    |
| **Worst**   | The unluckiest possible input          | The item is last, or not there at all            |

## Example: Linear Search

Searching an unsorted list of N items for a value:

| Case        | Complexity   | When it happens                  |
| ----------- | ------------ | ---------------------------------- |
| **Best**    | **O(1)**     | Target is the first item             |
| **Average** | **O(N)**     | Target is found halfway through, on average |
| **Worst**   | **O(N)**     | Target is last, or missing entirely  |

Try it yourself:

<algo-race type="search" size="100"></algo-race>

> [!IMPORTANT]
> We usually focus on the **worst case**. It guarantees performance - you know your algorithm will never be slower than that, no matter what input it's given.

## Comparing Algorithms Fairly

When comparing two algorithms, make sure it's a fair comparison:

- Both solve the **same problem**
- Measured on the **same kind of input**
- Focus on **large N** - for small N, constants can make a "worse" algorithm look faster

| Algorithm     | Complexity            |
| ------------- | ---------------------- |
| Linear Search | **O(N)**               |
| Binary Search | **O(log N)**           |
| Bubble Sort   | **O(N<sup>2</sup>)**   |
| Merge Sort    | **O(N log N)**         |

## Crossover Points

Sometimes a "worse" complexity is actually faster for small N.

- Algorithm A: 1000N operations
- Algorithm B: N<sup>2</sup> operations

| N      | A (1000N)  | B (N<sup>2</sup>) | Winner |
| ------ | ---------- | -------------------- | ------ |
| 10     | 10,000     | 100                   | B      |
| 1,000  | 1,000,000  | 1,000,000              | Tie    |
| 10,000 | 10,000,000 | 100,000,000            | A      |

The **crossover point** (here, around N=1,000) is where the lower-complexity algorithm takes over. This is why complexity analysis focuses on **large N** - that's where growth rate wins out over constants.

## Key Terms

<flashcards>

- # Best case

    ---

    The complexity for the **luckiest possible input**.

- # Average case

    ---

    The **typical** complexity, over many different inputs.

- # Worst case

    ---

    The complexity for the **unluckiest possible input** - the one we usually design for.

- # Crossover point

    ---

    The input size (N) where a lower-complexity algorithm starts to beat a higher-complexity one.

</flashcards>

> [!TIP]
> When an exam question asks for "the" complexity of an algorithm without saying which case, it usually means the **worst case**.
