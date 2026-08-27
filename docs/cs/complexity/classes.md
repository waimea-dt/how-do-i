# P, NP, NP-Complete, NP-Hard

Computer scientists sort problems into classes based on how hard they are to **solve** and to **verify**:

> [!NOTE]
> **Verifying** means checking that a solution is the correct one, so for a Sudoku puzzle, verifying the numbers are all in the correct place, or for the TSP, verifying that the route found is actually the shortest possible.


| Class           | Meaning                                                                            |
| --------------- | ---------------------------------------------------------------------------------- |
| **P**           | **Easy to solve** (in polynomial time)                                     |
| **NP**          | **Easy to verify** (even if hard to solve)                         |
| **NP-Hard**     | **Hard to solve** (easy to verify if in NP, or hard if not)                             |
| **NP-Complete** | **Hard to solve** but **easy to verify** |

> [!TIP]
> **NP** does not mean 'non-polynomial', it means '**non-deterministic polynomial time**'

This is the relationship between the classes:

<p-np></p-np>


## Understanding the Classes

### P (**P**olynomial Time)

Problems where we can **easily find** a solution efficiently (in polynomial time).

**Examples**:
- Searching a random list: **O(N)**
- Sorting a list: **O(N log N)**
- Multiplying matrices: **O(N<sup>3</sup>)**

### NP (**N**on-deterministic **P**olynomial Time)

Problems where we can **easily verify** a solution, but we don't always know how to **find** it efficiently.

**Examples**:
- Sorting a list: easy to check it is in order: **O(N)**
- Sudoku: easy to check if a completed puzzle is correct: **O(N<sup>2</sup>)** (even if it hard to solve it in the first place: **O(2<sup>N</sup>)**)
- Factoring large numbers: easy to verify that 945,076,421 = 12347 × 76543 (even if much harder to find those factors in the first place)

> [!IMPORTANT]
> Every problem in **P** is also in **NP** (if you can solve it fast, you can obviously check it fast).

### NP-Hard (Intractable Problems)

Problems that are **intractable**: we don't know of any efficient, polynomial time solution - they are **hard to solve**.

**Examples**:
- TSP optimal / shortest route: **O(N!)**
- Knapsack problem: **O(2<sup>N</sup>)**

### NP-Complete (Intractable Problems, Easy to Verify)

Problems that are **intractable** / **hard to solve**, but which are **easy to verify** once a solution has been found.

**Examples**:
- Sudoku:
  - Easy to check if a completed puzzle is correct: **O(N<sup>2</sup>)**
  - Very hard to solve it in the first place: **O(2<sup>N</sup>)**
- 0/1 Knapsack Problem:
  - Easy to check if a solution is the best one: **O(N)**
  - Very hard to find the optimal solution: **O(2<sup>N</sup>)**


## Classes and Example Problems

<p-np markers></p-np>

> [!NOTE]
> The big open question is whether **P = NP** - can everything we can *check* quickly also be *solved* quickly? This is the unsolved [P vs NP question](/cs/complexity/p-vs-np.md)


## Real-World Problems

Explore examples of problems in each complexity class:

<p-np mode="problems"></p-np>

### Solving vs Verifying

See why each problem fits into a particular class by looking at finding a solution vs verifying a solution:

<p-np mode="verify"></p-np>


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

