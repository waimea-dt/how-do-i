# Quiz: Complexity Classes & Optimisation

Test your understanding of P, NP, NP-complete, tractability, and algorithm design strategies.

<quiz>

## Complexity Classes & Optimisation Quiz

- # What does it mean for a problem to be "tractable"?

    ---

    - [x] It can be solved in a reasonable (polynomial) amount of time
    - [ ] It has never been solved by anyone
    - [ ] It can only be solved by quantum computers
    - [ ] It has no correct solution

    ---

    - [x] **Correct!** Tractable problems can be solved efficiently, even as N grows large.
    - [ ] **Not quite.** Tractability is about solving time, not whether a solution exists or who can compute it.

- # A problem in class P is one that can be...

    ---

    - [x] Solved in polynomial time
    - [ ] Verified in polynomial time, but not necessarily solved quickly
    - [ ] Solved only by guessing randomly
    - [ ] Proven to have no solution

    ---

    - [x] **Correct!** P problems can be **solved** efficiently, not just checked.
    - [ ] **Not quite.** That description fits NP, not P.

- # A problem in class NP is one that can be...

    ---

    - [ ] Solved instantly on any computer
    - [x] Verified quickly, even if finding a solution is hard
    - [ ] Solved only using brute force
    - [ ] Proven impossible to solve

    ---

    - [x] **Correct!** NP problems may be hard to solve, but a proposed solution can be checked quickly.
    - [ ] **Not quite.** NP is about fast verification, not fast solving or provable impossibility.

- # What is special about NP-Complete problems?

    ---

    - [x] Solving any one of them efficiently would solve all of them efficiently
    - [ ] They can never be solved by any computer
    - [ ] They are always solved using sorting algorithms
    - [ ] They only exist in theory, never in real life

    ---

    - [x] **Correct!** NP-Complete problems are all equally hard - an efficient solution to one solves them all.
    - [ ] **Not quite.** NP-Complete problems show up in real logistics, scheduling, and packing problems.

- # What is the "P vs NP" question asking?

    ---

    - [ ] Whether computers will ever exist
    - [x] Whether every quickly-checkable problem can also be quickly solved
    - [ ] Whether NP problems are always slower than P problems
    - [ ] Whether P is a subset of encryption

    ---

    - [x] **Correct!** It's the unsolved question of whether checking and solving are equally easy for every problem.
    - [ ] **Not quite.** It's specifically about the checking vs. solving gap.

- # Why does modern encryption rely on **P ≠ NP**?

    ---

    - [x] Because factoring large numbers is believed to be intractable to solve, but easy to verify
    - [ ] Because computers can't multiply large numbers
    - [ ] Because passwords are always 8 characters long
    - [ ] Because P and NP don't apply to encryption

    ---

    - [x] **Correct!** If factoring became easy (P = NP), most current encryption would break.
    - [ ] **Not quite.** Encryption's security specifically depends on factoring being hard to reverse.

- # A greedy algorithm makes its decisions by...

    ---

    - [ ] Trying every possible option before choosing
    - [x] Picking the best choice available right now, without looking back
    - [ ] Randomly guessing an answer
    - [ ] Remembering every previous subproblem's answer

    ---

    - [x] **Correct!** Greedy algorithms commit to the locally best choice at each step and never backtrack.
    - [ ] **Not quite.** That describes brute force, random search, or dynamic programming instead.

- # Dynamic programming is most useful when a problem has...

    ---

    - [ ] Completely independent subproblems
    - [x] Overlapping subproblems that would otherwise be recalculated
    - [ ] No subproblems at all
    - [ ] Only one possible solution

    ---

    - [x] **Correct!** DP saves time by remembering answers to subproblems that show up again and again.
    - [ ] **Not quite.** Independent subproblems are better suited to divide and conquer.

</quiz>
