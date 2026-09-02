# Tractability

## What is Tractability?

- **Tractable**: a problem that can be solved in a reasonable (**polynomial**) amount of time
- **Intractable**: a problem where solving it takes so long (**non-polynomial**) that it's impossible for realistic input sizes

> [!IMPORTANT]
> It's the **worst-case** performance, when **N is large** that dictates whether an algorithm is tractable or intractable.


## Polynomial vs Non-Polynomial

As has been mentioned before, this split matters more than any individual notation as it determines the tractability:

| Type               | Notations                                                              | Practical for large N?  |
| ------------------ | ---------------------------------------------------------------------- | ----------------------- |
| **Polynomial**     | **O(1)**, **O(log N)**, **O(N)**, **O(N log N)**, **O(N<sup>k</sup>)** | ✅ Tractable |
| **Non-polynomial** | **O(2<sup>N</sup>)**, **O(N!)**                                        | ❌ Intractable |


## Tractable Problems

Algorithms that have **polynomial time complexity** are *generally* considered **tractable**:
- **Array access**: O(1)
- **Searching**: O(N) or O(log N)
- **Sorting**: O(N log N) or O(N<sup>2</sup>)
- **Matrix multiplication**: O(N<sup>3</sup>)

<big-o algos="big-o-constant big-o-log-linear big-o-linear big-o-quadratic big-o-cubic" max="10000000" step="x10"></big-o>

> [!NOTE]
> Higher-order polynomial, e.g. O(N<sup>3</sup>), can become intractable for large N

<big-o-chart max="100" value="5" enabled="o1 ologn on onlogn on2 on3"></big-o-chart>


## Intractable Problems

Algorithms that have **non-polynomial time complexity** are *generally* considered **intractable**:
- **Generating sub-sets of a list**: O(2<sup>N</sup>)
- **Brute-force solution to TSP**: O(N!)

<big-o algos="big-o-exponential big-o-factorial" max="256" step="x4"></big-o>

> [!NOTE]
> Even for relatively small values of N, computational effort is exceptionally high

<big-o-chart max="100" value="5" enabled="on o2n ofact"></big-o-chart>

## Key Terms

<flashcards>

- # Tractable

    ---

    A problem solvable in **polynomial** time - practical for realistic input sizes.

- # Intractable

    ---

    A problem needing **non-polynomial** time - impractical for large N.

- # What decides tractability

    ---

    The **worst-case** performance when **N is large**.

- # Higher-order polynomials

    ---

    Complexities like **O(N<sup>3</sup>)** are technically polynomial, but can still become impractical for large N.

</flashcards>



