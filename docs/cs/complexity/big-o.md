# Understanding Big-O Notation

## What is Big-O?

**Big-O notation** is a maths shorthand for describing how an algorithm's effort grows as the input size (**N**) grows.

> [!NOTE]
> The "O" stands for "**order of**", written as `O(...)`, where `...` is a function of **N**.


## Why use Big-O?

Instead of saying "this took 5,234 steps for 100 items", we say "this algorithm is **O(N<sup>2</sup>)**". This tells us how the algorithm **scales**, and lets us **compare** algorithms fairly, no matter what computer runs them.

Big-O ignores:
- ❌ Constants (we don't care if it's 2N or 1000N)
- ❌ Lower-order terms: we don't care about O(N) if part of the algorithm is O(N<sup>2</sup>)
- ❌ Hardware differences
- ❌ Lucky, 'best-case' outcomes (e.g. finding a value in a list the first try)

Big-O focuses on:
- ✅ How the effort **scales** as as **N becomes large**
- ✅ The **worst-case** scenario: what is the worst possible run-time
- ✅ The **dominant term**: the effort required for O(N<sup>2</sup>) complexity quickly dominates O(N) complexity effort

## The Complexities You Need to Know

Here are the most common Big-O complexities you'll encounter, from fastest to slowest:

| Notation             | Name                                                              | Example                                                         | When N doubles, the effort... |
| -------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------- | ----------------------------- |
| **O(1)**             | [Constant Time](/cs/complexity/common?id=o1---constant-time)           | Array access by in**x                                           | ✅ No change                  |
| **O(log N)**         | [Logarithmic Time](/cs/complexity/common?id=olog-n---logarithmic-time) | Binary se**ch                                                   | ✅ Just 1 extra step          |
| **O(N)**             | [Linear Time](/cs/complexity/common?id=on---linear-time)               | Linear se**ch                                                   | ✅ Doubles                    |
| **O(N log N)**       | [Log-Linear Time](/cs/complexity/common?id=on-log-n---log-linear-time) | Merge so**                                                      | ✅ Slightly more than doubles |
| **O(N<sup>k</sup>)** | [Polynomial Time](/cs/complexity/common?id=on2---quadratic-time)       | Nested loops (**O(N<sup>2</sup>)**, **O(N<sup>3</sup>)**, etc.) | ⚠️ Quadruples, 8x, etc.             |
| **O(2<sup>N</sup>)** | [Exponential Time](/cs/complexity/common?id=o2n---exponential-time)    | Trying every subset of a li**                                   | ⚠️ Squares                    |
| **O(N!)**            | [Factorial Time](/cs/complexity/common?id=on---factorial-time)         | Trying every ordering of a list                                 | ❌ Astronomically worse       |

> [!TIP]
> **O(N<sup>k</sup>)** is read 'Polynomial Time' - it covers **O(N<sup>2</sup>)**, **O(N<sup>3</sup>)**, and so on, for any fixed power **k**.


## Polynomial vs Non-Polynomial

This split matters more than any individual notation:

| Type               | Notations                                                              | Practical for large N?  |
| ------------------ | ---------------------------------------------------------------------- | ----------------------- |
| **Polynomial**     | **O(1)**, **O(log N)**, **O(N)**, **O(N log N)**, **O(N<sup>k</sup>)** | ✅ Usually yes          |
| **Non-polynomial** | **O(2<sup>N</sup>)**, **O(N!)**                                        | ❌ No - Only for tiny N |

> [!NOTE]
> The effort for non-polynomial complexity algorithms explodes so fast they become useless almost immediately. This is exactly what makes some problems [**intractable**](tractability.md).


## Visualising Growth

Drag the slider to see how each complexity grows as N increases:

<big-o-chart></big-o-chart>

> [!TIP]
> Notice how **O(1)** and **O(log N)** barely move, **O(N)** climbs steadily, and **O(2<sup>N</sup>)** / **O(N!)** shoot off the chart almost immediately.


## Doubling N

A quick way to spot a complexity experimentally: double N, and see what happens to the effort.

| Complexity           | Effort when N doubles       |
| --------------------- | ---------------------------- |
| **O(1)**             | ✅ No change                     |
| **O(log N)**         | ✅ Adds 1 step                   |
| **O(N)**             | ✅ Doubles                       |
| **O(N log N)**       | ✅ A little more than doubles    |
| **O(N<sup>2</sup>)** | ⚠️ Quadruples                    |
| **O(2<sup>N</sup>)** | ⚠️ Squares                        |
| **O(N!)**            | ❌ Already impossible             |

## Real Operation Counts

| N         | **O(log N)** | **O(N)**  | **O(N log N)** | **O(N<sup>2</sup>)** | **O(2<sup>N</sup>)**       |
| --------- | ------------ | --------- | ---------------- | ------------------------ | ---------------------------- |
| 10        | 3            | 10        | 33                | 100                       | 1,024                          |
| 100       | 7            | 100       | 664               | 10,000                    | ❌ ~10<sup>30</sup> (huge)        |
| 1,000     | 10           | 1,000     | 9,966             | 1,000,000                 | ❌ ~10<sup>301</sup> (impossible) |
| 1,000,000 | 20           | 1,000,000 | 19,931,569        | ⚠️ 1 x 10<sup>12</sup>       | ❌ impossible                     |

## Key Terms

<flashcards>

- # Big-O notation

    ---

    A maths shorthand, **O(...)**, describing how an algorithm's effort grows as **N** grows.

- # Polynomial time

    ---

    Complexities like **O(N)**, **O(N<sup>2</sup>)**, **O(N<sup>k</sup>)** - practical to solve for large N.

- # Non-polynomial time

    ---

    Complexities like **O(2<sup>N</sup>)**, **O(N!)** - only practical for tiny N.

- # Why does Big-O ignore constants?

    ---

    Because for **large N**, the growth rate (shape of the curve) matters far more than any fixed multiplier.

</flashcards>

## Further Reading

- [Computer Science Field Guide - Complexity](https://www.csfieldguide.org.nz/en/chapters/algorithms/complexity/) - covers Big-O and complexity classes

