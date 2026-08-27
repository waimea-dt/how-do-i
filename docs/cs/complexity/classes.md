# Complexity Classes

## P, NP, NP-Complete

Computer scientists sort problems into classes based on how hard they are:

| Class            | Meaning                                                        | Example                                  |
| ----------------- | ----------------------------------------------------------------- | ------------------------------------------ |
| **P**             | Can be **solved** quickly (polynomial time)                       | Sorting, binary search, shortest path       |
| **NP**            | Can be **checked/verified** quickly, even if hard to solve         | Sudoku, Travelling Salesperson, Knapsack     |
| **NP-Complete**   | The **hardest** problems in NP - solve one fast, and you could solve them all fast | Travelling Salesperson, Knapsack (0/1), Sudoku |

<p-np></p-np>

> [!NOTE]
> Every problem in **P** is also in **NP** (if you can solve it fast, you can obviously check it fast). The big open question is whether **P = NP** - can everything we can *check* quickly also be *solved* quickly?

### Verifying vs Finding

The key idea behind NP: **checking** an answer is easy, **finding** one is hard.

| Problem | Verifying a solution | Finding a solution |
| ------- | --------------------- | -------------------- |
| Sudoku | Check the grid follows the rules - fast | Solve the empty grid - slow |
| Travelling Salesperson | Add up a route's distance - fast | Find the shortest route - slow |
| Factoring a number | Multiply two factors together - fast | Find the factors of a huge number - slow |

## Why This Matters: The P vs NP Question

**Can every problem we can check quickly also be solved quickly?** Nobody knows! It's one of the [Millennium Prize Problems](https://en.wikipedia.org/wiki/Millennium_Prize_Problems), worth **$1,000,000** to whoever proves it either way.

Most computer scientists believe **P ≠ NP** - that some problems really are fundamentally hard, not just unsolved.

> [!IMPORTANT]
> Modern encryption (like RSA) relies on **P ≠ NP** being true. Factoring huge numbers is believed to be intractable - if it turned out to be easy, most internet security would break.

## Real-World Impact of Intractability

Since we can't solve intractable problems exactly for large N, we use:

- **Approximation algorithms** - find a solution close to the best one, quickly
- **Heuristics** - practical "rules of thumb" that usually work well

See [Approximation Algorithms & Heuristics](approximation.md) for how this works in practice.

## Key Terms

<flashcards>

- # Tractable

    ---

    A problem solvable in **polynomial** time - practical for real input sizes.

- # Intractable

    ---

    A problem that needs **non-polynomial** (exponential-type) time - only practical for tiny inputs.

- # P

    ---

    Problems that can be **solved** in polynomial time.

- # NP

    ---

    Problems where a solution can be **verified** in polynomial time (even if hard to find).

- # NP-Complete

    ---

    The hardest problems in NP - solving one efficiently would solve them all.

- # P vs NP

    ---

    The unsolved question: can everything we can **check** quickly also be **solved** quickly? Most believe **P ≠ NP**.

</flashcards>

## Try It Yourself

<tsp cities="10"></tsp>

Increase the number of cities - notice how quickly finding the *best* route becomes impractical, even though checking any one route is instant.

