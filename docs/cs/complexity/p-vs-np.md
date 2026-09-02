# P vs NP

## The Million-Dollar Question

**P vs NP** is the most important unsolved problem in computer science - one of the [Millennium Prize Problems](https://en.wikipedia.org/wiki/Millennium_Prize_Problems). The Clay Mathematics Institute offers a **$1,000,000 prize** for anyone who can prove the answer!

> ### The P vs NP Question:
>
> **If we can quickly check that a solution is correct, can we also quickly find that solution?**

<videoembed id="YX40hbAHx3s"></videoembed>

> [!TIP]
> See [P, NP, NP-Complete, NP-Hard](/cs/complexity/classes.md) for a refresher on what each class actually means.


### In Terms of Complexity Classes: P and NP

Based on the complexity classes...

<p-np markers></p-np>

... the P vs NP question becomes:

<speak>

![Mac](../../_assets/macs/macintosh-thinking.svg)

If a problem is in NP, does that mean it is also in P?

Does **P = NP**?

</speak>


Most computer scientists believe **P ≠ NP** - that some problems really are fundamentally hard to solve, not just unsolved because nobody's tried hard enough.



## Why We Think P ≠ NP

1. **Decades of failure** - despite intense effort, nobody has found an efficient algorithm for any NP-Complete problem
2. **Finding feels harder than checking** - verifying a Sudoku solution is trivial; solving one from scratch clearly isn't
3. **Practical evidence** - these problems really do behave as if they're hard, even throwing computing power at them

Proving that P ≠ NP, though, is another matter - it means showing that **no possible algorithm** (not just the ones we've thought of) could *ever* solve these problems quickly. That's an *extremely* hard thing to prove.


## What If P ≠ NP? (The World Today)

This is the assumption almost everything below relies on:

- **Encryption stays safe** - RSA and similar systems depend on factoring being hard to solve but easy to verify
- **Some problems will always need shortcuts** - see [Approximation Algorithms & Heuristics](/cs/complexity/approximation.md) and the [real-world impact of intractability](/cs/complexity/intractability.md)
- **School timetables, bus routes, and exam schedules stay imperfect** - software can only ever find a *good* answer in reasonable time, never a provably perfect one

## What If P = NP? (Hypothetically)

In a hypothetical "P = NP" world, problems that were :

<p-np markers collapse></p-np>

If it turned out that P = NP, the implications would be huge:

| Area | Real-world impact | School-life impact |
|---|---|---|
| **Cryptography** | RSA and most internet security instantly breaks | Nothing - but every "secure" school login and HTTPS portal would need replacing overnight |
| **Optimisation** | Perfect delivery routes and staff rosters, found instantly | Perfect timetables, exam schedules, and bus routes with **zero** clashes or wasted time |
| **Science** | Protein folding and drug design massively accelerated | - |
| **AI** | Complex planning and decision-making become far easier | Software could instantly find the ideal subject-line allocation for every student |

Almost every computer scientist believes this scenario is **extremely unlikely** - but nobody has proven it's impossible.

## Practical Impact Today

Even without a formal proof, we act as if **P ≠ NP** is true:

- **Don't chase a perfect algorithm** for an NP-Complete problem - focus on approximations, heuristics, or special cases instead
- **Design security around hardness** - encryption relies on certain problems staying difficult to solve
- **Accept "good enough, on time"** - for problems like timetabling, a fast, decent answer beats a perfect one that never finishes calculating

> [!TIP]
> When you encounter an NP-Complete problem, don't look for the perfect algorithm - it probably doesn't exist! Focus on approximations, heuristics, or restricting to special cases.

## Key Terms

<flashcards>

- # P vs NP

    ---

    The unsolved question: can everything we can **verify** quickly also be **solved** quickly?

- # The Millennium Prize

    ---

    The Clay Mathematics Institute offers **$1,000,000** for a proof of P vs NP, either way.

- # P ⊆ NP

    ---

    Every problem we can **solve** quickly can also be **verified** quickly - but not necessarily the other way round.

- # Why encryption depends on P ≠ NP

    ---

    Factoring large numbers is believed **intractable to solve** but **easy to verify** - if that changed, RSA encryption would break.

</flashcards>
