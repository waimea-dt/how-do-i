# The Bin Packing Problem

## The Problem

You have a set of **items**, each with a **size**, and any number of **bins**, each with the same fixed **capacity**. How do you pack every item into the **fewest possible bins**, without any bin going over capacity?

### Real-World Examples

- **Loading trucks**: fitting the most packages onto the fewest delivery vehicles
- **Memory allocation**: fitting programs or files into fixed-size blocks of storage
- **Cloud computing**: packing virtual machines onto the fewest physical servers

## Why It's Hard

To guarantee the **minimum** number of bins, brute force must try every possible way of assigning items to bins. For N items, this gives a complexity of **O(N<sup>N</sup>)** - even worse than the Knapsack problem's **O(2<sup>N</sup>)**.

<big-o algos="pack-brute" max="12" step="1"></big-o>

> [!NOTE]
> Like the [Knapsack Problem](/cs/complexity/knapsack.md), Bin Packing is **NP-hard** - easy to check whether a packing is valid, but hard to guarantee it uses the fewest bins possible.

### Try It Yourself

<bin-packing capacity="10" items="3 5 8 3 5 9"></bin-packing>

Watch brute force test different ways of grouping items into bins to find the optimal packing.

## A Faster (But Imperfect) Approach: Next Fit

Instead of checking every possible arrangement, **Next Fit** packs items sequentially: if the current item doesn't fit in the current bin, open a **new** bin.

<bin-packing method="next-fit" capacity="10"></bin-packing>

- **Time**: **O(N)** - very fast!
- **Quality**: simple, but often wastes space - once a bin is skipped, it's never used again

## A Better Heuristic: Best Fit

**Best Fit** checks *all* currently open bins, and places each item into the one with the **least remaining space** that can still fit it.

<bin-packing method="best-fit" capacity="10"></bin-packing>

- **Time**: **O(N log N)** - still fast
- **Quality**: usually packs tighter than Next Fit, but still not guaranteed optimal

## Comparing Approaches

<big-o algos="pack-brute pack-next-fit pack-best-fit" max="12" step="1"></big-o>

| Approach   | Complexity        | Guaranteed Optimal? |
| ---------- | ------------------ | -------------------- |
| Brute Force | **O(N<sup>N</sup>)** | ✅ Yes, but only for tiny N |
| Next Fit   | **O(N)**            | ❌ No                |
| Best Fit   | **O(N log N)**      | ❌ No                |

> [!TIP]
> Just like the Knapsack and Travelling Salesperson problems, Bin Packing trades a guarantee of the *perfect* answer for a *fast, good enough* one at real-world scale.

## Key Terms

<flashcards>

- # 1D Bin Packing Problem

    ---

    Pack every item into the **fewest possible bins** of fixed capacity, without exceeding any bin's capacity.

- # Why Bin Packing is intractable

    ---

    Guaranteeing the fewest bins needs brute force to try every arrangement - **O(N<sup>N</sup>)**.

- # Next Fit heuristic

    ---

    Packs items in order, opening a **new bin** whenever the current item doesn't fit the current one.

- # Best Fit heuristic

    ---

    Places each item into the **open bin with the least remaining space** that can still fit it.

</flashcards>

## Further Reading

- [Wikipedia - Bin Packing Problem](https://en.wikipedia.org/wiki/Bin_packing_problem) - formal definition and known approximation results
- [GeeksforGeeks - Bin Packing Problem](https://www.geeksforgeeks.org/dsa/bin-packing-problem-minimize-number-of-used-bins/) - worked examples of Next Fit and Best Fit
